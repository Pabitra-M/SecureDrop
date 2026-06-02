const express = require("express");
const QRCode = require("qrcode");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/center/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json({ center: req.center });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/center/qr
router.get("/qr", authMiddleware, async (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const uploadUrl = `${clientUrl}/upload/${req.center.dropboxId}`;

    const qrDataUrl = await QRCode.toDataURL(uploadUrl, {
      width: 300,
      margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
    });

    res.json({
      qrCode: qrDataUrl,
      uploadUrl,
      dropboxId: req.center.dropboxId,
      shopName: req.center.shopName,
    });
  } catch (err) {
    console.error("QR error:", err);
    res.status(500).json({ message: "Failed to generate QR code" });
  }
});

module.exports = router;
