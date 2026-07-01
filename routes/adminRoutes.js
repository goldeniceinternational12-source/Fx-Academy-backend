const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllPayments,
  approvePayment,
  rejectPayment,
  getAllMaterialRequests,
  updateMaterialRequestStatus,
  deleteMaterialRequest,
} = require("../controllers/adminController");
// Dashboard
router.get("/dashboard", getDashboardStats);
router.get("/material-requests", getAllMaterialRequests);
router.patch(
  "/material-requests/:id",
  updateMaterialRequestStatus
);
router.delete(
  "/material-requests/:id",
  deleteMaterialRequest
);

// Payments
router.get("/payments", getAllPayments);
router.put("/payments/:id/approve", approvePayment);
router.put("/payments/:id/reject", rejectPayment);

module.exports = router;