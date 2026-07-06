const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    academyName: {
      type: String,
      default: "MILMICH FX Academy",
    },

    contactEmail: {
      type: String,
      default: "",
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    accountName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);