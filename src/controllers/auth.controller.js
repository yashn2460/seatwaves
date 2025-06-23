const { userService, tokenService, emailService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");
const { generateOtp } = require("../utils/otp.util");

const register = async (req, res) => {
  try {
    const { user, isNew } = await userService.createUser(req.body);
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await emailService.sendVerificationEmail(user.email, otp);

    const message = isNew
      ? "User registered successfully. Please check your email for verification code."
      : "Email is already registered but not verified. A new verification code has been sent.";

    sendResponse(res, isNew ? 201 : 200, message);
  } catch (error) {
    sendResponse(res, 400, error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    if (!user.isEmailVerified) {
      return sendResponse(res, 403, "Email not verified. Please verify your email first.");
    }
    const token = tokenService.generateAuthTokens(user._id);
    sendResponse(res, 200, "Login successful", { user, token });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return sendResponse(res, 400, "Invalid or expired OTP");
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = tokenService.generateAuthTokens(user._id);
    sendResponse(res, 200, "Email verified successfully", { user, token });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
}; 