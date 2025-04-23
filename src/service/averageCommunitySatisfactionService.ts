import { PrismaClient } from "@prisma/client";
import { IAcsOptionOne, IAcsOptionTwo, IAverageCommunitySatisfaction, IAverageCommunitySatisfactionView } from "../interface/averageCommunitySatisfactionInterface";

const prisma = new PrismaClient();

export const upsertAverageCommunitySatisfaction = async (
    data: IAverageCommunitySatisfaction,
    isCreate: boolean
) => {
    if (isCreate) {
        return await prisma.averageCommunitySatisfaction.create({
            data: { ...data, averageCommunitySatisfactionId: undefined },
        });
    } else {
        if (!data.averageCommunitySatisfactionId) {
            throw new Error("averageCommunitySatisfactionId is required for updating.");
        }

        return await prisma.averageCommunitySatisfaction.update({
            where: { averageCommunitySatisfactionId: data.averageCommunitySatisfactionId },
            data,
        });
    }
};

export const getAllAverageCommunitySatisfaction = async (): Promise<IAverageCommunitySatisfactionView[]> => {
    try {
        const averageCommunitySatisfaction = await prisma.$queryRaw<IAverageCommunitySatisfactionView[]>`
            SELECT * FROM average_community_satisfaction_view
        `;
        return averageCommunitySatisfaction;
    } catch (error) {
        throw new Error("Failed to retrieve average_community_satisfaction data");
    }
};

export const getAverageCommunitySatisfaction = async (averageCommunitySatisfactionId: string): Promise<IAverageCommunitySatisfactionView | null> => {
    try {
        const averageCommunitySatisfaction = await prisma.$queryRaw<IAverageCommunitySatisfactionView[]>`
            SELECT * FROM average_community_satisfaction_view WHERE averageCommunitySatisfactionId = ${averageCommunitySatisfactionId}
        `;
        return averageCommunitySatisfaction.length > 0 ? averageCommunitySatisfaction[0] : null;
    } catch (error) {
        throw new Error("Failed to retrieve average_community_satisfaction data");
    }
};
export const getAllAverageCommunitySatisfactionByTrust = async (trustId: string): Promise<IAverageCommunitySatisfactionView[]> => {
    try {
        const averageCommunitySatisfaction = await prisma.$queryRaw<IAverageCommunitySatisfactionView[]>`
            SELECT * FROM average_community_satisfaction_view WHERE trustId = ${trustId}
        `;
        return averageCommunitySatisfaction.length > 0 ? averageCommunitySatisfaction : [];
    } catch (error) {
        throw new Error("Failed to retrieve average_community_satisfaction data");
    }
};

export const getAcsOptionOne = async (): Promise<IAcsOptionOne[]> => {
    try {
        const acsOptionOnes = await prisma.acsOptionOne.findMany();
        return acsOptionOnes
    } catch (error) {
        throw new Error(`Error fetching average-community-satisfaction-related data: ${error}`);
    }
}
export const getAcsOptionTwo = async (): Promise<IAcsOptionTwo[]> => {
    try {
        const acsOptionTwos = await prisma.acsOptionTwo.findMany();
        return acsOptionTwos
    } catch (error) {
        throw new Error(`Error fetching average-community-satisfaction-related data: ${error}`);
    }
}
function normalizeBigInts<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts) as any;
    } else if (typeof data === 'object' && data !== null) {
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
// Function to call the stored procedure for a specific option
async function callProcedure(trustId: string, option: number): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetCommunitySatisfactionDashboard(?, ?)`,
        trustId,
        option
    );

    const cleaned = normalizeBigInts(raw);
    if (option < 6) {
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]:{
                ["STRONGLY DISAGREE"]: row.f1,
                ["DISAGREE"]: row.f2,
                ["SLIGHTLY AGREE"]: row.f3,
                ["AGREE"]: row.f4,
                ["STRONGLY AGREE"]: row.f5,
            },
            ["VALUE TYPE"]:"Total"
        }));
    }else{
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]:{
                ["TRUE"]: row.f1,
                ["IN PROGRESS"]: row.f2,
                ["NOT TRUE"]: row.f3,
                ["PROJECT YET TO BE IMPLEMENTED IN MY COMMUNITY"]: row.f4,
            },
            ["VALUE TYPE"]:"Percentage"
        }));
    }
}

// Function to call all options in parallel
export async function getCommunitySatisfactionDashboard(trustId: string) {
    // Optionally return them as a keyed object
    const keys = [
        'infoProjects',
        'communityConsult',
        'localParticipation',
        'reportMechanism',
        'conflictMinimization',
        'projectHandover',
        'maintenanceConsult',
        'incomeProject',
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(trustId, index + 1);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}
