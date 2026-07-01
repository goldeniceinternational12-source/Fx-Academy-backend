const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllPayments,
  approvePayment,
  rejectPayment
} = require("../controllers/adminPaymentController");

// GET ALL PAYMENTS
router.get("/", protect, adminOnly, getAllPayments);

// APPROVE
router.put("/approve/:id", protect, adminOnly, approvePayment);

// REJECT
router.put("/reject/:id", protect, adminOnly, rejectPayment);

module.exports = router;