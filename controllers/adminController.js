const User = require("../models/User");
const MaterialRequest = require("../models/MaterialRequest");

/**
 * ===============================
 * DASHBOARD STATS
 * ===============================
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalRequests = await MaterialRequest.countDocuments();
    const pendingRequests = await MaterialRequest.countDocuments({ status: "pending" });
    const processingRequests = await MaterialRequest.countDocuments({ status: "processing" });
    const completedRequests = await MaterialRequest.countDocuments({ status: "completed" });

    res.json({
      success: true,
      dashboard: {
        totalUsers,
        totalRequests,
        pendingRequests,
        processingRequests,
        completedRequests,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });
  }
};

/**
 * ===============================
 * GET ALL MATERIAL REQUESTS
 * ===============================
 */
exports.getAllMaterialRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch material requests.",
    });
  }
};

/**
 * ===============================
 * UPDATE MATERIAL REQUEST STATUS
 * ===============================
 */
exports.updateMaterialRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["pending", "processing", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found",
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update material request",
    });
  }
};

/**
 * ===============================
 * DELETE MATERIAL REQUEST
 * ===============================
 */
exports.deleteMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found",
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: "Material request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete material request",
    });
  }
};