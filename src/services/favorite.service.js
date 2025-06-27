const Favorite = require("../models/favorite.model");

/**
 * Get user favorites
 * @param {ObjectId} userId
 * @returns {Promise<Favorite[]>}
 */
const getUserFavorites = async (userId) => {
  return Favorite.find({ user: userId })
    .populate({
      path: "event",
      populate: {
        path: "seller",
        select: "name email",
      },
    })
    .sort({ createdAt: -1 });
};

/**
 * Add event to favorites
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<Favorite>}
 */
const addToFavorites = async (userId, eventId) => {
  return Favorite.create({ user: userId, event: eventId });
};

/**
 * Remove event from favorites
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<Favorite>}
 */
const removeFromFavorites = async (userId, eventId) => {
  return Favorite.findOneAndDelete({ user: userId, event: eventId });
};

/**
 * Check if event is in user favorites
 * @param {ObjectId} userId
 * @param {ObjectId} eventId
 * @returns {Promise<boolean>}
 */
const isFavorite = async (userId, eventId) => {
  const favorite = await Favorite.findOne({ user: userId, event: eventId });
  return !!favorite;
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
}; 