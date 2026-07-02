const MaterialRequest = require("../models/MaterialRequest");
const sendMail = require("../utils/sendMail");

/**
 * =====================================
 * USER: CREATE MATERIAL REQUEST
 * =====================================
 */
exports.createRequest = async (req, res) => {
  try {
    const { name, email, material, message } = req.body;

    // Basic validation
    if (!name || !email || !material) {
      return res.status(400).json({
        success: false,
        message: "Name, email and material are required.",
      });
    }

    // Create request
    const request = await MaterialRequest.create({
      user: req.user._id,
      name,
      email,
      material,
      message,
      status: "pending",
    });

    // Notify owner
    await sendMail({
      to: process.env.OWNER_EMAIL,
      subject: "📚 New Material Request - MILMICH FX Academy",
      html: `
        <h2>New Material Request</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Requested Material:</strong> ${material}</p>

        <p><strong>Message:</strong></p>

        <p>${message || "No message provided."}</p>

        <hr>

        <p>Please contact the student with the price and payment details.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Material request submitted successfully.",
      request,
    });

  } catch (err) {
    console.error("CREATE REQUEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =====================================
 * USER: GET MY REQUESTS
 * =====================================
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (err) {
    console.error("GET MY REQUESTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =====================================
 * ADMIN: GET ALL REQUESTS
 * =====================================
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (err) {
    console.error("GET ALL REQUESTS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE REQUEST STATUS
 * =====================================
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "contacted",
      "delivered",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    request.status = status;

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request status updated successfully.",
      request,
    });

  } catch (err) {
    console.error("UPDATE REQUEST STATUS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * =====================================
 * ADMIN: DELETE REQUEST
 * =====================================
 */
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully.",
    });

  } catch (err) {
    console.error("DELETE REQUEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};