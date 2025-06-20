import express from 'express';
import { generalDashboard } from '../controllers/generalDashboardController';

const generalRouter = express.Router();

/**
 * @swagger
 * /api/dashboard/general/{year}/{state}/{settlor}:
 *   get:
 *     summary: Get general dashboard data
 *     tags:
 *       - Dashboard
 *     parameters:
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
generalRouter.get('/general/:year/:state/:settlor', generalDashboard);

export default generalRouter;
