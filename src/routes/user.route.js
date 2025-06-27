const express = require("express");
const userController = require("../controllers/user.controller");
const favoriteController = require("../controllers/favorite.controller");
const validate = require("../middlewares/validate.middleware");
const userValidation = require("../validations/user.validation");
const eventValidation = require("../validations/event.validation");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */
router.get("/profile", auth, userController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */
router.put(
  "/profile",
  auth,
  upload.single("profileImage"),
  userController.updateProfile
);

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Send forgot password email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       "200":
 *         description: OK
 *       "404":
 *         description: User not found
 */
router.post(
  "/forgot-password",
  validate(userValidation.forgotPassword),
  userController.forgotPassword
);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */
router.post(
  "/change-password",
  auth,
  validate(userValidation.changePassword),
  userController.changePassword
);

/**
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP sent to email
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Invalid or expired OTP
 */
router.post(
  "/reset-password",
  validate(userValidation.resetPassword),
  userController.resetPassword
);

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */
router.get("/favorites", auth, favoriteController.getUserFavorites);

/**
 * @swagger
 * /api/user/favorites:
 *   post:
 *     summary: Add event to favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Event already in favorites
 *       "401":
 *         description: Unauthorized
 */
router.post("/favorites", auth, validate(eventValidation.addToFavorites), favoriteController.addToFavorites);

/**
 * @swagger
 * /api/user/favorites/{eventId}:
 *   delete:
 *     summary: Remove event from favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Event not found in favorites
 */
router.delete("/favorites/:eventId", auth, favoriteController.removeFromFavorites);

module.exports = router; 