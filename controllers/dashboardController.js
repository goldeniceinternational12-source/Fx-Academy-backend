const User = require("../models/User");
const MaterialRequest = require("../models/MaterialRequest");
const Payment = require("../models/Payment");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,

      totalRequests,
      pendingRequests,
      completedRequests,

      totalPayments,
      approvedPayments,
      pendingPayments,
      rejectedPayments,

      usersByMonth,
      requestsByMonth,

      recentRequests,
      recentPayments,
    ] = await Promise.all([

      // USERS
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "suspended" }),

      // REQUESTS
      MaterialRequest.countDocuments(),
      MaterialRequest.countDocuments({ status: "pending" }),
      MaterialRequest.countDocuments({ status: "delivered" }),

      // PAYMENTS
      Payment.countDocuments(),
      Payment.countDocuments({ status: "approved" }),
      Payment.countDocuments({ status: "pending" }),
      Payment.countDocuments({ status: "rejected" }),

      // USERS BY MONTH
      User.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      // REQUESTS BY MONTH
      MaterialRequest.aggregate([
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      // RECENT REQUESTS
      MaterialRequest.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10),

      // RECENT PAYMENTS
      Payment.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        activeUsers,
        suspendedUsers,

        totalRequests,
        pendingRequests,
        completedRequests,

        totalPayments,
      },

      paymentStatus: {
        approved: approvedPayments,
        pending: pendingPayments,
        rejected: rejectedPayments,
      },

      analytics: {
        usersByMonth,
        requestsByMonth,
      },

      recentRequests,
      recentPayments,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};