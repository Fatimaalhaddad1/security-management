/**
 * @swagger
 * tags:
 *   name: Daily Checks
 *   description: Daily inspection recording
 */

const express = require('express');
const router = express.Router();
const dailyChecksController = require('../controllers/dailyChecks.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const allRoles = ['admin', 'inspector', 'technician'];
const adminAndInspector = ['admin', 'inspector'];
const adminOnly = ['admin'];

/**
 * @swagger
 * /api/v1/daily-checks:
 *   get:
 *     tags: [Daily Checks]
 *     summary: List daily checks
 *     description: Returns all daily checks for assets in the user's site.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of daily checks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   asset_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *                     enum: [Operating, Not Ready, Decommissioned]
 *                   remarks:
 *                     type: string
 *                   created_by:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
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
router.get('/', authMiddleware, allowRoles(allRoles), dailyChecksController.list);

/**
 * @swagger
 * /api/v1/daily-checks/{id}:
 *   get:
 *     tags: [Daily Checks]
 *     summary: Get daily check by ID
 *     description: Returns a daily check. Must belong to user's site.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daily check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 asset_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date
 *                 status:
 *                   type: string
 *                 remarks:
 *                   type: string
 *       400:
 *         description: Invalid daily check id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Daily check not found
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
router.get('/:id', authMiddleware, allowRoles(allRoles), dailyChecksController.getById);

/**
 * @swagger
 * /api/v1/daily-checks:
 *   post:
 *     tags: [Daily Checks]
 *     summary: Record daily inspection
 *     description: Create a daily check. Date is set to current date. Asset must belong to user's site.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asset_id
 *               - status
 *             properties:
 *               asset_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 enum: [Operating, Not Ready, Decommissioned]
 *                 example: Operating
 *               remarks:
 *                 type: string
 *                 example: All systems nominal
 *     responses:
 *       201:
 *         description: Daily inspection recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Daily inspection recorded successfully
 *                 inspection_id:
 *                   type: integer
 *                   example: 45
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: asset_id is required
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Daily check already exists for this asset on this date
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Daily check already exists for this asset on this date
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, allowRoles(adminAndInspector), dailyChecksController.create);

/**
 * @swagger
 * /api/v1/daily-checks/{id}:
 *   patch:
 *     tags: [Daily Checks]
 *     summary: Update daily check
 *     description: Partially update a daily check. Must belong to user's site.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Operating, Not Ready, Decommissioned]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Daily check updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Daily check not found
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
router.patch('/:id', authMiddleware, allowRoles(adminAndInspector), dailyChecksController.update);

/**
 * @swagger
 * /api/v1/daily-checks/{id}:
 *   delete:
 *     tags: [Daily Checks]
 *     summary: Delete daily check
 *     description: Delete a daily check. Admin only. Must belong to user's site.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Daily check deleted
 *       400:
 *         description: Invalid daily check id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Daily check not found
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
router.delete('/:id', authMiddleware, allowRoles(adminOnly), dailyChecksController.remove);

module.exports = router;
