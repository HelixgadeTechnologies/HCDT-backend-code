import { Request, Response } from "express";
import { getDashboardSummaryStats } from "../service/dashboardSummaryService";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const data = await getDashboardSummaryStats();
        res.status(200).json(successResponse("Dashboard Summary Stats", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard summary stats', error));
    }
};
