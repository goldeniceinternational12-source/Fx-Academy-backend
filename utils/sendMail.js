const SibApiV3Sdk = require("@getbrevo/brevo");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

/**
 * SEND EMAIL VIA BREVO
 */
const sendMail = async ({ subject, html }) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Sender (must be VERIFIED in Brevo)
    sendSmtpEmail.sender = {
      name: "MILMICH FX Academy",
      email: process.env.EMAIL_USER,
    };

    // Receiver (owner email)
    sendSmtpEmail.to = [
      {
        email: process.env.OWNER_EMAIL,
      },
    ];

    // Content
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("📧 Email sent successfully:", response.messageId);

    return response;
  } catch (error) {
    console.error(
      "❌ BREVO EMAIL ERROR:",
      error.response?.text || error.message || error
    );
  }
};

module.exports = sendMail;