import express from 'express';
import { generalDashboard } from '../controllers/generalDashboardController';
import { getDashboardSummary } from '../controllers/dashboardSummaryController';

const generalRouter = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get general dashboard summary statistics
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully retrieved summary statistics
 *       500:
 *         description: Server error while retrieving summary statistics
 */
generalRouter.get('/summary', getDashboardSummary);

/**
 * @swagger
 * /api/dashboard/general/{trustId}/{year}/{state}/{settlor}:
 *   get:
 *     summary: Get general dashboard data
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: trustId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trust ID for the general dashboard
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: number
 *         description: General dashboard selected year
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *         description: General dashboard selected state
 *       - in: path
 *         name: settlor
 *         required: true
 *         schema:
 *           type: string
 *         description: General dashboard selected settlor
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *       500:
 *         description: Server error while retrieving dashboard data
 */
generalRouter.get('/general/:trustId/:year/:state/:settlor', generalDashboard);

export default generalRouter;
