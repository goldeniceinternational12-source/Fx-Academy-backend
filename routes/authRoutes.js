const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

/**
 * ==========================
 * PUBLIC ROUTES
 * ==========================
 */

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get new access token
router.post("/refresh-token", refreshToken);

/**
 * ==========================
 * PROTECTED ROUTES
 * ==========================
 */

// Logged-in user's profile
router.get("/profile", protect, getProfile);

// Logout
router.post("/logout", protect, logout);

module.exports = router;