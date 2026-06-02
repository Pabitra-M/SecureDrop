const jwt = require("jsonwebtoken");
const XeroxCenter = require("../models/XeroxCenter");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const center = await XeroxCenter.findById(decoded.id).select("-password");
    if (!center) return res.status(401).json({ message: "Unauthorized: Center not found" });
    req.center = center;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
