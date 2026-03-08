/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: Site (airport) management
 */

const express = require('express');
const router = express.Router();
const sitesController = require('../controllers/sites.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const allRoles = ['admin', 'inspector', 'technician', 'super_admin'];

/**
 * @swagger
 * /api/v1/sites:
 *   get:
 *     tags: [Sites]
 *     summary: List all sites
 *     description: Returns all sites. Used by super_admin to select site when creating assets.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, allowRoles(allRoles), sitesController.list);

module.exports = router;
