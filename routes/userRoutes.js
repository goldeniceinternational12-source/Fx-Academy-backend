const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

/**
 * =====================================
 * USER MANAGEMENT ROUTES (ADMIN ONLY)
 * =====================================
 */

// GET All Users
router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

// GET Single User
router.get(
  "/:id",
  protect,
  adminOnly,
  getUser
);

// UPDATE User
router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);

// TOGGLE User Status (Active / Suspended)
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  toggleUserStatus
);

// DELETE User
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;