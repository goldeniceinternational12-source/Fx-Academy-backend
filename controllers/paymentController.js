const Payment = require("../models/Payment");
const MaterialRequest = require("../models/MaterialRequest");

//
// ===============================
// SUBMIT PAYMENT (USER)
// ===============================
const submitPayment = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await MaterialRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const payment = await Payment.create({
      user: req.user.id,
      request: requestId,
      receipt: req.file.path,
      status: "pending"
    });

    request.status = "processing";
    await request.save();

    // ===============================
    // 🔥 REAL-TIME SOCKET EMIT (ADD HERE)
    // ===============================
    const io = req.app.get("io");

    io.emit("dashboard-update", {
      type: "payment",
      message: "New payment submitted"
    });

    res.status(201).json({
      message: "Payment submitted successfully",
      payment
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// GET ALL PAYMENTS (ADMIN)
// ===============================
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("request")
      .sort({ createdAt: -1 });

    res.json(payments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// UPDATE PAYMENT STATUS (ADMIN)
// ===============================
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    await payment.save();

    // ===============================
    // 🔥 REAL-TIME UPDATE (IMPORTANT)
    // ===============================
    const io = req.app.get("io");

    io.emit("dashboard-update", {
      type: "payment",
      message: `Payment ${status}`
    });

    res.json({
      message: "Payment updated",
      payment
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// DELETE PAYMENT
// ===============================
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // ===============================
    // 🔥 REAL-TIME DELETE EVENT
    // ===============================
    const io = req.app.get("io");

    io.emit("dashboard-update", {
      type: "payment",
      message: "Payment deleted"
    });

    res.json({ message: "Payment deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitPayment,
  getAllPayments,
  updatePaymentStatus,
  deletePayment
};