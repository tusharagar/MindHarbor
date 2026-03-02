import { Router } from "express";
import { body, param } from "express-validator";

import {
  createPostHandler,
  getPostsHandler,
  getPostHandler,
  likePostHandler,
  createCommentHandler,
  getCommentsHandler,
  likeCommentHandler,
  getModerationHandler,
} from "../controllers/communityController.js";

import { protect } from "../middleware/verifyToken.js";
import { validate } from "../middleware/validate.js";
import { checkNotBlocked } from "../services/moderationService.js";
import {
  uploadCommunityMedia,
  handleCommunityUploadError,
} from "../middleware/communityUpload.js";

const router = Router();

// All routes require auth
router.use(protect);

// ── Feed ──────────────────────────────────────────────────────────────────────
// GET  /api/community/posts?mode=global|institute&cursor=<postId>
router.get("/posts", getPostsHandler);

// GET  /api/community/posts/:postId
router.get(
  "/posts/:postId",
  param("postId").notEmpty(),
  validate,
  getPostHandler,
);

// ── Create post (blocked users cannot post) ───────────────────────────────────
// POST /api/community/posts
// Content-Type: multipart/form-data
// Fields: content (text), mode (global|institute), media (files, up to 4)
router.post(
  "/posts",
  checkNotBlocked,
  uploadCommunityMedia,
  handleCommunityUploadError,
  [
    body("mode")
      .optional()
      .isIn(["global", "institute"])
      .withMessage('mode must be "global" or "institute"'),
    body("content")
      .optional()
      .isLength({ max: 5000 })
      .withMessage("Content too long (max 5000 chars)"),
  ],
  validate,
  createPostHandler,
);

// ── Likes ─────────────────────────────────────────────────────────────────────
// POST /api/community/posts/:postId/like
router.post(
  "/posts/:postId/like",
  param("postId").notEmpty(),
  validate,
  likePostHandler,
);

// ── Comments ──────────────────────────────────────────────────────────────────
// GET  /api/community/posts/:postId/comments
router.get(
  "/posts/:postId/comments",
  param("postId").notEmpty(),
  validate,
  getCommentsHandler,
);

// POST /api/community/posts/:postId/comments
router.post(
  "/posts/:postId/comments",
  checkNotBlocked,
  param("postId").notEmpty(),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty")
    .isLength({ max: 2000 })
    .withMessage("Comment too long (max 2000 chars)"),
  validate,
  createCommentHandler,
);

// POST /api/community/comments/:commentId/like
router.post(
  "/comments/:commentId/like",
  param("commentId").notEmpty(),
  validate,
  likeCommentHandler,
);

// ── Moderation self-check ─────────────────────────────────────────────────────
// GET /api/community/my-moderation
router.get("/my-moderation", getModerationHandler);

export default router;
