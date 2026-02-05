import { getGeneralDashboardData } from "../service/generalDashboardService";
import { errorResponse, successResponse } from "../utils/responseHandler";

import { Request, Response } from "express";

export const generalDashboard = async (req: Request, res: Response) => {
    try {
        const { trustId, year, state, settlor } = req.params;
        // console.log(req.params)
        const trustIdStr = Array.isArray(trustId) ? trustId[0] : trustId;
        const yearStr = Array.isArray(year) ? year[0] : year;
        const stateStr = Array.isArray(state) ? state[0] : state;
        const settlorStr = Array.isArray(settlor) ? settlor[0] : settlor;
        const data = await getGeneralDashboardData(trustIdStr, Number(yearStr), stateStr, settlorStr);
        res.status(200).json(successResponse("GeneralDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};