import express from 'express';
import { generalDashboard } from '../controllers/generalDashboardController';

const generalRouter = express.Router();

/**
 * @swagger
 * /api/dashboard/general:
 *   get:
 *     summary: Get general dashboard data
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *       500:
 *         description: Server error while retrieving dashboard data
 */
generalRouter.get('/general', generalDashboard);

export default generalRouter;
