const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllMaterialRequests,
  updateMaterialRequestStatus,
  deleteMaterialRequest,
} = require("../controllers/adminController");

/**
 * ===============================
 * ADMIN DASHBOARD
 * ===============================
 */
router.get("/dashboard", getDashboardStats);

/**
 * ===============================
 * MATERIAL REQUESTS MANAGEMENT
 * ===============================
 */
router.get("/material-requests", getAllMaterialRequests);

router.patch("/material-requests/:id", updateMaterialRequestStatus);

router.delete("/material-requests/:id", deleteMaterialRequest);

module.exports = router;