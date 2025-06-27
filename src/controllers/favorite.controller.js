const { favoriteService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");

const getUserFavorites = async (req, res) => {
  try {
    const favorites = await favoriteService.getUserFavorites(req.user._id);
    sendResponse(res, 200, "Favorites retrieved successfully", { favorites });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const addToFavorites = async (req, res) => {
  try {
    // Use validated data if available, otherwise use req.body
    const { eventId } = res.locals.validatedData?.body || req.body;
    await favoriteService.addToFavorites(req.user._id, eventId);
    sendResponse(res, 200, "Event added to favorites successfully");
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(res, 400, "Event is already in favorites");
    }
    sendResponse(res, 500, "Internal server error");
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const favorite = await favoriteService.removeFromFavorites(req.user._id, req.params.eventId);
    if (!favorite) {
      return sendResponse(res, 404, "Event not found in favorites");
    }
    sendResponse(res, 200, "Event removed from favorites successfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
}; 