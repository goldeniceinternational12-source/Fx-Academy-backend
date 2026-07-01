const express = require("express");
const router = express.Router();
const MaterialRequest = require("../models/MaterialRequest");
const sendEmail = require("../utils/sendEmail");

router.post("/material-request", async (req, res) => {
  try {
    const { name, email, request } = req.body;

    // Save to database (optional but recommended)
    const newRequest = await MaterialRequest.create({
      name,
      email,
      request
    });

    // SEND EMAIL ALERT 🔥
    await sendEmail(name, email, request);

    res.status(200).json({
      message: "Request submitted successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;