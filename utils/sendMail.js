const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `MILMICH FX Academy <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.error("EMAIL ERROR:", error.message);
  }
};

module.exports = sendMail;