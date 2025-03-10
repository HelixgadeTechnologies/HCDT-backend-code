import { PrismaClient } from "@prisma/client";
import { IAcsOptionOne, IAcsOptionTwo, IAverageCommunitySatisfaction, IAverageCommunitySatisfactionView } from "../interface/averageCommunitySatisfactionInterface";

const prisma = new PrismaClient();

export const upsertAverageCommunitySatisfaction = async (
    data: IAverageCommunitySatisfaction,
    isCreate: boolean
) => {
    if (isCreate) {
        return await prisma.averageCommunitySatisfaction.create({
            data:{...data,averageCommunitySatisfactionId:undefined},
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

export const getAverageCommunitySatisfaction = async (averageCommunitySatisfactionId:string): Promise<IAverageCommunitySatisfactionView | null> => {
    try {
        const averageCommunitySatisfaction = await prisma.$queryRaw<IAverageCommunitySatisfactionView[]>`
            SELECT * FROM average_community_satisfaction_view WHERE averageCommunitySatisfactionId = ${averageCommunitySatisfactionId}
        `;
        return averageCommunitySatisfaction.length > 0 ? averageCommunitySatisfaction[0] : null;
    } catch (error) {
        throw new Error("Failed to retrieve average_community_satisfaction data");
    }
};
export const getAllAverageCommunitySatisfactionByTrust = async (trustId:string): Promise<IAverageCommunitySatisfactionView[]> => {
    try {
        const averageCommunitySatisfaction = await prisma.$queryRaw<IAverageCommunitySatisfactionView[]>`
            SELECT * FROM average_community_satisfaction_view WHERE trustId = ${trustId}
        `;
        return averageCommunitySatisfaction.length > 0 ? averageCommunitySatisfaction:[];
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