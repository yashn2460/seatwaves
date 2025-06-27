const { venueService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");

const getAllVenues = async (req, res) => {
  try {
    const { city, state, type } = req.query;
    const filter = {};
    
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (type) filter.type = type;
    
    const venues = await venueService.getAllVenues(filter);
    sendResponse(res, 200, "Venues retrieved successfully", { venues });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue = await venueService.getVenueById(req.params.id);
    if (!venue) {
      return sendResponse(res, 404, "Venue not found");
    }
    sendResponse(res, 200, "Venue retrieved successfully", { venue });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  getAllVenues,
  getVenueById,
}; 