const jwt = require("jsonwebtoken");

// TODO: Move JWT_SECRET to .env file
const JWT_SECRET = "your_jwt_secret";

/**
 * Generate token
 * @param {ObjectId} userId
 * @returns {string}
 */
const generateAuthTokens = (userId) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = {
  generateAuthTokens,
}; 