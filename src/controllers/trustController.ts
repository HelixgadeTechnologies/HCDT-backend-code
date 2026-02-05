import { Request, Response } from "express";
import { errorResponse, successResponse, notFoundResponse } from "../utils/responseHandler";
import { addTrustEstablishmentStatus, bulkSaveTrusts, createOrUpdateTrust, getAllTrust, getEstablishmentDashboardData, getFundsSupplyDashboardData, getFundsSupplyStatusDashboardData, getTrust, getTrustEstablishment, removeCACFile, removeMatrixFile, removeTrust, setSurveyAccess, validateTrustFile } from "../service/trustService";
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
        let errorMessage: string = error.message
        let isTrustExist = errorMessage.includes("Unique constraint failed on the constraint: `trust_trustName_key`")
        res.status(500).json(errorResponse("Internal server error", isTrustExist ? "Trust with this name already exist" : error));
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

        const trust = await getTrust(Array.isArray(trustId) ? trustId[0] : trustId);

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
        await removeTrust(trustId);
        res.status(201).json(successResponse("Trust removed successfully", null));
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
        const tes = await getTrustEstablishment(Array.isArray(trustId) ? trustId[0] : trustId);
        res.status(201).json(successResponse("Trust Establishment Status", tes));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }

};

export const deleteMatrixFile = async (req: Request, res: Response) => {
    const { establishmentId } = req.params;

    try {
        await removeMatrixFile(Array.isArray(establishmentId) ? establishmentId[0] : establishmentId);
        res.status(200).json({ message: 'Matrix file removed successfully.' });
    } catch (error) {
        console.error('Error removing matrix file:', error);
        res.status(500).json({ message: 'Failed to remove matrix file.', error });
    }
};

export const deleteCACFile = async (req: Request, res: Response) => {
    const { establishmentId } = req.params;

    try {
        await removeCACFile(Array.isArray(establishmentId) ? establishmentId[0] : establishmentId);
        res.status(200).json({ message: 'CAC file removed successfully.' });
    } catch (error) {
        console.error('Error removing CAC file:', error);
        res.status(500).json({ message: 'Failed to remove CAC file.', error });
    }
};

export const trustEstablishmentDashboard = async (req: Request, res: Response) => {
    const { trustId } = req.params;

    if (!trustId) {
        res.status(404).json(notFoundResponse('Trust Id is required'));
    }

    try {
        const data = await getEstablishmentDashboardData(Array.isArray(trustId) ? trustId[0] : trustId);
        res.status(200).json(successResponse("TrustEstablishmentDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};
export const fundsDashboard = async (req: Request, res: Response) => {
    const { trustId, year } = req.params;

    if (!trustId) {
        res.status(404).json(notFoundResponse('Trust Id is required'));
    }

    try {
        const trustIdStr = Array.isArray(trustId) ? trustId[0] : trustId;
        const yearStr = Array.isArray(year) ? year[0] : year;
        const data = await getFundsSupplyDashboardData(trustIdStr, Number(yearStr));
        const data2 = await getFundsSupplyStatusDashboardData(trustIdStr);
        // console.log({ data, data2 })
        res.status(200).json(successResponse("TrustEstablishmentDashboard", { data, data2 }));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};

export const toggleSurveyAccess = async (req: Request, res: Response) => {
    try {
        const { trustId, accessName, url } = req.body;

        if (!trustId || !accessName) {
            res.status(400).json({ error: 'trustId and accessName are required' });
        }

        await setSurveyAccess(trustId, accessName, url);
        res.status(200).json({ message: `Successfully toggled ${accessName} access.` });

    } catch (error) {
        console.error('Error toggling survey access:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const validateTrustUpload = async (req: Request, res: Response) => {
    try {
        const { payload } = req.body;

        if (!payload) {
            return res.status(400).json(notFoundResponse("No file uploaded"));
        }

        const result = await validateTrustFile(payload);

        res.status(200).json(successResponse("Trust validation complete", result));
    } catch (error: any) {
        console.error("Error during trust file validation", error);
        res.status(500).json(errorResponse("Internal server error", error));
    }
};


export const bulkUploadTrusts = async (req: Request, res: Response) => {
    try {
        const trusts = req.body.payload;

        if (!Array.isArray(trusts) || trusts.length === 0) {
            return res.status(400).json(notFoundResponse("Request body must include an array of trust objects"));
        }

        const result = await bulkSaveTrusts(trusts, req?.user?.userId);
        res.status(200).json(successResponse("Trust records processed successfully", result));

    } catch (error: any) {
        res.status(500).json(errorResponse('Internal server error', error));
    }
};