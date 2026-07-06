const Payment = require("../models/Payment");
const sendMail = require("../utils/sendMail");

// GET ALL PAYMENTS
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("userId");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE PAYMENT
exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "approved";
    await payment.save();

    await sendMail({
      to: process.env.OWNER_EMAIL,
      subject: "Payment Approved",
      html: `<p>Payment ${payment.transactionReference} has been approved.</p>`
    });

    res.json({ message: "Payment approved", payment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REJECT PAYMENT
exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "rejected";
    await payment.save();

    res.json({ message: "Payment rejected", payment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};