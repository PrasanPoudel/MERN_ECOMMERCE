const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized, no token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    if (decoded?.id) {
      user = await User.findById(decoded.id).select("-password");
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      ...(decoded.email ? { email: decoded.email } : {}),
      ...(decoded.name ? { name: decoded.name } : {}),
      ...(user ? { email: user.email, name: user.name, role: user.role } : {}),
    };

    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });
  next();
};

const notForDemoAdmin = (req, res, next) => {
  if (req.user?.email === "demo_admin@zentro.com")
    return res
      .status(403)
      .json({ message: "Demo admin is not allowed to perform this action" });
  next();
};

module.exports = { protect, adminOnly, notForDemoAdmin };
