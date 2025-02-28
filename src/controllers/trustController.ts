import { Request, Response } from "express";
import { errorResponse, successResponse, notFoundResponse } from "../utils/responseHandler";
import { addTrustEstablishmentStatus, createOrUpdateTrust, getAllTrust, getTrustEstablishment, removeTrust } from "../service/trustService";
import { ITrustView } from "../interface/trustInterface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createTrust = async (req: Request, res: Response) => {
    try {
        const user = await createOrUpdateTrust(req.body.data, req.body.isCreate);
        res.status(201).json(successResponse("Trust creation successfully", user));
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

        const trust: ITrustView[] = await prisma.$queryRaw`
          SELECT * FROM trust_view WHERE trustId = ${trustId}
        `;

        if (trust.length == 0) {
            res.status(404).json(notFoundResponse("Trust not found", trust));
        }

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
        const user = await removeTrust(req.body);
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