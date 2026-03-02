import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILE_COUNT = 4;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  },
});

export const uploadCommunityMedia = upload.array("media", MAX_FILE_COUNT);

export const handleCommunityUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE")
      return res.status(400).json({
        success: false,
        message: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
      });
    if (err.code === "LIMIT_FILE_COUNT")
      return res.status(400).json({
        success: false,
        message: `Too many files. Max ${MAX_FILE_COUNT} files per post.`,
      });
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err)
    return res.status(400).json({ success: false, message: err.message });
  next();
};
