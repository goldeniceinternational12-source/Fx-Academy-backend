const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
} = require("../controllers/materialController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/**
 * =====================================
 * USER ROUTES
 * =====================================
 */

// Create a material request
router.post("/", protect, createRequest);

// Logged-in user views their requests
router.get("/my-requests", protect, getMyRequests);

/**
 * =====================================
 * ADMIN ROUTES
 * =====================================
 */

// View all requests
router.get("/", protect, adminOnly, getAllRequests);

// Update request status
router.patch("/:id/status", protect, adminOnly, updateRequestStatus);

module.exports = router;