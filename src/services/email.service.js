const nodemailer = require("nodemailer");

// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "294b6d40e7440d",
    pass: "07eb78e1c6bdb6"
  }
});
// TODO: Add these to your .env file
const EMAIL_HOST = "sandbox.smtp.mailtrap.io";
const EMAIL_PORT = 2525;
const EMAIL_USER = "294b6d40e7440d";
const EMAIL_PASS = "07eb78e1c6bdb6";
const EMAIL_FROM = "294b6d40e7440d";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const msg = { from: EMAIL_FROM, to, subject, text };
  await transporter.sendMail(msg);
};

const sendVerificationEmail = async (to, otp) => {
  const subject = "Email Verification";
  const text = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendVerificationEmail,
}; 