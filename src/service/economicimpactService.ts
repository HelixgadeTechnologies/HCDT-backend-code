import { PrismaClient } from "@prisma/client";
import { IEconomicImpact, IEconomicImpactView, IImpactOptionOne, IImpactOptionTwo } from "../interface/economicImpactInterface";

const prisma = new PrismaClient();

export const upsertEconomicImpact = async (data: IEconomicImpact, isCreate: boolean): Promise<IEconomicImpact> => {
    if (isCreate) {
        // Create a new Economic Impact record
        return await prisma.economicImpact.create({
            data: { ...data, economicImpactId: undefined },
        });
    } else {
        // Update an existing Economic Impact record
        return await prisma.economicImpact.update({
            where: { economicImpactId: data.economicImpactId },
            data,
        });
    }
};

export const getAllEconomicImpacts = async (): Promise<IEconomicImpactView[]> => {
    return await prisma.$queryRaw`SELECT * FROM economic_impact_view`;
};

export const getEconomicImpactById = async (economicImpactId: string): Promise<IEconomicImpactView[]> => {
    return await prisma.$queryRaw`
        SELECT * FROM economic_impact_view WHERE economicImpactId = ${economicImpactId}
    `;
};
export const getEconomicImpactByTrustId = async (trustId: string): Promise<IEconomicImpactView[]> => {
    return await prisma.$queryRaw`
        SELECT * FROM economic_impact_view WHERE trustId = ${trustId}
    `;
};

export const getImpactOptionOne = async (): Promise<IImpactOptionOne[]> => {
    try {
        const acsOptionOnes = await prisma.impactOptionOne.findMany();
        return acsOptionOnes
    } catch (error) {
        throw new Error(`Error fetching economic-impact-related data: ${error}`);
    }
}
export const getImpactOptionTwo = async (): Promise<IImpactOptionTwo[]> => {
    try {
        const impactOptionTwo = await prisma.impactOptionTwo.findMany();
        return impactOptionTwo
    } catch (error) {
        throw new Error(`Error fetching economic-impact-related data: ${error}`);
    }
}