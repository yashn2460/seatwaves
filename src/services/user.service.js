const User = require("../models/user.model");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<{user: User, isNew: boolean}>}
 */
const createUser = async (userBody) => {
  // If the user is being created via Google, they are already verified
  if (userBody.googleId) {
    return { user: await User.create(userBody), isNew: true };
  }

  const existingUser = await User.findOne({ email: userBody.email });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new Error("Email already taken");
    }
    // If user exists but is not verified, update their info and return
    existingUser.name = userBody.name;
    existingUser.password = userBody.password;
    return { user: existingUser, isNew: false };
  }

  const user = await User.create(userBody);
  return { user, isNew: true };
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
}; 