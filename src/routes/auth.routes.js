/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     tags: [Auth]
 *     summary: User registration
 *     description: Public endpoint. Register a new user. Account stays pending until super_admin approves.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Ahmed Ali
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Registration submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration submitted successfully. Waiting for super admin approval.
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Email already registered
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     description: Authenticate with email and password. Returns a JWT token and user details.
 *     security: []
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
 *                 example: admin@abha.airport
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: Admin User
 *                     email:
 *                       type: string
 *                       example: admin@abha.airport
 *                     role:
 *                       type: string
 *                       example: admin
 *                     site_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       403:
 *         description: Account pending approval
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Account is pending approval
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Invalid credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Internal server error
 */
router.post('/login', authController.login);

module.exports = router;
