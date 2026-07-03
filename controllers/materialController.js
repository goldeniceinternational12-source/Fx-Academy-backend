const MaterialRequest = require("../models/MaterialRequest");
const sendMail = require("../utils/sendMail");

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
        message: "Name, email, and material are required.",
      });
    }

    const request = await MaterialRequest.create({
      name,
      email,
      material,
      message,
      user: req.user ? req.user._id : null,
    });

    // Send email in the background
    sendMail({
      to: process.env.EMAIL_USER,
      subject: "New Material Request",
      html: `
        <h2>New Material Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
      `,
    }).catch((err) => {
      console.error("EMAIL FAILED:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Material request submitted successfully.",
      request,
    });

  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
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

    res.json({
      success: true,
      requests,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
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

    res.json({
      success: true,
      requests,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
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
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    request.status = req.body.status;

    await request.save();

    res.json({
      success: true,
      message: "Request updated successfully.",
      request,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
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
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: "Request deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};