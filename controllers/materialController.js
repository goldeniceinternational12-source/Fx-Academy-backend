const MaterialRequest = require("../models/MaterialRequest");
const sendMail = require("../utils/sendMail");

/**
 * ==========================================
 * CREATE MATERIAL REQUEST
 * ==========================================
 */
exports.createMaterialRequest = async (req, res) => {
  try {
    const { name, email, material, message } = req.body;

    // Validate input
    if (!name || !email || !material) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and material are required.",
      });
    }

    // Save request to database
    const request = await MaterialRequest.create({
      name,
      email,
      material,
      message,
    });

    // Send email WITHOUT blocking the API response
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

    // Respond immediately
    return res.status(201).json({
      success: true,
      message: "Material request received successfully.",
      data: request,
    });

  } catch (error) {
    console.error("MATERIAL REQUEST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};