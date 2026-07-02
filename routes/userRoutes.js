const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * ===============================
 * ADMIN ROUTES
 * ===============================
 */

// Get all users
router.get("/", protect, adminOnly, getAllUsers);

// Get one user
router.get("/:id", protect, adminOnly, getUser);

// Update user details
router.put("/:id", protect, adminOnly, updateUser);

// Suspend / Activate user
router.patch("/:id/status", protect, adminOnly, toggleUserStatus);

// Delete user
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;