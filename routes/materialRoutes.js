const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/materialController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * ===============================
 * USER ROUTES
 * ===============================
 */

// Create a new material request
router.post("/", protect, createRequest);

// Get logged-in user's requests
router.get("/my-requests", protect, getMyRequests);

/**
 * ===============================
 * ADMIN ROUTES
 * ===============================
 */

// Get all material requests (admin only)
router.get("/", protect, adminOnly, getAllRequests);

// Update request status (admin only)
router.patch("/:id/status", protect, adminOnly, updateRequestStatus);

// Delete request (admin only)
router.delete("/:id", protect, adminOnly, deleteRequest);

module.exports = router;