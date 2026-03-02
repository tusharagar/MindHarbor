import { getDB } from "../config/firebase.js";
import { uploadImageBuffer, deleteImage } from "./cloudinaryService.js";

/* ─────────────────────────────────────────────────────────────
   Anonymous Name Generator
───────────────────────────────────────────────────────────── */

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
  const seed = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const adj = ADJECTIVES[seed % ADJECTIVES.length];
  const ani = ANIMALS[(seed >> 2) % ANIMALS.length];
  return `${adj} ${ani}`;
};

/* ─────────────────────────────────────────────────────────────
   MEDIA (Cloudinary)
───────────────────────────────────────────────────────────── */

export const uploadMedia = async (file) => {
  if (!file) return null;

  console.log(
    `[Storage] Uploading ${file.originalname} (${file.buffer?.length} bytes)`,
  );

  const result = await uploadImageBuffer(file.buffer, file.mimetype);

  console.log(`[Storage] ✅ Cloudinary URL: ${result.url}`);

  return {
    url: result.url,
    publicId: result.publicId,
    type: "image",
  };
};

export const deleteMedia = async (publicId) => {
  if (!publicId) return;
  await deleteImage(publicId);
};

/* ─────────────────────────────────────────────────────────────
   POSTS
───────────────────────────────────────────────────────────── */

export const createPost = async ({
  userId,
  content,
  mediaFiles, // array of multer files
  mode,
  institute,
  hasCrisisFlag,
}) => {
  const db = getDB();
  const now = new Date().toISOString();

  let media = [];

  if (mediaFiles && mediaFiles.length > 0) {
    for (const file of mediaFiles) {
      const uploaded = await uploadMedia(file);
      if (uploaded) media.push(uploaded);
    }
  }

  const post = {
    userId,
    anonName: generateAnonName(userId),
    content: content || "",
    media, // [{ url, publicId, type }]
    mode,
    institute: mode === "institute" ? institute || "" : null,
    likes: [],
    commentCount: 0,
    isHidden: false,
    hasCrisisFlag: hasCrisisFlag || false,
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

  const posts = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

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

  await ref.update({
    likes: updated,
    updatedAt: new Date().toISOString(),
  });

  return { liked: !liked, likeCount: updated.length };
};

export const hidePost = async (postId) => {
  await getDB().collection("posts").doc(postId).update({
    isHidden: true,
    updatedAt: new Date().toISOString(),
  });
};

/* ─────────────────────────────────────────────────────────────
   COMMENTS
───────────────────────────────────────────────────────────── */

export const createComment = async ({ postId, userId, content, parentId }) => {
  const db = getDB();
  const now = new Date().toISOString();

  const comment = {
    postId,
    userId,
    anonName: generateAnonName(userId),
    content,
    parentId: parentId || null,
    likes: [],
    isHidden: false,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await db.collection("comments").add(comment);

  // Update comment count
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

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
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

  await ref.update({
    likes: updated,
    updatedAt: new Date().toISOString(),
  });

  return { liked: !liked, likeCount: updated.length };
};
