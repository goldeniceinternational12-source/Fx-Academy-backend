const Payment = require("../models/Payment");
const User = require("../models/User");
const MaterialRequest = require("../models/MaterialRequest");
const sendMail = require("../utils/sendMail");

// ======================================
// View All Payments
// ======================================
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ======================================
// Approve Payment
// ======================================
exports.approvePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "approved";
    await payment.save();

    await sendMail({
      to: payment.user.email,
      subject: "Payment Approved",
      html: `
        <h2>Your payment has been approved.</h2>
        <p>Product: ${payment.product}</p>
        <p>Amount: ₦${payment.amount}</p>
      `,
    });

    res.json({
      message: "Payment approved successfully",
      payment,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ======================================
// Reject Payment
// ======================================
exports.rejectPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("user");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    payment.status = "rejected";
    await payment.save();

    await sendMail({
      to: payment.user.email,
      subject: "Payment Rejected",
      html: `
        <h2>Your payment was rejected.</h2>
        <p>Please contact support or upload another receipt.</p>
      `,
    });

    res.json({
      message: "Payment rejected successfully",
      payment,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ======================================
// Dashboard Statistics
// ======================================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalPayments = await Payment.countDocuments();

    const totalMaterialRequests =
      await MaterialRequest.countDocuments();

    const pendingPayments = await Payment.countDocuments({
      status: "pending",
    });

    const approvedPayments = await Payment.countDocuments({
      status: "approved",
    });

    res.json({
      success: true,
      totalUsers,
      totalPayments,
      totalMaterialRequests,
      pendingPayments,
      approvedPayments,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};

// ======================================
// Get All Material Requests
// ======================================
exports.getAllMaterialRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch material requests.",
    });
  }
};

// ======================================
// Update Material Request Status
// ======================================
exports.updateMaterialRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate allowed status values
    if (!["pending", "processing", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found.",
      });
    }

    request.status = status;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      request,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update request status.",
    });
  }
};
// ======================================
// Delete Material Request
// ======================================
exports.deleteMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found.",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Material request deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete material request.",
    });
  }
};