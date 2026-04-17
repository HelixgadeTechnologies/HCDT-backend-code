import { Request, Response } from "express";
import { successResponse, errorResponse, notFoundResponse } from "../utils/responseHandler"; // Custom response handler
import { getAcsOptionOne, getAcsOptionTwo, getAllAverageCommunitySatisfaction, getAllAverageCommunitySatisfactionByTrust, getAverageCommunitySatisfaction, getCommunitySatisfactionDashboard, upsertAverageCommunitySatisfaction, validateSatisfactionFile, bulkSaveSatisfaction } from "../service/averageCommunitySatisfactionService";

export const createOrUpdateAverageCommunitySatisfaction = async (req: Request, res: Response) => {
    try {
        const { isCreate, data } = req.body;

        if (typeof isCreate !== "boolean") {
            return res.status(400).json(errorResponse("Invalid request: isCreate must be a boolean."));
        }

        if (!isCreate && !data.averageCommunitySatisfactionId) {
            return res.status(400).json(errorResponse("Average Community Satisfaction ID is required for updating."));
        }

        const result = await upsertAverageCommunitySatisfaction(data, isCreate);
        res.status(200).json(successResponse(`Average Community Satisfaction ${isCreate ? "created" : "updated"} successfully`, result));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const listAverageCommunitySatisfaction = async (req: Request, res: Response) => {
    try {
        const conflicts = await getAllAverageCommunitySatisfaction();
        if (conflicts.length == 0) {
            return res.status(400).json(notFoundResponse("Average Community Satisfaction Data not found", []));
        }
        res.status(200).json(successResponse("AverageCommunitySatisfactions", conflicts));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const getAverageCommunitySatisfactionById = async (req: Request, res: Response) => {
    try {
        const { averageCommunitySatisfactionId } = req.params;

        if (!averageCommunitySatisfactionId) {
            return res.status(400).json(notFoundResponse("Average Community Satisfaction ID is required", averageCommunitySatisfactionId));
        }

        const averageCommunitySatisfaction = await getAverageCommunitySatisfaction(Array.isArray(averageCommunitySatisfactionId) ? averageCommunitySatisfactionId[0] : averageCommunitySatisfactionId);

        if (!averageCommunitySatisfaction) {
            return res.status(404).json(notFoundResponse("Average Community Satisfaction not found", null));
        }

        res.status(200).json(successResponse("AverageCommunitySatisfaction", averageCommunitySatisfaction));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};
export const getAverageCommunitySatisfactionByTrustId = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.params;

        if (!trustId) {
            return res.status(400).json(notFoundResponse("Trust ID is required", trustId));
        }

        const averageCommunitySatisfaction = await getAllAverageCommunitySatisfactionByTrust(Array.isArray(trustId) ? trustId[0] : trustId);

        if (averageCommunitySatisfaction.length == 0) {
            return res.status(404).json(notFoundResponse("Average Community Satisfaction not found", []));
        }

        res.status(200).json(successResponse("AverageCommunitySatisfaction", averageCommunitySatisfaction));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const getAllAcsOptionOne = async (req: Request, res: Response) => {
    try {
        const conflictData = await getAcsOptionOne();
        res.status(200).json(successResponse("AcsOptionOne", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching AcsOptionOne data", error.message));
    }
};
export const getAllAcsOptionTwo = async (req: Request, res: Response) => {
    try {
        const conflictData = await getAcsOptionTwo();
        res.status(200).json(successResponse("AcsOptionTwo", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching AcsOptionTwo data", error.message));
    }
};

export const getDashboardData = async (req: Request, res: Response) => {
    const { trustId, year, state, settlor } = req.params;

    if (!trustId) {
        return res.status(404).json(notFoundResponse('trustId is required'));
    }

    try {
        const trustIdStr = Array.isArray(trustId) ? trustId[0] : trustId;
        const yearStr = Array.isArray(year) ? year[0] : year;
        const stateStr = Array.isArray(state) ? state[0] : state;
        const settlorStr = Array.isArray(settlor) ? settlor[0] : settlor;
        const data = await getCommunitySatisfactionDashboard(trustIdStr, Number(yearStr), stateStr, settlorStr);
        res.status(200).json(successResponse("CommunitySatisfactionDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};

export const validateSatisfactionUpload = async (req: Request, res: Response) => {
    try {
        const { payload } = req.body;
        if (!payload) {
            return res.status(400).json(notFoundResponse("No file uploaded"));
        }
        const result = await validateSatisfactionFile(payload);
        res.status(200).json(successResponse("Satisfaction validation complete", result));
    } catch (error: any) {
        console.error("Error during satisfaction file validation", error);
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const bulkUploadSatisfaction = async (req: Request, res: Response) => {
    try {
        const records = req.body.payload;
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json(notFoundResponse("Request body must include an array of satisfaction records"));
        }
        const result = await bulkSaveSatisfaction(records);
        res.status(200).json(successResponse("Satisfaction records processed successfully", result));
    } catch (error: any) {
        res.status(500).json(errorResponse('Internal server error', error));
    }
};