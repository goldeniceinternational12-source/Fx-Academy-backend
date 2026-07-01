const MaterialRequest = require("../models/MaterialRequest");

//
// ===============================
// USER: CREATE REQUEST
// ===============================
exports.createRequest = async (req, res) => {
  try {
    const { title, description } = req.body;

    const request = await MaterialRequest.create({
      user: req.user.id,
      title,
      description,
    });

    res.status(201).json({
      message: "Material request created successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// USER: UPLOAD PAYMENT
// ===============================
exports.uploadPayment = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "priced") {
      return res.status(400).json({
        message: "Wait until admin sets price",
      });
    }

    request.paymentProof = req.file.path;
    request.status = "paid";

    await request.save();

    res.json({
      message: "Payment uploaded successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// ADMIN: SET PRICE
// ===============================
exports.setPrice = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.price = req.body.price;
    request.status = "priced";

    await request.save();

    res.json({
      message: "Price set successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// ADMIN: GET ALL REQUESTS
// ===============================
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// ADMIN: APPROVE PAYMENT
// ===============================
exports.approvePayment = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "paid") {
      return res.status(400).json({
        message: "Payment not completed yet",
      });
    }

    request.status = "delivered";

    await request.save();

    res.json({
      message: "Material delivered successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//
// ===============================
// EXPORTS (IMPORTANT FIX)
// ===============================
module.exports = {
  createRequest,
  uploadPayment,
  setPrice,
  getAllRequests,
  approvePayment,
};