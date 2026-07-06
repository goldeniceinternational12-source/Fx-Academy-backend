const MaterialRequest = require("../models/MaterialRequest");
const sendMail = require("../utils/sendMail");

const ALLOWED_STATUS = [
  "pending",
  "processing",
  "completed",
];

/**
 * ==========================================
 * CREATE MATERIAL REQUEST
 * ==========================================
 */
exports.createRequest = async (req, res) => {
  try {
    const { name, email, material, message } = req.body;

    if (!name || !email || !material) {
      return res.status(400).json({
        success: false,
        message: "Name, email and material are required.",
      });
    }

    const request = await MaterialRequest.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      material: material.trim(),
      message: message ? message.trim() : "",
      user: req.user ? req.user._id : null,
    });

    // Send email without delaying the response
    sendMail({
      to: process.env.EMAIL_USER,
      subject: "New Material Request",
      html: `
        <h2>New Material Request</h2>
        <p><strong>Name:</strong> ${request.name}</p>
        <p><strong>Email:</strong> ${request.email}</p>
        <p><strong>Material:</strong> ${request.material}</p>
        <p><strong>Message:</strong> ${request.message || "N/A"}</p>
      `,
    }).catch((error) => {
      console.error("EMAIL ERROR:", error);
    });

    res.status(201).json({
      success: true,
      message: "Material request submitted successfully.",
      request,
    });

  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit material request.",
    });
  }
};

/**
 * ==========================================
 * GET MY REQUESTS
 * ==========================================
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (error) {
    console.error("GET MY REQUESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your requests.",
    });
  }
};

/**
 * ==========================================
 * GET ALL REQUESTS (ADMIN)
 * ==========================================
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (error) {
    console.error("GET ALL REQUESTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests.",
    });
  }
};

/**
 * ==========================================
 * UPDATE REQUEST STATUS
 * ==========================================
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status.",
      });
    }

    const request = await MaterialRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request status updated successfully.",
      request,
    });

  } catch (error) {
    console.error("UPDATE REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update request.",
    });
  }
};

/**
 * ==========================================
 * DELETE REQUEST
 * ==========================================
 */
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Material request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Material request deleted successfully.",
    });

  } catch (error) {
    console.error("DELETE REQUEST ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete request.",
    });
  }
};