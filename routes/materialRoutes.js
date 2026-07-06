const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
} = require("../controllers/materialController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

/**
 * =====================================
 * USER MATERIAL REQUEST ROUTES
 * =====================================
 */

// Submit Material Request
router.post(
  "/",
  protect,
  createRequest
);

// Get Logged-in User Requests
router.get(
  "/my-requests",
  protect,
  getMyRequests
);

/**
 * =====================================
 * ADMIN MATERIAL REQUEST ROUTES
 * =====================================
 */

// Get All Requests
router.get(
  "/",
  protect,
  adminOnly,
  getAllRequests
);

// Update Request Status
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateRequestStatus
);

// Delete Request
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteRequest
);

module.exports = router;