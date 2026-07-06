const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (name, email, request) => {
  try {
    const mailOptions = {
      from: `"MILMICH FX Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "📚 New Material Request",

      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
          
          <div style="background:#0d6efd; color:white; padding:20px; text-align:center;">
            <h2>📚 New Material Request</h2>
          </div>

          <div style="padding:20px;">
            <p>Hello Admin,</p>

            <p>A new material request has been submitted through your website.</p>

            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Name</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${name}</td>
              </tr>

              <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Email</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${email}</td>
              </tr>

              <tr>
                <td style="padding:10px; border:1px solid #ddd;"><strong>Requested Material</strong></td>
                <td style="padding:10px; border:1px solid #ddd;">${request}</td>
              </tr>
            </table>

            <br>

            <p>Please contact the user with the price and payment details.</p>

            <p>Thank you.</p>
          </div>

          <div style="background:#f5f5f5; padding:15px; text-align:center; font-size:13px; color:#777;">
            This email was generated automatically from the MILMICH FX Academy website.
          </div>

        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;