/**
 * @swagger
 * tags:
 *   name: Assets
 *   description: Security device asset management
 */

const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assets.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const allRoles = ['admin', 'inspector', 'technician'];
const adminOnly = ['admin'];

/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     tags: [Assets]
 *     summary: List assets
 *     description: Returns all assets for the user's site. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       facility_number:
 *                         type: string
 *                         example: ABH-X01
 *                       serial_number:
 *                         type: string
 *                         example: XRAY-ABH-001
 *                       device_type:
 *                         type: string
 *                         example: X-Ray Scanner
 *                       manufacturer:
 *                         type: string
 *                         example: Smiths Detection
 *                       model:
 *                         type: string
 *                         example: HI-SCAN 6040
 *                       production_year:
 *                         type: integer
 *                         example: 2020
 *                       site_id:
 *                         type: integer
 *                         example: 1
 *                       location:
 *                         type: string
 *                         example: Terminal 1 - Gate A
 *                       operational_status:
 *                         type: string
 *                         enum: [Operating, Not Ready, Decommissioned]
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
router.get('/', authMiddleware, allowRoles(allRoles), assetsController.list);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   get:
 *     tags: [Assets]
 *     summary: Get asset by ID
 *     description: Returns asset details with daily checks and maintenance history. Asset must belong to user's site.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Asset with history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asset:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     facility_number:
 *                       type: string
 *                     serial_number:
 *                       type: string
 *                     device_type:
 *                       type: string
 *                     manufacturer:
 *                       type: string
 *                     model:
 *                       type: string
 *                     production_year:
 *                       type: integer
 *                     site_id:
 *                       type: integer
 *                     location:
 *                       type: string
 *                     operational_status:
 *                       type: string
 *                 daily_checks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 maintenance_history:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid asset id
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
 *         description: Asset not found
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
router.get('/:id', authMiddleware, allowRoles(allRoles), assetsController.getById);

/**
 * @swagger
 * /api/v1/assets:
 *   post:
 *     tags: [Assets]
 *     summary: Create asset
 *     description: Create a new asset. Admin only. Asset is created under user's site.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facility_number
 *               - serial_number
 *               - device_type
 *               - manufacturer
 *               - model
 *               - production_year
 *               - location
 *               - operational_status
 *             properties:
 *               facility_number:
 *                 type: string
 *                 example: ABH-X02
 *               serial_number:
 *                 type: string
 *                 example: XRAY-ABH-002
 *               device_type:
 *                 type: string
 *                 example: X-Ray Scanner
 *               manufacturer:
 *                 type: string
 *                 example: Smiths Detection
 *               model:
 *                 type: string
 *                 example: HI-SCAN 6040
 *               production_year:
 *                 type: integer
 *                 example: 2021
 *               location:
 *                 type: string
 *                 example: Terminal 1 - Gate B
 *               operational_status:
 *                 type: string
 *                 enum: [Operating, Not Ready, Decommissioned]
 *     responses:
 *       201:
 *         description: Asset created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Asset created successfully
 *                 asset_id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: facility_number is required
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
 *       409:
 *         description: Serial number already exists for this site
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Serial number already exists for this site
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, allowRoles(adminOnly), assetsController.create);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   patch:
 *     tags: [Assets]
 *     summary: Update asset
 *     description: Partially update an asset. Admin only. Asset must belong to user's site.
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
 *               facility_number:
 *                 type: string
 *               serial_number:
 *                 type: string
 *               device_type:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               production_year:
 *                 type: integer
 *               location:
 *                 type: string
 *               operational_status:
 *                 type: string
 *                 enum: [Operating, Not Ready, Decommissioned]
 *     responses:
 *       200:
 *         description: Asset updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Asset updated successfully
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
 *         description: Asset not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Serial number already exists for this site
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
router.patch('/:id', authMiddleware, allowRoles(adminOnly), assetsController.update);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   delete:
 *     tags: [Assets]
 *     summary: Delete asset
 *     description: Delete an asset. Admin only. Asset must belong to user's site.
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
 *         description: Asset deleted
 *       400:
 *         description: Invalid asset id
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
 *         description: Asset not found
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
router.delete('/:id', authMiddleware, allowRoles(adminOnly), assetsController.remove);

module.exports = router;
