const { userService, tokenService, emailService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");
const { generateOtp } = require("../utils/otp.util");
const { OAuth2Client } = require("google-auth-library");

// TODO: Add GOOGLE_CLIENT_ID to your .env file
const client = new OAuth2Client("441777013950-22hrrplbgu3cpg2ao6aqd7c2i13rn9qj.apps.googleusercontent.com");

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
    console.log(error);
    sendResponse(res, 400, error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if(user.googleId){
      return sendResponse(res, 401, "Please login with Google");
    }
    if (!user || !(await user.comparePassword(password))) {
      return sendResponse(res, 401, "Invalid email or password");
    }
    if (!user.isEmailVerified) {
      return sendResponse(res, 403, "Email not verified. Please verify your email first.");
    }
    const token = tokenService.generateAuthTokens(user._id);
    sendResponse(res, 200, "Login successful", { user, token });
  } catch (error) {
    console.log(error);
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

const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "441777013950-22hrrplbgu3cpg2ao6aqd7c2i13rn9qj.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
    });
    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await userService.getUserByEmail(email);

    if (!user) {
      user = await userService.createUser({
        name,
        email,
        googleId,
        isEmailVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const appToken = tokenService.generateAuthTokens(user._id);
    sendResponse(res, 200, "Google login successful", { user, token: appToken });
  } catch (error) {
    sendResponse(res, 401, "Google authentication failed");
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  googleLogin,
}; 