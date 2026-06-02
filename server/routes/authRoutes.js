const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const XeroxCenter = require("../models/XeroxCenter");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { shopName, ownerName, email, password, phone, address } = req.body;

    if (!shopName || !ownerName || !email || !password) {
      return res.status(400).json({ message: "Shop name, owner name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await XeroxCenter.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const center = await XeroxCenter.create({
      shopName,
      ownerName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = jwt.sign({ id: center._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    res.status(201).json({
      message: "Registration successful",
      token,
      center: {
        id: center._id,
        shopName: center.shopName,
        ownerName: center.ownerName,
        email: center.email,
        dropboxId: center.dropboxId,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const center = await XeroxCenter.findOne({ email });
    if (!center) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, center.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: center._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      center: {
        id: center._id,
        shopName: center.shopName,
        ownerName: center.ownerName,
        email: center.email,
        dropboxId: center.dropboxId,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
