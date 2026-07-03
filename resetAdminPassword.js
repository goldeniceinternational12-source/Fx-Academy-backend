require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email: "prince2@example.com" }).select("+password");

    if (!user) {
      console.log("User not found");
      process.exit();
    }

    user.password = "Admin123!";
    await user.save();

    console.log("Password reset successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetPassword();