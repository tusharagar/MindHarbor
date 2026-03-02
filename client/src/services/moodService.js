const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Internal request helper
 * Handles both JSON and FormData automatically
 */
const request = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE}${endpoint}`, {
    method: options.method || "GET",
    credentials: "include", // 🔥 IMPORTANT: send auth cookies
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        },
    body: options.body,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const moodService = {
  /**
   * POST /api/mood
   * Save manual mood entry
   */
  saveMood: (payload) =>
    request("/mood", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * GET /api/mood
   * Get mood history
   */
  getMoods: () => request("/mood"),

  /**
   * POST /api/mood/analyze
   * Send image for emotion detection
   */
  analyzeMood: (formData) =>
    request("/mood/analyze", {
      method: "POST",
      body: formData, // ⚠️ do NOT stringify
    }),
};
