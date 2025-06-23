const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const authValidation = require("../validations/auth.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 description: Must be at least 6 characters
 *     responses:
 *       "201":
 *         description: User registered successfully. Please check your email for verification code.
 *       "400":
 *         description: Bad request (e.g. email already taken)
 */
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Invalid email or password
 *       "403":
 *         description: Email not verified
 */
router.post("/login", validate(authValidation.login), authController.login);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify user's email with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP sent to email
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Invalid or expired OTP
 */
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyOtp
);

module.exports = router; 