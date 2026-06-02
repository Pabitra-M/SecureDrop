const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const xeroxCenterSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    dropboxId: { type: String, unique: true, default: () => uuidv4() },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("XeroxCenter", xeroxCenterSchema);
