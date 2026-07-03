const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `MILMICH FX Academy <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully");
  } catch (error) {
    // CRITICAL: NEVER crash server if email fails
    console.error("EMAIL ERROR:", error.message);
  }
};

module.exports = sendMail;