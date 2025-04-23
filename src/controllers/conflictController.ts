import { Request, Response } from "express";
import { successResponse, errorResponse, notFoundResponse } from "../utils/responseHandler";
import { createOrUpdateConflict, getAllConflicts, getCauseOfConflict, getConflictById, getConflictDashboardData, getConflictStatuses, getCourtLitigationStatuses, getIssuesAddressedBy, getPartiesInvolve } from "../service/conflictService";

export const handleConflict = async (req: Request, res: Response) => {
    try {
        const { isCreate, data } = req.body;

        if (!isCreate && !data.projectId) {
            res.status(400).json(errorResponse("Conflict ID is required for updating."));
        }

        if (typeof isCreate !== "boolean") {
            res.status(400).json(errorResponse("isCreate must be a boolean value"));
        }

        const result = await createOrUpdateConflict(data, isCreate);
        const message = isCreate ? "Conflict created successfully" : "Conflict updated successfully";

        res.status(200).json(successResponse(message, result));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const listConflicts = async (req: Request, res: Response) => {
    try {
        const conflicts = await getAllConflicts();
        if (conflicts.length == 0) {
            res.status(400).json(notFoundResponse("conflicts not found", []));
        }
        res.status(200).json(successResponse("Conflicts retrieved successfully", conflicts));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const getConflict = async (req: Request, res: Response) => {
    try {
        const { conflictId } = req.params;

        if (!conflictId) {
            res.status(400).json(notFoundResponse("Conflict ID is required", conflictId));
        }

        const conflict = await getConflictById(conflictId);

        if (!conflict) {
            res.status(404).json(notFoundResponse("Conflict not found", null));
        }

        res.status(200).json(successResponse("Conflict retrieved successfully", conflict));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const getAllCauseOfConflict = async (req: Request, res: Response) => {
    try {
        const conflictData = await getCauseOfConflict();
        res.status(200).json(successResponse("Conflict data retrieved successfully", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching conflict data", error.message));
    }
};
export const getAllPartiesInvolve = async (req: Request, res: Response) => {
    try {
        const conflictData = await getPartiesInvolve();
        res.status(200).json(successResponse("Conflict data retrieved successfully", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching conflict data", error.message));
    }
};
export const getAllConflictStatuses = async (req: Request, res: Response) => {
    try {
        const conflictData = await getConflictStatuses();
        res.status(200).json(successResponse("Conflict data retrieved successfully", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching conflict data", error.message));
    }
};
export const getAllIssuesAddressedBy = async (req: Request, res: Response) => {
    try {
        const conflictData = await getIssuesAddressedBy();
        res.status(200).json(successResponse("Conflict data retrieved successfully", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching conflict data", error.message));
    }
};
export const getAllCourtLitigationStatuses = async (req: Request, res: Response) => {
    try {
        const conflictData = await getCourtLitigationStatuses();
        res.status(200).json(successResponse("Conflict data retrieved successfully", conflictData));
    } catch (error: any) {
        res.status(500).json(errorResponse("Error fetching conflict data", error.message));
    }
};
export const getConflictDashboard = async (req: Request, res: Response) => {
    const { projectId } = req.params;

    if (!projectId) {
        res.status(404).json(notFoundResponse('project Id is required'));
    }

    try {
        const data = await getConflictDashboardData(projectId);
        res.status(200).json(successResponse("ConflictDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};