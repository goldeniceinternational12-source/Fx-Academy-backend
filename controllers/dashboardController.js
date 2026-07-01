const User = require("../models/User");
const MaterialRequest = require("../models/MaterialRequest");
const Payment = require("../models/Payment");

exports.getDashboardStats = async (req, res) => {
    try {

        // =====================================
        // DASHBOARD COUNTERS
        // =====================================
        const totalUsers = await User.countDocuments();

        const totalRequests = await MaterialRequest.countDocuments();

        const pendingRequests = await MaterialRequest.countDocuments({
            status: "pending",
        });

        const completedRequests = await MaterialRequest.countDocuments({
            status: "completed",
        });

        const totalPayments = await Payment.countDocuments();

        // =====================================
        // PAYMENT STATUS
        // =====================================
        const approvedPayments = await Payment.countDocuments({
            status: "approved",
        });

        const rejectedPayments = await Payment.countDocuments({
            status: "rejected",
        });

        const pendingPayments = await Payment.countDocuments({
            status: "pending",
        });

        // =====================================
        // USERS CREATED PER MONTH
        // =====================================
        const usersByMonth = await User.aggregate([
            {
                $group: {
                    _id: {
                        $month: "$createdAt"
                    },
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        // =====================================
        // REQUESTS CREATED PER MONTH
        // =====================================
        const requestsByMonth = await MaterialRequest.aggregate([
            {
                $group: {
                    _id: {
                        $month: "$createdAt"
                    },
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        // =====================================
        // RECENT MATERIAL REQUESTS
        // =====================================
        const recentRequests = await MaterialRequest.find()
            .sort({ createdAt: -1 })
            .limit(10);

        // =====================================
        // RESPONSE
        // =====================================
        res.status(200).json({

            // Dashboard Cards
            totalUsers,
            totalRequests,
            pendingRequests,
            completedRequests,
            totalPayments,

            // Charts
            paymentStatus: {
                approved: approvedPayments,
                pending: pendingPayments,
                rejected: rejectedPayments,
            },

            usersByMonth,
            requestsByMonth,

            // Recent Table
            recentRequests

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};