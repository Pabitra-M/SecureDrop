const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: "XeroxCenter", required: true },
    dropboxId: { type: String, required: true },
    customerName: { type: String, trim: true, default: "Anonymous" },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number },
    mimeType: { type: String },
    note: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "printing", "printed", "deleted"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  { timestamps: true }
);

// Auto-delete index
documentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Document", documentSchema);
