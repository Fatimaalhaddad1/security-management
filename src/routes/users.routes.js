/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (super_admin only)
 */

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/v1/users/assign:
 *   patch:
 *     tags: [Users]
 *     summary: Approve and assign user
 *     description: Super admin only. Approve a pending user and assign role and site.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *               - site_id
 *             properties:
 *               email:
 *                 type: string
 *                 example: ahmed@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, inspector, technician]
 *                 example: technician
 *               site_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: User approved and assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User approved and assigned successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (not super_admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or site not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/assign', authMiddleware, allowRoles(['super_admin']), usersController.assign);

module.exports = router;
