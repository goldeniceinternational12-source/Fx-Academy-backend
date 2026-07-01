const express = require("express");
const router = express.Router();

const MaterialRequest = require("../models/MaterialRequest");
const sendEmail = require("../utils/sendEmail");

// POST /api/material-request
router.post("/material-request", async (req, res) => {
  try {
    const { name, email, request } = req.body;

    if (!name || !email || !request) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Save request
    const newRequest = await MaterialRequest.create({
      name,
      email,
      request,
    });

    // Send email to owner
    await sendEmail(name, email, request);

    res.status(201).json({
      success: true,
      message: "Your request has been sent successfully.",
      data: newRequest,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;