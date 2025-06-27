const Event = require("../models/event.model");

/**
 * Create a new event
 * @param {Object} eventBody
 * @returns {Promise<Event>}
 */
const createEvent = async (eventBody) => {
  return Event.create(eventBody);
};

/**
 * Get event by id
 * @param {ObjectId} id
 * @returns {Promise<Event>}
 */
const getEventById = async (id) => {
  return Event.findById(id).populate("seller", "name email");
};

/**
 * Get all events with filtering and pagination
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const queryEvents = async (filter, options) => {
  const events = await Event.paginate(filter, options);
  return events;
};

/**
 * Get featured events
 * @param {number} limit
 * @returns {Promise<Event[]>}
 */
const getFeaturedEvents = async (limit = 6) => {
  return Event.find({ featured: true, status: "active" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("seller", "name email");
};

/**
 * Get trending events
 * @param {number} limit
 * @returns {Promise<Event[]>}
 */
const getTrendingEvents = async (limit = 8) => {
  return Event.find({ trending: true, status: "active" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("seller", "name email");
};

/**
 * Update event by id
 * @param {ObjectId} eventId
 * @param {Object} updateBody
 * @returns {Promise<Event>}
 */
const updateEventById = async (eventId, updateBody) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  Object.assign(event, updateBody);
  await event.save();
  return event;
};

/**
 * Delete event by id
 * @param {ObjectId} eventId
 * @returns {Promise<Event>}
 */
const deleteEventById = async (eventId) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  await event.remove();
  return event;
};

/**
 * Check if user owns the event
 * @param {ObjectId} eventId
 * @param {ObjectId} userId
 * @returns {Promise<boolean>}
 */
const isEventOwner = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  return event && event.seller.toString() === userId.toString();
};

module.exports = {
  createEvent,
  getEventById,
  queryEvents,
  getFeaturedEvents,
  getTrendingEvents,
  updateEventById,
  deleteEventById,
  isEventOwner,
}; 