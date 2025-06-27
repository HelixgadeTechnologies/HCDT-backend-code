import { PrismaClient } from "@prisma/client";
import { IEconomicImpact, IEconomicImpactView, IImpactOptionOne, IImpactOptionTwo } from "../interface/economicImpactInterface";
import { getEmailsFronDraAndNUPRC } from "./conflictService";
import { sendConflictReportEmail } from "../utils/mail";

const prisma = new PrismaClient();

export const upsertEconomicImpact = async (data: IEconomicImpact, isCreate: boolean): Promise<IEconomicImpact> => {

    const emails = await getEmailsFronDraAndNUPRC(data.trustId as string);
    if (isCreate) {
          await sendConflictReportEmail(emails, "Economic Impact");
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
async function callProcedure(trustId: string, option: number, selectedYear:number,selectedState:string,settlor:string): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetEconomicImpactDashboardDataByTrust(?, ?, ?, ?,?)`,
        trustId,
        option,
        selectedYear,
        selectedState,
        settlor
    );

    const cleaned = normalizeBigInts(raw);
    
    if (option < 4) {
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]:{
                ["VERY TRUE"]: row.f1,
                ["SLIGHTLY"]: row.f2,
                ["NOT TRUE"]: row.f3,
            },
            ["VALUE TYPE"]:"Percentage"
        }));
        
    }else{
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]:{
                ["HEALTHCARE"]: row.f1,
                ["EDUCATION"]: row.f2,
                ["PORTABLE WATER"]: row.f3,
                ["ELECTRICITY"]: row.f4,
                ["GOOD ROADS"]: row.f5,
                ["MARKET"]: row.f6,
                ["FAVORABLE BUSINESS ENVIRONMENT"]: row.f7,
            },
            ["VALUE TYPE"]:"tOTAL",
        }));
    }
}

export async function getEconomicImpactDataByTrust(trustId: string,selectedYear:number,selectedState:string,settlor:string) {
    // Optionally return them as a keyed object
    const keys = [
        'businessGrowth',
        'incomeIncrease',
        'livelihoodImprove',
        'accessAmenities'
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(trustId, index + 1,selectedYear,selectedState,settlor);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}
