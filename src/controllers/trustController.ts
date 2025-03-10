import { Request, Response } from "express";
import { errorResponse, successResponse, notFoundResponse } from "../utils/responseHandler";
import { addTrustEstablishmentStatus, createOrUpdateTrust, getAllTrust, getTrust, getTrustEstablishment, removeTrust } from "../service/trustService";
import { ITrustView } from "../interface/trustInterface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createTrust = async (req: Request, res: Response) => {
    try {
        const { isCreate, data } = req.body;

        if (typeof isCreate !== "boolean") {
            res.status(400).json(errorResponse("Invalid request: isCreate must be a boolean."));
        }

        if (!isCreate && !data.trustId) {
            res.status(400).json(errorResponse("Trust ID is required for updating."));
        }
        const trust = await createOrUpdateTrust(data, isCreate);
        res.status(201).json(successResponse(`Trust ${isCreate ? "created" : "updated"} successfully`, trust));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const getAll = async (req: Request, res: Response) => {
    try {
        const trusts = await getAllTrust();
        res.status(201).json(successResponse("Trusts", trusts));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const getTrustInfo = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.params;

        const trust = await getTrust(trustId);

        res.status(201).json(successResponse("Trust", trust));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};

export const deleteTrust = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.body;
        if (!trustId) {
            res.status(400).json(notFoundResponse("Trust ID is required", trustId));
        }
        const user = await removeTrust(req.body.trustId);
        res.status(201).json(successResponse("Trust removed successfully", user));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const addTrustEstablishmentST = async (req: Request, res: Response) => {
    try {
        const tes = await addTrustEstablishmentStatus(req.body);
        res.status(201).json(successResponse("Trust Establishment Status successfully Saved", tes));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};
export const getSpecificTrustEstablishmentST = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.params;
        const tes = await getTrustEstablishment(trustId);
        res.status(201).json(successResponse("Trust Establishment Status", tes));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};