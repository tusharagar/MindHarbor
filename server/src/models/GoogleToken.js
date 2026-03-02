import mongoose from "mongoose";

const GoogleTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    scope: { type: String },
    tokenType: { type: String, default: "Bearer" },
    expiryDate: { type: Number }, // Unix ms timestamp
  },
  { timestamps: true },
);

// Check if the stored access token is expired
GoogleTokenSchema.methods.isExpired = function () {
  if (!this.expiryDate) return true;
  // Refresh 5 min before actual expiry
  return Date.now() >= this.expiryDate - 5 * 60 * 1000;
};

export default mongoose.model("GoogleToken", GoogleTokenSchema);
