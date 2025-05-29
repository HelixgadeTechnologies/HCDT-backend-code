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
                projectVideo: projectData.projectVideo ? projectData.projectVideo : null,
            },
        });
    } else {
        // Update existing project
        return await prisma.project.update({
            where: { projectId: projectData.projectId },
            data: {
                ...projectData,
                projectVideo: projectData.projectVideo ? projectData.projectVideo : null,
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
export const getProjectsViewByTrust = async (trustId: string): Promise<IProjectClient[]> => {
    const projects = await prisma.$queryRaw<IProjectView[]>`
        SELECT * FROM project_view WHERE trustId = ${trustId}
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
function normalizeBigInts<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts) as any;
    } else if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data; // ✅ Leave Date objects untouched
        }

        const normalized: any = {};
        for (const key in data) {
            const value = (data as any)[key];
            normalized[key] =
                typeof value === 'bigint' ? Number(value) : normalizeBigInts(value);
        }
        return normalized;
    }
    return data;
}
async function callProcedure(option: number, trustId: string): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL ProjectDashboard(?,?)`,
        option,
        trustId
    );
    // console.log(raw)

    const cleaned = normalizeBigInts(raw);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["totalBudget"]: Number(row.f0),
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["annualApprovedBudget"]: Number(row.f0),
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["totalMales"]: Number(row.f0),
            ["totalFemales"]: Number(row.f1),
            ["totalPwDs"]: Number(row.f2),
            ["totalBeneficiaries"]: Number(row.f3)
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["totalMales"]: Number(row.f0),
            ["totalFemales"]: Number(row.f1),
            ["totalPwDs"]: Number(row.f2),
            ["totalEmployees"]: Number(row.f3)
        }));
    } else if (option == 5) {
        return cleaned.map((row: any) => ({
            ["EDUCATION"]: Number(row.f1),
            ["HEALTH"]: Number(row.f2),
            ["ELECTRIFICATION"]: Number(row.f3),
            ["ROAD"]: Number(row.f4),
            ["WATER"]: Number(row.f5),
            ["INFORMATION_TECHNOLOGY"]: Number(row.f6),
            ["AGRICULTURE"]: Number(row.f7)
        }));
    } else if (option == 6) {
        return cleaned.map((row: any) => ({
            ["YET_TO_START"]: Number(row.f1),
            ["IN_PROGRESS"]: Number(row.f2),
            ["GOOD"]: Number(row.f3),
            ["COMPLETED"]: Number(row.f4),
            ["ABANDONED"]: Number(row.f5)
        }));
    } else {
        return []
    }
}
export async function getProjectDashboardData(projectId: string) {
    // Optionally return them as a keyed object
    const keys = [
        'TOTAL_BUDGET',
        'TOTAL_ANNUAL_BUDGET',
        'BENEFITS',
        'EMPLOYMENT',
        'CATEGORY',
        'STATUS',
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(index + 1, projectId);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}