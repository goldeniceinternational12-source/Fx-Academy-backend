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

    if (!name || !email || !material) {
      return res.status(400).json({
        success: false,
        message: "Name, email and material are required.",
      });
    }

    const request = await MaterialRequest.create({
      user: req.user._id,
      name,
      email,
      material,
      message,
      status: "pending",
    });

    // Email (non-blocking safety)
    try {
      await sendMail({
        to: process.env.OWNER_EMAIL,
        subject: "📚 New Material Request - MILMICH FX Academy",
        html: `
          <h2>New Material Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Material:</strong> ${material}</p>
          <p><strong>Message:</strong> ${message || "No message"}</p>
        `,
      });
    } catch (mailErr) {
      console.error("EMAIL ERROR:", mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Material request submitted successfully.",
      request,
    });

  } catch (err) {
    console.error("CREATE REQUEST ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while creating request",
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
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user requests",
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
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: requests.length,
      requests,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
    });
  }
};

/**
 * =====================================
 * ADMIN: UPDATE STATUS
 * =====================================
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // UNIFIED STATUS SYSTEM (FIXED)
    const allowedStatus = ["pending", "processing", "completed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await MaterialRequest.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      request,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to update request",
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
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      message: "Request deleted successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to delete request",
    });
  }
};