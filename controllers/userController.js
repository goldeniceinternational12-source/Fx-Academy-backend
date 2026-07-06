const User = require("../models/User");

/**
 * =====================================
 * GET ALL USERS
 * =====================================
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

/**
 * =====================================
 * GET SINGLE USER
 * =====================================
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

/**
 * =====================================
 * UPDATE USER
 * =====================================
 */
exports.updateUser = async (req, res) => {
  try {
    // Prevent updating protected fields
    delete req.body.password;
    delete req.body.refreshToken;
    delete req.body.role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
};

/**
 * =====================================
 * DELETE USER
 * =====================================
 */
exports.deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user && req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};

/**
 * =====================================
 * TOGGLE USER STATUS
 * =====================================
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent admin from suspending themselves
    if (req.user && req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot suspend your own account.",
      });
    }

    user.status = user.status === "active" ? "suspended" : "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      status: user.status,
    });
  } catch (error) {
    console.error("TOGGLE USER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};