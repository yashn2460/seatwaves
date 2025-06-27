const Joi = require("joi");

const createEvent = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    artist: Joi.string().required(),
    category: Joi.string().required(),
    venue: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    bannerImage: Joi.string().required(),
    price: Joi.object({
      min: Joi.number().required(),
      max: Joi.number().required(),
    }).required(),
    currency: Joi.string().default("USD"),
    totalTickets: Joi.number().required(),
    tags: Joi.array().items(Joi.string()),
    seatingOptions: Joi.array().items(
      Joi.object({
        section: Joi.string().required(),
        price: Joi.number().required(),
        available: Joi.number().required(),
      })
    ),
  }),
};

const updateEvent = {
  body: Joi.object().keys({
    title: Joi.string(),
    artist: Joi.string(),
    category: Joi.string(),
    venue: Joi.string(),
    location: Joi.string(),
    date: Joi.date(),
    endDate: Joi.date(),
    description: Joi.string(),
    image: Joi.string(),
    bannerImage: Joi.string(),
    price: Joi.object({
      min: Joi.number(),
      max: Joi.number(),
    }),
    currency: Joi.string(),
    totalTickets: Joi.number(),
    status: Joi.string().valid("active", "cancelled", "sold-out"),
    featured: Joi.boolean(),
    trending: Joi.boolean(),
    tags: Joi.array().items(Joi.string()),
    seatingOptions: Joi.array().items(
      Joi.object({
        section: Joi.string().required(),
        price: Joi.number().required(),
        available: Joi.number().required(),
      })
    ),
  }),
};

const queryEvents = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    category: Joi.string(),
    venue: Joi.string(),
    date_from: Joi.date(),
    date_to: Joi.date(),
    price_min: Joi.number(),
    price_max: Joi.number(),
    featured: Joi.boolean(),
    trending: Joi.boolean(),
    search: Joi.string(),
  }),
};

const addToFavorites = {
  body: Joi.object().keys({
    eventId: Joi.string().required(),
  }),
};

module.exports = {
  createEvent,
  updateEvent,
  queryEvents,
  addToFavorites,
}; 