import { Prisma, PrismaClient } from "@prisma/client";
import { IProject, IProjectCategory, IProjectClient, IProjectView, IQualityRating, IStatusReport, ITypeOfWork } from "../interface/projectInterface";
import { bufferToHex, hexToBuffer } from "../utils/hexBufaBufaHex";
const prisma = new PrismaClient();
export const createOrUpdateProject = async (projectData: IProject, isCreate: boolean) => {
    if (isCreate) {
        let existingProject = await prisma.project.findUnique({ where: { projectTitle: projectData.projectTitle } })

        if (existingProject) {
            throw new Error("Project with this title already exist");
        }

        // Create new project
        return await prisma.project.create({
            data: {
                ...projectData,
                projectTitle: projectData.projectTitle as string,
                projectId: undefined,
                projectVideo: projectData.projectVideo ? projectData.projectVideo: null,
            },
        });
    } else {
        // Update existing project
        return await prisma.project.update({
            where: { projectId: projectData.projectId },
            data: {
                ...projectData,
                projectVideo: projectData.projectVideo ?projectData.projectVideo: null,
            },
        });
    }
};

export const getAllProjectsView = async (): Promise<IProjectClient[]> => {
    const projects = await prisma.$queryRaw<IProjectView[]>`
        SELECT * FROM project_view
    `;
    return projects
};

export const getProjectsView = async (projectId: string): Promise<IProjectClient[]> => {
    const projects = await prisma.$queryRaw<IProjectView[]>`
        SELECT * FROM project_view WHERE projectId = ${projectId}
    `;
    return projects
};

// Get all Project Categories
export const getAllProjectCategories = async (): Promise<IProjectCategory[]> => {
    return await prisma.projectCategory.findMany();
};

// Get all Quality Ratings
export const getAllQualityRatings = async (): Promise<IQualityRating[]> => {
    return await prisma.qualityRating.findMany();
};

// Get all Status Reports
export const getAllStatusReports = async (): Promise<IStatusReport[]> => {
    return await prisma.statusReport.findMany();
};

export const getAllTypeOfWork = async (): Promise<ITypeOfWork[]> => {
    return await prisma.typeOfWork.findMany();
};