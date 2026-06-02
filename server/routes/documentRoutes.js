const express = require("express");
const path = require("path");
const fs = require("fs");
const XeroxCenter = require("../models/XeroxCenter");
const Document = require("../models/Document");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// POST /api/documents/upload/:dropboxId  (public - no auth needed, up to 10 files)
router.post("/upload/:dropboxId", upload.array("files", 10), async (req, res) => {
  try {
    const { dropboxId } = req.params;
    const { customerName, note } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const center = await XeroxCenter.findOne({ dropboxId });
    if (!center) {
      // Delete all uploaded files if center not found
      req.files.forEach((f) => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
      return res.status(404).json({ message: "Drop box not found. Invalid QR code." });
    }

    // Create a Document record for every uploaded file
    const docs = await Promise.all(
      req.files.map((f) =>
        Document.create({
          centerId: center._id,
          dropboxId,
          customerName: customerName?.trim() || "Anonymous",
          originalName: f.originalname,
          fileName: f.filename,
          filePath: f.path,
          fileSize: f.size,
          mimeType: f.mimetype,
          note: note?.trim() || "",
        })
      )
    );

    res.status(201).json({
      message: `${docs.length} document${docs.length > 1 ? "s" : ""} uploaded successfully`,
      count: docs.length,
      documents: docs.map((doc) => ({
        id: doc._id,
        originalName: doc.originalName,
        customerName: doc.customerName,
        note: doc.note,
        uploadedAt: doc.createdAt,
      })),
    });
  } catch (err) {
    console.error("Upload error:", err);
    if (req.files) {
      req.files.forEach((f) => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    }
    if (err.message && (err.message.includes("not allowed") || err.message.includes("Only"))) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Upload failed. Please try again." });
  }
});

// GET /api/documents  (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { centerId: req.center._id };
    if (status) filter.status = status;

    const total = await Document.countDocuments(filter);
    const docs = await Document.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ documents: docs, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

// GET /api/documents/:id/download  (protected)
router.get("/:id/download", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, centerId: req.center._id });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!fs.existsSync(doc.filePath)) {
      return res.status(410).json({ message: "File no longer exists on server" });
    }

    res.download(doc.filePath, doc.originalName);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
});

// PATCH /api/documents/:id/status  (protected)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "printing", "printed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, centerId: req.center._id },
      { status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Status updated", document: doc });
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

// DELETE /api/documents/:id  (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, centerId: req.center._id });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Delete file from disk
    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    await Document.deleteOne({ _id: doc._id });
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// GET /api/documents/center/:dropboxId/info  (public - for upload page)
router.get("/center/:dropboxId/info", async (req, res) => {
  try {
    const center = await XeroxCenter.findOne({ dropboxId: req.params.dropboxId }).select("shopName ownerName address");
    if (!center) return res.status(404).json({ message: "Drop box not found" });
    res.json({ shopName: center.shopName, ownerName: center.ownerName, address: center.address });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
