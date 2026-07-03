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
 * ADMIN USER MANAGEMENT
 * ===============================
 */

// Get all users
router.get("/", protect, adminOnly, getAllUsers);

// Get single user
router.get("/:id", protect, adminOnly, getUser);

// Update user
router.put("/:id", protect, adminOnly, updateUser);

// Activate / Suspend user
router.patch("/:id/status", protect, adminOnly, toggleUserStatus);

// Delete user
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;