const sgMail = require("@sendgrid/mail");

// TODO: Add SENDGRID_API_KEY to your .env file
const SENDGRID_API_KEY = process.env.SENDGRID_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;
const LOGO_URL = "https://seatwaves.netlify.app/Logo-1.png";
const THEME_COLOR = "#d32f2f";

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

function buildEmailTemplate({ title, message, otp, footer }) {
  return `
    <div style="font-family: Arial, sans-serif; background: #fff; max-width: 600px; margin: 0 auto; border-radius: 10px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: ${THEME_COLOR}; padding: 24px 0; text-align: center;">
        <img src="${LOGO_URL}" alt="SeatWaves Logo" style="height: 48px; margin-bottom: 8px;" />
      </div>
      <div style="padding: 32px 24px 24px 24px;">
        <h2 style="color: ${THEME_COLOR}; margin-bottom: 8px;">${title}</h2>
        <p style="font-size: 16px; color: #222; margin-bottom: 24px;">${message}</p>
        ${otp ? `<div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; color: ${THEME_COLOR}; letter-spacing: 4px; border-radius: 8px; margin-bottom: 24px;">${otp}</div>` : ""}
        <p style="font-size: 14px; color: #888; margin-bottom: 0;">${footer || "If you didn't request this, please ignore this email."}</p>
      </div>
      <div style="background: #222; color: #fff; text-align: center; padding: 16px 0; font-size: 13px;">
        &copy; ${new Date().getFullYear()} SeatWaves. All rights reserved.
      </div>
    </div>
  `;
}

const sendEmail = async (to, subject, text, html = null) => {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    text,
    ...(html && { html }),
  };
  
  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendVerificationEmail = async (to, otp) => {
  const subject = "Email Verification";
  const text = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
  const html = buildEmailTemplate({
    title: "Email Verification",
    message: "Your verification code is below. This code will expire in 10 minutes.",
    otp,
  });
  
  await sendEmail(to, subject, text, html);
};

const sendPasswordResetEmail = async (to, otp) => {
  const subject = "Password Reset";
  const text = `Your password reset code is: ${otp}\n\nThis code will expire in 10 minutes.`;
  const html = buildEmailTemplate({
    title: "Password Reset",
    message: "Your password reset code is below. This code will expire in 10 minutes.",
    otp,
  });
  
  await sendEmail(to, subject, text, html);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
}; 