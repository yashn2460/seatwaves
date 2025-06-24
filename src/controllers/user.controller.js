const { userService, emailService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");
const { generateOtp } = require("../utils/otp.util");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    sendResponse(res, 200, "Profile retrieved successfully", { user });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (req.file) {
      // Save the file path to the database
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await userService.updateUserById(req.user._id, updateData);
    sendResponse(res, 200, "Profile updated successfully", { user });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, otp);
    
    sendResponse(res, 200, "Password reset email sent successfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userService.getUserById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return sendResponse(res, 401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    sendResponse(res, 200, "Password changed successfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userService.getUserByEmail(email);
    
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return sendResponse(res, 400, "Invalid or expired OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendResponse(res, 200, "Password reset successfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  getProfile,
  updateProfile,
  forgotPassword,
  changePassword,
  resetPassword,
}; 