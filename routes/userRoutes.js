const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

//
// GET ALL USERS (ADMIN ONLY)
//
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//
// GET SINGLE USER (ADMIN ONLY)
//
router.get("/:id", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//
// UPDATE USER (ADMIN ONLY)
//
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { status },   // ONLY allow status update
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//
// DELETE USER (ADMIN ONLY)
//
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;