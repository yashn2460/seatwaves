const { eventService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");

const getAllEvents = async (req, res) => {
  try {
    // Use validated data if available, otherwise use req.query
    const queryData = res.locals.validatedData?.query || req.query;
    const { page = 1, limit = 10, category, venue, date_from, date_to, price_min, price_max, featured, trending, search } = queryData;

    // Build filter object
    const filter = { status: "active" };
    
    if (category) filter.category = category;
    if (venue) filter.venue = venue;
    if (featured !== undefined) filter.featured = featured === "true";
    if (trending !== undefined) filter.trending = trending === "true";
    
    if (date_from || date_to) {
      filter.date = {};
      if (date_from) filter.date.$gte = new Date(date_from);
      if (date_to) filter.date.$lte = new Date(date_to);
    }
    
    if (price_min || price_max) {
      filter["price.min"] = {};
      if (price_min) filter["price.min"].$gte = Number(price_min);
      if (price_max) filter["price.max"].$lte = Number(price_max);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      populate: {
        path: "seller",
        select: "name email",
      },
      sort: { date: 1 },
    };

    const result = await eventService.queryEvents(filter, options);
    
    sendResponse(res, 200, "Events retrieved successfully", {
      events: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return sendResponse(res, 404, "Event not found");
    }
    sendResponse(res, 200, "Event retrieved successfully", { event });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};

const getFeaturedEvents = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const events = await eventService.getFeaturedEvents(parseInt(limit));
    sendResponse(res, 200, "Featured events retrieved successfully", { events });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const getTrendingEvents = async (req, res) => {
  try {
    console.log("Trending events");
    const { limit = 8 } = req.query;
    const events = await eventService.getTrendingEvents(parseInt(limit));
    sendResponse(res, 200, "Trending events retrieved successfully", { events });
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};

const createEvent = async (req, res) => {
  try {
    // Use validated data if available, otherwise use req.body
    const eventData = {
      ...(res.locals.validatedData?.body || req.body),
      seller: req.user._id,
      availableTickets: (res.locals.validatedData?.body || req.body).totalTickets,
    };
    
    const event = await eventService.createEvent(eventData);
    sendResponse(res, 201, "Event created successfully", { event });
  } catch (error) {
    sendResponse(res, 400, error.message);
  }
};

const updateEvent = async (req, res) => {
  try {
    const isOwner = await eventService.isEventOwner(req.params.id, req.user._id);
    if (!isOwner) {
      return sendResponse(res, 403, "You can only update your own events");
    }
    
    // Use validated data if available, otherwise use req.body
    const updateData = res.locals.validatedData?.body || req.body;
    const event = await eventService.updateEventById(req.params.id, updateData);
    sendResponse(res, 200, "Event updated successfully", { event });
  } catch (error) {
    if (error.message === "Event not found") {
      return sendResponse(res, 404, "Event not found");
    }
    sendResponse(res, 500, "Internal server error");
  }
};

const deleteEvent = async (req, res) => {
  try {
    const isOwner = await eventService.isEventOwner(req.params.id, req.user._id);
    if (!isOwner) {
      return sendResponse(res, 403, "You can only delete your own events");
    }
    
    await eventService.deleteEventById(req.params.id);
    sendResponse(res, 200, "Event deleted successfully");
  } catch (error) {
    if (error.message === "Event not found") {
      return sendResponse(res, 404, "Event not found");
    }
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  getFeaturedEvents,
  getTrendingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
}; 