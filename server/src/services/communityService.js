import { getDB, getBucket } from "../config/firebase.js";
import { v4 as uuid } from "uuid";
import path from "path";

// ── Anonymous name generator ──────────────────────────────────────────────────
const ADJECTIVES = [
  "Calm",
  "Brave",
  "Kind",
  "Quiet",
  "Bright",
  "Gentle",
  "Bold",
  "Wise",
  "Hopeful",
  "Serene",
  "Curious",
  "Warm",
  "Steady",
  "Mindful",
  "Resilient",
];
const ANIMALS = [
  "Panda",
  "Owl",
  "Deer",
  "Fox",
  "Wolf",
  "Eagle",
  "Dolphin",
  "Otter",
  "Crane",
  "Lynx",
  "Raven",
  "Bear",
  "Swan",
  "Hawk",
  "Tiger",
];

export const generateAnonName = (userId) => {
  // Deterministic from userId so same user always gets same name per session context
  const seed = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const adj = ADJECTIVES[seed % ADJECTIVES.length];
  const ani = ANIMALS[(seed >> 2) % ANIMALS.length];
  return `${adj} ${ani}`;
};

// ── Upload media to Firebase Storage ─────────────────────────────────────────
export const uploadMedia = async (file) => {
  const bucket = getBucket();
  const ext = path.extname(file.originalname) || ".bin";
  const fileName = `community/${uuid()}${ext}`;
  const fileRef = bucket.file(fileName);

  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
    metadata: { firebaseStorageDownloadTokens: uuid() },
  });

  await fileRef.makePublic();
  const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  return {
    url,
    fileName,
    type: file.mimetype.startsWith("video/") ? "video" : "image",
  };
};

// ── Delete media from Firebase Storage ───────────────────────────────────────
export const deleteMedia = async (fileName) => {
  if (!fileName) return;
  try {
    await getBucket().file(fileName).delete();
  } catch (e) {
    console.warn("[Storage] Delete failed:", e.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  POSTS
// ─────────────────────────────────────────────────────────────────────────────

export const createPost = async ({
  userId,
  content,
  media,
  mode,
  institute,
}) => {
  const db = getDB();
  const now = new Date().toISOString();

  const post = {
    userId,
    anonName: generateAnonName(userId),
    content: content || "",
    media: media || [], // [{ url, fileName, type }]
    mode, // 'global' | 'institute'
    institute: mode === "institute" ? institute || "" : null,
    likes: [], // array of userIds
    commentCount: 0,
    isHidden: false,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await db.collection("posts").add(post);
  return { id: ref.id, ...post };
};

export const getPosts = async ({ mode, institute, lastDoc, limit = 15 }) => {
  const db = getDB();
  let query = db
    .collection("posts")
    .where("isHidden", "==", false)
    .where("mode", "==", mode)
    .orderBy("createdAt", "desc");

  if (mode === "institute" && institute) {
    query = query.where("institute", "==", institute);
  }

  if (lastDoc) {
    const snap = await db.collection("posts").doc(lastDoc).get();
    if (snap.exists) query = query.startAfter(snap);
  }

  const snapshot = await query.limit(limit).get();
  const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  return {
    posts,
    nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
  };
};

export const getPost = async (postId) => {
  const doc = await getDB().collection("posts").doc(postId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const toggleLike = async (postId, userId) => {
  const db = getDB();
  const ref = db.collection("posts").doc(postId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Post not found");

  const likes = doc.data().likes || [];
  const liked = likes.includes(userId);
  const updated = liked
    ? likes.filter((id) => id !== userId)
    : [...likes, userId];

  await ref.update({ likes: updated, updatedAt: new Date().toISOString() });
  return { liked: !liked, likeCount: updated.length };
};

export const hidePost = async (postId) => {
  await getDB().collection("posts").doc(postId).update({
    isHidden: true,
    updatedAt: new Date().toISOString(),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  COMMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const createComment = async ({ postId, userId, content, parentId }) => {
  const db = getDB();
  const now = new Date().toISOString();

  const comment = {
    postId,
    userId,
    anonName: generateAnonName(userId),
    content,
    parentId: parentId || null, // for nested replies
    likes: [],
    isHidden: false,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await db.collection("comments").add(comment);

  // Increment post comment count
  const postRef = db.collection("posts").doc(postId);
  const postDoc = await postRef.get();
  if (postDoc.exists) {
    await postRef.update({
      commentCount: (postDoc.data().commentCount || 0) + 1,
      updatedAt: now,
    });
  }

  return { id: ref.id, ...comment };
};

export const getComments = async (postId) => {
  const snapshot = await getDB()
    .collection("comments")
    .where("postId", "==", postId)
    .where("isHidden", "==", false)
    .orderBy("createdAt", "asc")
    .get();

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const hideComment = async (commentId) => {
  await getDB().collection("comments").doc(commentId).update({
    isHidden: true,
    updatedAt: new Date().toISOString(),
  });
};

export const toggleCommentLike = async (commentId, userId) => {
  const db = getDB();
  const ref = db.collection("comments").doc(commentId);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Comment not found");

  const likes = doc.data().likes || [];
  const liked = likes.includes(userId);
  const updated = liked
    ? likes.filter((id) => id !== userId)
    : [...likes, userId];

  await ref.update({ likes: updated, updatedAt: new Date().toISOString() });
  return { liked: !liked, likeCount: updated.length };
};
