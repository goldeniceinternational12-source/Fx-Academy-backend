const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllMaterialRequests,
  updateMaterialRequestStatus,
  deleteMaterialRequest,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

/**
 * =====================================
 * ADMIN DASHBOARD
 * =====================================
 */

// GET Dashboard Statistics
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

/**
 * =====================================
 * MATERIAL REQUEST MANAGEMENT
 * =====================================
 */

// GET All Material Requests
router.get(
  "/material-requests",
  protect,
  adminOnly,
  getAllMaterialRequests
);

// UPDATE Material Request Status
router.patch(
  "/material-requests/:id",
  protect,
  adminOnly,
  updateMaterialRequestStatus
);

// DELETE Material Request
router.delete(
  "/material-requests/:id",
  protect,
  adminOnly,
  deleteMaterialRequest
);

module.exports = router;