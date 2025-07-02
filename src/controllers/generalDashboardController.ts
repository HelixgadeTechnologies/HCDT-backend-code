import { getGeneralDashboardData } from "../service/generalDashboardService";
import { errorResponse, successResponse } from "../utils/responseHandler";

import { Request, Response } from "express";

export const generalDashboard = async (req: Request, res: Response) => {
    try {
        const {trustId, year, state, settlor } = req.params;
        // console.log(req.params)
        const data = await getGeneralDashboardData(trustId,Number(year), state, settlor);
        res.status(200).json(successResponse("GeneralDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};