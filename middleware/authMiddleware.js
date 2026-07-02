const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * =====================================
 * Protect Route
 * Verify JWT and attach user to request
 * =====================================
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // Block suspended users
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

/**
 * =====================================
 * Role Authorization Middleware
 * Example:
 * authorize("admin")
 * authorize("admin", "mentor")
 * =====================================
 */
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
      }

      next();
    } catch (err) {
      console.error("AUTHORIZE ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
  };
};

/**
 * =====================================
 * Backward Compatibility
 * Existing routes using adminOnly
 * will continue to work.
 * =====================================
 */
exports.adminOnly = exports.authorize("admin");