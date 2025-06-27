const express = require("express");
const eventController = require("../controllers/event.controller");
const validate = require("../middlewares/validate.middleware");
const eventValidation = require("../validations/event.validation");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: venue
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: trending
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */
router.get("/", validate(eventValidation.queryEvents), eventController.getAllEvents);

/**
 * @swagger
 * /api/events/featured:
 *   get:
 *     summary: Get featured events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       "200":
 *         description: OK
 */
router.get("/featured", eventController.getFeaturedEvents);

/**
 * @swagger
 * /api/events/trending:
 *   get:
 *     summary: Get trending events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       "200":
 *         description: OK
 */
router.get("/trending", eventController.getTrendingEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: Event not found
 */
router.get("/:id", eventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *     responses:
 *       "201":
 *         description: Event created successfully
 *       "400":
 *         description: Bad request
 *       "401":
 *         description: Unauthorized
 */
router.post("/", auth, validate(eventValidation.createEvent), eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Event updated successfully
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Event not found
 */
router.put("/:id", auth, validate(eventValidation.updateEvent), eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Event deleted successfully
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Event not found
 */
router.delete("/:id", auth, eventController.deleteEvent);

module.exports = router; 