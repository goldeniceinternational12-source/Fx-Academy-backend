const express = require("express");
const router = express.Router();

const {
  submitPayment,
  getAllPayments,
  updatePaymentStatus,
  deletePayment
} = require("../controllers/paymentController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ===============================
// USER: SUBMIT PAYMENT
// ===============================
router.post("/", protect, upload.single("receipt"), submitPayment);

// ===============================
// ADMIN: GET ALL PAYMENTS
// ===============================
router.get("/", protect, adminOnly, getAllPayments);

// ===============================
// ADMIN: UPDATE PAYMENT
// ===============================
router.put("/:id", protect, adminOnly, updatePaymentStatus);

// ===============================
// ADMIN: DELETE PAYMENT
// ===============================
router.delete("/:id", protect, adminOnly, deletePayment);

module.exports = router;