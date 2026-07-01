const express = require("express");
const router = express.Router();

const MaterialRequest = require("../models/MaterialRequest");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

//
// CREATE REQUEST (USER)
//
router.post("/", protect, async (req, res) => {
  try {
    const request = await MaterialRequest.create({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// GET ALL REQUESTS (ADMIN)
//
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const requests = await MaterialRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// SET PRICE (ADMIN)
//
router.put("/:id/price", protect, adminOnly, async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    request.price = req.body.price;
    request.status = "priced";

    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//
// UPLOAD PAYMENT (USER)
//
router.post(
  "/:id/pay",
  protect,
  upload.single("payment"),
  async (req, res) => {
    try {
      const request = await MaterialRequest.findById(req.params.id);

      request.paymentProof = req.file.path;
      request.status = "paid";

      await request.save();

      res.json(request);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//
// APPROVE (ADMIN)
//
router.put("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);

    request.status = "delivered";

    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;