const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/responseHandler");
const User = require("../models/user.model");

// TODO: Move JWT_SECRET to .env file
const JWT_SECRET = "your_jwt_secret";

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return sendResponse(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return sendResponse(res, 401, "Invalid token.");
    }
    req.user = user;
    next();
  } catch (ex) {
    sendResponse(res, 401, "Invalid token.");
  }
};

module.exports = auth; 