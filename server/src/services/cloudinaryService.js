import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Upload image buffer to Cloudinary ─────────────────────────────────────────
// Returns { url, publicId, format, bytes }
export const uploadImageBuffer = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mindspace/syllabi",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error)
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`),
          );
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );
    uploadStream.end(buffer);
  });
};

// ── Fetch image from Cloudinary URL and return as base64 ──────────────────────
// Needed to send image content to Gemini as an inline part
export const fetchImageAsBase64 = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from Cloudinary: ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = response.headers.get("content-type") || "image/jpeg";
  return { base64, contentType };
};

// ── Delete image from Cloudinary (cleanup on error) ───────────────────────────
export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
