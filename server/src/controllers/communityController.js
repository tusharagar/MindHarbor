import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  createPost,
  getPosts,
  getPost,
  toggleLike,
  hidePost,
  createComment,
  getComments,
  hideComment,
  toggleCommentLike,
  uploadMedia,
} from "../services/communityService.js";
import {
  analyzeContent,
  recordViolation,
  getModerationStatus,
} from "../services/moderationService.js";

const sanitize = (text) => (text || "").trim().slice(0, 5000);

// ── Human-readable ban duration string ───────────────────────────────────────
const formatBanDuration = (hours) => {
  if (hours >= 720) return "30 days";
  if (hours >= 168) return "7 days";
  if (hours >= 72) return "3 days";
  if (hours >= 24) return "1 day";
  return `${hours} hours`;
};

// ── Shared: run Gemini moderation and handle response ────────────────────────
// Returns true if content passed, false if blocked (response already sent).
const moderateAndRespond = async (userId, text, mediaFiles = [], res) => {
  // Run Gemini analysis on text + any already-uploaded media
  const analysis = await analyzeContent(text, mediaFiles);

  // CLEAN or Gemini unavailable → pass through
  if (!analysis.flagged) {
    // Still flag self-harm risk for crisis banner (but don't block the post)
    return {
      passed: true,
      containsSelfHarmRisk: analysis.containsSelfHarmRisk,
    };
  }

  // FLAGGED → record violation and compute ban
  const violation = await recordViolation(userId, {
    severity: analysis.severity,
    reason: analysis.reason,
    categories: analysis.categories,
    banHours: analysis.banHours,
  });

  const banDuration = formatBanDuration(violation.banHours);

  res.status(400).json({
    success: false,
    flagged: true,
    severity: analysis.severity,
    reason: analysis.reason,
    message: violation.isBlocked
      ? `Your account has been suspended for ${banDuration} because your content violated our community guidelines: ${analysis.reason || "inappropriate content"}.`
      : `Your content was not published because it violates our community guidelines: ${analysis.reason || "inappropriate content"}. Strike ${violation.strikes} — ${3 - violation.strikes} more may result in a suspension.`,
    strikes: violation.strikes,
    isBlocked: violation.isBlocked,
    blockedUntil: violation.blockedUntil,
    banHours: violation.banHours,
    categories: analysis.categories,
  });

  return { passed: false };
};

// ─────────────────────────────────────────────────────────────────────────────
//  1. CREATE POST
// ─────────────────────────────────────────────────────────────────────────────
export const createPostHandler = asyncHandler(async (req, res) => {
  const { content, mode = "global" } = req.body;
  const userId = req.user._id.toString();
  const institute = req.user.institution?.name || "";

  if (!["global", "institute"].includes(mode)) {
    throw new ApiError(400, 'Mode must be "global" or "institute".');
  }
  if (!content?.trim() && !req.files?.length) {
    throw new ApiError(400, "Post must have text or media.");
  }

  // Upload media FIRST so Gemini can analyze the actual content
  let media = [];
  if (req.files?.length) {
    const results = await Promise.allSettled(req.files.map(uploadMedia));
    media = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  }

  // Run Gemini moderation on text + uploaded media
  const { passed, containsSelfHarmRisk } = await moderateAndRespond(
    userId,
    content?.trim() || null,
    media, // already uploaded — Gemini fetches them
    res,
  );

  if (!passed) {
    // Clean up uploaded media since post was rejected
    if (media.length) {
      const { deleteMedia } = await import("../services/communityService.js");
      await Promise.allSettled(media.map((m) => deleteMedia(m.fileName)));
    }
    return;
  }

  const post = await createPost({
    userId,
    content: sanitize(content),
    media,
    mode,
    institute: mode === "institute" ? institute : null,
    hasCrisisFlag: containsSelfHarmRisk,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { ...post, showCrisisBanner: containsSelfHarmRisk },
        "Post created.",
      ),
    );
});

// ─────────────────────────────────────────────────────────────────────────────
//  2. GET POSTS
// ─────────────────────────────────────────────────────────────────────────────
export const getPostsHandler = asyncHandler(async (req, res) => {
  const { mode = "global", cursor } = req.query;
  const institute = req.user.institution?.name || "";

  const result = await getPosts({
    mode,
    institute: mode === "institute" ? institute : null,
    lastDoc: cursor || null,
    limit: 15,
  });

  return res.status(200).json(new ApiResponse(200, result, "Posts fetched."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  3. GET SINGLE POST
// ─────────────────────────────────────────────────────────────────────────────
export const getPostHandler = asyncHandler(async (req, res) => {
  const post = await getPost(req.params.postId);
  if (!post || post.isHidden) throw new ApiError(404, "Post not found.");
  return res.status(200).json(new ApiResponse(200, post, "Post fetched."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  4. LIKE POST
// ─────────────────────────────────────────────────────────────────────────────
export const likePostHandler = asyncHandler(async (req, res) => {
  const result = await toggleLike(req.params.postId, req.user._id.toString());
  return res.status(200).json(new ApiResponse(200, result, "Like toggled."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  5. CREATE COMMENT
// ─────────────────────────────────────────────────────────────────────────────
export const createCommentHandler = asyncHandler(async (req, res) => {
  const { content, parentId } = req.body;
  const userId = req.user._id.toString();

  if (!content?.trim()) throw new ApiError(400, "Comment cannot be empty.");

  // Moderate comment text (no media in comments)
  const { passed } = await moderateAndRespond(userId, content.trim(), [], res);
  if (!passed) return;

  const comment = await createComment({
    postId: req.params.postId,
    userId,
    content: sanitize(content),
    parentId: parentId || null,
  });

  return res.status(201).json(new ApiResponse(201, comment, "Comment added."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  6. GET COMMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const getCommentsHandler = asyncHandler(async (req, res) => {
  const comments = await getComments(req.params.postId);
  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  7. LIKE COMMENT
// ─────────────────────────────────────────────────────────────────────────────
export const likeCommentHandler = asyncHandler(async (req, res) => {
  const result = await toggleCommentLike(
    req.params.commentId,
    req.user._id.toString(),
  );
  return res.status(200).json(new ApiResponse(200, result, "Like toggled."));
});

// ─────────────────────────────────────────────────────────────────────────────
//  8. MY MODERATION STATUS
// ─────────────────────────────────────────────────────────────────────────────
export const getModerationHandler = asyncHandler(async (req, res) => {
  const status = await getModerationStatus(req.user._id.toString());
  return res
    .status(200)
    .json(new ApiResponse(200, status, "Moderation status."));
});
