const express = require("express");
const venueController = require("../controllers/venue.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Venues
 *   description: Venue management
 */

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Get all venues
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 */
router.get("/", venueController.getAllVenues);

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
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
 *         description: Venue not found
 */
router.get("/:id", venueController.getVenueById);

module.exports = router; 