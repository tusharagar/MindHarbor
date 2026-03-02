const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE}${endpoint}`, {
    credentials: "include",
    headers: { "Cache-Control": "no-cache", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw { message: data.message, ...data };
  return data;
};

export const communityService = {
  // GET /api/community/posts?mode=global|institute&cursor=xxx
  getPosts: (mode, cursor) => {
    const params = new URLSearchParams({ mode });
    if (cursor) params.set("cursor", cursor);
    return request(`/community/posts?${params}`);
  },

  // GET /api/community/posts/:postId
  getPost: (postId) => request(`/community/posts/${postId}`),

  // POST /api/community/posts  (FormData)
  createPost: (formData) =>
    request("/community/posts", { method: "POST", body: formData }),

  // POST /api/community/posts/:postId/like
  likePost: (postId) =>
    request(`/community/posts/${postId}/like`, { method: "POST" }),

  // GET /api/community/posts/:postId/comments
  getComments: (postId) => request(`/community/posts/${postId}/comments`),

  // POST /api/community/posts/:postId/comments
  createComment: (postId, content, parentId) =>
    request(`/community/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    }),

  // POST /api/community/comments/:commentId/like
  likeComment: (commentId) =>
    request(`/community/comments/${commentId}/like`, { method: "POST" }),

  // GET /api/community/my-moderation
  getModerationStatus: () => request("/community/my-moderation"),
};
