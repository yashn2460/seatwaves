const Venue = require("../models/venue.model");

/**
 * Get all venues with optional filtering
 * @param {Object} filter
 * @returns {Promise<Venue[]>}
 */
const getAllVenues = async (filter = {}) => {
  return Venue.find(filter).sort({ name: 1 });
};

/**
 * Get venue by id
 * @param {string} id
 * @returns {Promise<Venue>}
 */
const getVenueById = async (id) => {
  return Venue.findOne({ id });
};

module.exports = {
  getAllVenues,
  getVenueById,
}; 