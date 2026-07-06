const User = require("../models/User");
const MaterialRequest = require("../models/MaterialRequest");

const ALLOWED_STATUS = [
  "pending",
  "processing",
  "completed",
];

/**
 * ===============================
 * DASHBOARD STATS
 * ===============================
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalRequests,
      pendingRequests,
      processingRequests,
      completedRequests,
    ] = await Promise.all([
      User.countDocuments(),
      MaterialRequest.countDocuments(),
      MaterialRequest.countDocuments({ status: "pending" }),
      MaterialRequest.countDocuments({ status: "processing" }),
      MaterialRequest.countDocuments({ status: "completed" }),
    ]);

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
    console.error(error);

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
    console.error(error);

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

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const request = await MaterialRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found.",
      });
    }

    res.json({
      success: true,
      message: "Request status updated successfully.",
      request,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update material request.",
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
        message: "Material request not found.",
      });
    }

    await request.deleteOne();

    res.json({
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