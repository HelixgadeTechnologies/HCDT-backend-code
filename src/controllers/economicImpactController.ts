import { Request, Response } from "express";
import { successResponse, errorResponse, notFoundResponse } from "../utils/responseHandler";
import { getAllEconomicImpacts, getEconomicImpactById, getEconomicImpactByTrustId, getEconomicImpactDataByTrust, getImpactOptionOne, getImpactOptionTwo, upsertEconomicImpact } from "../service/economicimpactService";

export const createOrUpdateEconomicImpact = async (req: Request, res: Response) => {
    try {
        const { isCreate, data } = req.body;

        if (typeof isCreate !== "boolean") {
            res.status(400).json(errorResponse("Invalid request: isCreate must be a boolean."));
        }

        if (!isCreate && !data.economicImpactId) {
            res.status(400).json(errorResponse("Economic Impact ID is required for updating."));
        }

        const result = await upsertEconomicImpact(data, isCreate);
        res.status(200).json(successResponse(`Economic Impact ${isCreate ? "created" : "updated"} successfully`, result));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const listEconomicImpacts = async (req: Request, res: Response) => {
    try {
        const economicImpacts = await getAllEconomicImpacts();

        if (economicImpacts.length === 0) {
            res.status(404).json(notFoundResponse("No Economic Impact data found", []));
        }

        res.status(200).json(successResponse("Economic Impacts", economicImpacts));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const getEconomicImpact = async (req: Request, res: Response) => {
    try {
        const { economicImpactId } = req.params;

        if (!economicImpactId) {
            res.status(400).json(notFoundResponse("Economic Impact ID is required", null));
        }

        const economicImpact = await getEconomicImpactById(economicImpactId);

        if (!economicImpact || economicImpact.length === 0) {
            res.status(404).json(notFoundResponse("Economic Impact not found", null));
        }

        res.status(200).json(successResponse("Economic Impact", economicImpact[0]));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};
export const economicImpactByTrustId = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.params;

        if (!trustId) {
            res.status(400).json(notFoundResponse("Trust ID is required", null));
        }

        const economicImpact = await getEconomicImpactByTrustId(trustId);

        if (!economicImpact || economicImpact.length === 0) {
            res.status(404).json(notFoundResponse("Economic Impact not found", null));
        }

        res.status(200).json(successResponse("Economic Impact", economicImpact));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const getAllImpactOptionOne = async (req: Request, res: Response) => {
    try {
        const impactOptionOne = await getImpactOptionOne();
        res.status(200).json(successResponse("ImpactOptionOne", impactOptionOne));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching ImpactOptionOne data", error.message));
    }
};
export const getAllImpactOptionTwo = async (req: Request, res: Response) => {
    try {
        const impactOptionTwo = await getImpactOptionTwo();
        res.status(200).json(successResponse("ImpactOptionTwo", impactOptionTwo));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching ImpactOptionTwo data", error.message));
    }
};

export const getEconomicImpactDashboard = async (req: Request, res: Response) => {
    const { trustId, year, state } = req.params;
    if (!trustId) {
        res.status(404).json(notFoundResponse('trustId is required'));
    }
    try {
        const data = await getEconomicImpactDataByTrust(trustId, Number(year), state);
        res.status(200).json(successResponse("EconomicImpactDataDashboard", data));
    } catch (error: any) {
        // console.log(error)
        res.status(500).json(errorResponse('Internal Server Error', error.message));
    }
};