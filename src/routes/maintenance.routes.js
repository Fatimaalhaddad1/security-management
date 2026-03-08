/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Maintenance record management
 */

const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const allRoles = ['admin', 'inspector', 'technician', 'super_admin'];
const adminAndTechnician = ['admin', 'technician', 'super_admin'];
const adminOnly = ['admin', 'super_admin'];

/**
 * @swagger
 * /api/v1/maintenance:
 *   get:
 *     tags: [Maintenance]
 *     summary: List maintenance records
 *     description: Returns all maintenance records for assets in the user's site.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of maintenance records
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
 *                   maintenance_type:
 *                     type: string
 *                     enum: [Preventive, Corrective]
 *                   date:
 *                     type: string
 *                     format: date
 *                   description:
 *                     type: string
 *                   technician_id:
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
router.get('/', authMiddleware, allowRoles(allRoles), maintenanceController.list);

/**
 * @swagger
 * /api/v1/maintenance/{id}:
 *   get:
 *     tags: [Maintenance]
 *     summary: Get maintenance record by ID
 *     description: Returns a maintenance record. Must belong to user's site.
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
 *         description: Maintenance record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 asset_id:
 *                   type: integer
 *                 maintenance_type:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string
 *                 technician_id:
 *                   type: integer
 *       400:
 *         description: Invalid maintenance record id
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
 *         description: Maintenance record not found
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
router.get('/:id', authMiddleware, allowRoles(allRoles), maintenanceController.getById);

/**
 * @swagger
 * /api/v1/maintenance:
 *   post:
 *     tags: [Maintenance]
 *     summary: Add maintenance record
 *     description: Create a maintenance record. Date is set to current date. Asset must belong to user's site.
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
 *               - maintenance_type
 *               - description
 *             properties:
 *               asset_id:
 *                 type: integer
 *                 example: 1
 *               maintenance_type:
 *                 type: string
 *                 enum: [Preventive, Corrective]
 *                 example: Preventive
 *               description:
 *                 type: string
 *                 example: Routine belt inspection and cleaning
 *     responses:
 *       201:
 *         description: Maintenance record added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Maintenance record added
 *                 maintenance_id:
 *                   type: integer
 *                   example: 22
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, allowRoles(adminAndTechnician), maintenanceController.create);

/**
 * @swagger
 * /api/v1/maintenance/{id}:
 *   patch:
 *     tags: [Maintenance]
 *     summary: Update maintenance record
 *     description: Partially update a maintenance record. Must belong to user's site.
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
 *               maintenance_type:
 *                 type: string
 *                 enum: [Preventive, Corrective]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance record updated
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
 *         description: Maintenance record not found
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
router.patch('/:id', authMiddleware, allowRoles(adminAndTechnician), maintenanceController.update);

/**
 * @swagger
 * /api/v1/maintenance/{id}:
 *   delete:
 *     tags: [Maintenance]
 *     summary: Delete maintenance record
 *     description: Delete a maintenance record. Admin only. Must belong to user's site.
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
 *         description: Maintenance record deleted
 *       400:
 *         description: Invalid maintenance record id
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
 *         description: Maintenance record not found
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
router.delete('/:id', authMiddleware, allowRoles(adminOnly), maintenanceController.remove);

module.exports = router;
