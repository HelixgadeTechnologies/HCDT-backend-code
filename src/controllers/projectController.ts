import { Request, Response } from "express";
import { createOrUpdateProject, getAllProjectCategories, getAllProjectsView, getAllQualityRatings, getAllStatusReports, getAllTypeOfWork, getProjectDashboardData, getProjectsView, getProjectsViewByTrust } from "../service/projectService";
import { errorResponse, notFoundResponse, successResponse } from "../utils/responseHandler";

export const addOrUpdateProject = async (req: Request, res: Response) => {
    try {
        const { isCreate, data } = req.body;

        if (typeof isCreate !== "boolean") {
            res.status(400).json(errorResponse("Invalid request: isCreate must be a boolean."));
        }

        if (!isCreate && !data.projectId) {
            res.status(400).json(errorResponse("Project ID is required for updating."));
        }

        const project = await createOrUpdateProject(data, isCreate);

        const message = isCreate ? "Project created successfully" : "Project updated successfully";
        res.status(201).json(successResponse(message, project));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error.message));
    }
};

export const listProjects = async (req: Request, res: Response) => {
    try {
        const projects = await getAllProjectsView();

        if (projects.length === 0) {
            return res
                .status(400)
                .json(notFoundResponse("Projects not found", []));
        }

        return res
            .status(200)
            .json(successResponse("Projects retrieved successfully", projects));
    } catch (error: any) {
        console.error(error);
        return res
            .status(500)
            .json(errorResponse("Internal server error", error));
    }
};

export const getProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        if (!projectId) {
            res.status(400).json(notFoundResponse("Project ID is required", projectId));
        }

        const projects = await getProjectsView(Array.isArray(projectId) ? projectId[0] : projectId);
        if (projects.length == 0) {
            res.status(400).json(notFoundResponse("Project not found", null));
        }
        res.status(200).json(successResponse("Project", projects[0]));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};
export const getProjectByTrust = async (req: Request, res: Response) => {
    try {
        const { trustId } = req.params;
        if (!trustId) {
            res.status(400).json(notFoundResponse("Trust ID is required", trustId));
        }

        const projects = await getProjectsViewByTrust(Array.isArray(trustId) ? trustId[0] : trustId);

        res.status(200).json(successResponse("Project", projects));
    } catch (error: any) {
        res.status(500).json(errorResponse("Internal server error", error));
    }
};

export const getProjectCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getAllProjectCategories();
        res.status(200).json(successResponse("Project categories retrieved", categories));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to retrieve project categories", error));
    }
};

export const getQualityRatings = async (req: Request, res: Response) => {
    try {
        const ratings = await getAllQualityRatings();
        res.status(200).json(successResponse("Quality ratings retrieved", ratings));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to retrieve quality ratings", error));
    }
};

export const getStatusReports = async (req: Request, res: Response) => {
    try {
        const reports = await getAllStatusReports();
        res.status(200).json(successResponse("Status reports retrieved", reports));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to retrieve status reports", error));
    }
};

export const getTypeOfWork = async (req: Request, res: Response) => {
    try {
        const typesOfWork = await getAllTypeOfWork();
        res.status(200).json(successResponse("Types of work retrieved", typesOfWork));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to retrieve types of work", error));
    }
};

export const getProjectDashboard = async (req: Request, res: Response) => {
    const { trustId, year, state, settlor } = req.params;

    if (!trustId) {
        res.status(404).json(notFoundResponse('Trust Id is required'));
    }

    try {
        const trustIdStr = Array.isArray(trustId) ? trustId[0] : trustId;
        const yearStr = Array.isArray(year) ? year[0] : year;
        const stateStr = Array.isArray(state) ? state[0] : state;
        const settlorStr = Array.isArray(settlor) ? settlor[0] : settlor;
        const data = await getProjectDashboardData(trustIdStr, Number(yearStr), stateStr, settlorStr);
        res.status(200).json(successResponse("ProjectDashboard", data));
    } catch (error) {
        res.status(500).json(errorResponse('Failed to load dashboard data', error));
    }
};