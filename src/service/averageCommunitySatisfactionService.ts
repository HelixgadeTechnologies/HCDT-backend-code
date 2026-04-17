import { PrismaClient, Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { IAcsOptionOne, IAcsOptionTwo, IAverageCommunitySatisfaction, IAverageCommunitySatisfactionView } from "../interface/averageCommunitySatisfactionInterface";
import { getEmailsFronDraAndNUPRC } from "./conflictService";
import { sendConflictReportEmail, sendGeneralSurveyReportEmail } from "../utils/mail";

const prisma = new PrismaClient();

export const upsertAverageCommunitySatisfaction = async (
    data: IAverageCommunitySatisfaction,
    isCreate: boolean
) => {
    try {
        const emails = await getEmailsFronDraAndNUPRC(data.trustId as string);
        if (isCreate) {
            await sendGeneralSurveyReportEmail(emails, "Average Community Satisfaction");
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

    } catch (error) {
        throw new Error(`Error in upsertAverageCommunitySatisfaction: ${error}`);

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
async function callProcedure(trustId: string, option: number, selectedYear: number, selectedState: string, settlor: string): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetCommunitySatisfactionDashboard(?, ?, ?, ?,?)`,
        trustId,
        option,
        selectedYear,
        selectedState,
        settlor
    );

    const cleaned = normalizeBigInts(raw);
    if (option < 8) {
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]: {
                ["STRONGLY DISAGREE"]: row.f1,
                ["DISAGREE"]: row.f2,
                ["SLIGHTLY AGREE"]: row.f3,
                ["AGREE"]: row.f4,
                ["STRONGLY AGREE"]: row.f5,
            },
            ["VALUE TYPE"]: "Total"
        }));
    } else {
        return cleaned.map((row: any) => ({
            ["QUESTION"]: row.f0,
            ["RESPONSE"]: {
                ["TRUE"]: row.f1,
                ["IN PROGRESS"]: row.f2,
                ["NOT TRUE"]: row.f3,
                ["PROJECT YET TO BE IMPLEMENTED IN MY COMMUNITY"]: row.f4,
            },
            ["VALUE TYPE"]: "Percentage"
        }));
    }
}

// Function to call all options in parallel
export async function getCommunitySatisfactionDashboard(trustId: string, selectedYear: number, selectedState: string, settlor: string) {
    // Optionally return them as a keyed object
    const keys = [
        'infoProjects',
        'communityConsult',
        'localParticipation',
        'reportMechanism',
        'conflictMinimization',
        'settlorAction',
        'nuprcAction',
        'projectHandover',
        'maintenanceConsult',
        'incomeProject',
    ];


    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(trustId, index + 1, selectedYear, selectedState, settlor);
        finalResult[keys[index]] = result;
    }


    return finalResult;
}

export async function validateSatisfactionFile(base64String: string): Promise<any> {
    try {
        const buffer = Buffer.from(base64String, "base64");
        const workbook = XLSX.read(buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames.find(
            (name) => name.toLowerCase() === "satisfaction" || name.toLowerCase() === "database"
        ) || workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

        // Fetch valid trust IDs
        const existingTrusts = await prisma.trust.findMany({
            select: { trustId: true, trustName: true }
        });
        const trustIds = new Set(existingTrusts.map(t => t.trustId));
        const trustNames = new Map(existingTrusts.map(t => [t.trustName.toUpperCase().trim(), t.trustId]));

        const validationSummary: any[] = [];
        const expectedNumericFields = [
            'infoProjects', 'communityConsult', 'localParticipation', 'reportMechanism', 
            'conflictMinimization', 'settlorAction', 'nuprcAction', 'projectHandover', 
            'maintenanceConsult', 'incomeProject'
        ];

        jsonData.forEach((row: any, index: number) => {
            const rowNumber = index + 2;
            const errors: any[] = [];

            // Trust validation
            let trustId = row["trustId"];
            const trustName = row["trustName"]?.toString().trim().toUpperCase();

            if (!trustId && trustName) {
                trustId = trustNames.get(trustName);
            }

            if (!trustId) {
                errors.push({ rowNumber, field: "trustId", message: "Missing or invalid Trust ID/Name", value: row["trustId"] || row["trustName"] });
            } else if (!trustIds.has(trustId)) {
                errors.push({ rowNumber, field: "trustId", message: `Trust ID "${trustId}" not found`, value: trustId });
            }

            // Numeric field validation
            expectedNumericFields.forEach(field => {
                const val = row[field];
                if (val !== null && val !== undefined && val !== "") {
                    const num = Number(val);
                    if (isNaN(num)) {
                        errors.push({ rowNumber, field, message: `Field "${field}" must be a number`, value: val });
                    } else {
                        // Check ranges based on satisfaction form pattern
                        const isOptionOneField = ['infoProjects', 'communityConsult', 'localParticipation', 'reportMechanism', 'conflictMinimization', 'settlorAction', 'nuprcAction'].includes(field);
                        const maxVal = isOptionOneField ? 5 : 4;
                        if (num < 1 || num > maxVal) {
                            errors.push({ rowNumber, field, message: `Field "${field}" must be between 1 and ${maxVal}`, value: num });
                        }
                    }
                }
            });

            if (errors.length > 0) {
                validationSummary.push(...errors);
            }
        });

        return {
            totalRecords: jsonData.length,
            totalInvalid: validationSummary.length,
            allSatisfactionData: jsonData,
            validationSummary,
        };
    } catch (error: any) {
        console.error("Error validating satisfaction file:", error);
        throw new Error("Failed to process Excel file.");
    }
}

export const bulkSaveSatisfaction = async (records: any[]) => {
    const failed: any[] = [];
    const validRecords: Prisma.AverageCommunitySatisfactionCreateManyInput[] = [];

    try {
        const existingTrusts = await prisma.trust.findMany({ select: { trustId: true, trustName: true } });
        const trustIds = new Set(existingTrusts.map(t => t.trustId));
        const trustNames = new Map(existingTrusts.map(t => [t.trustName.toUpperCase().trim(), t.trustId]));

        for (const [index, data] of records.entries()) {
            try {
                let trustId = data.trustId;
                if (!trustId && data.trustName) {
                    trustId = trustNames.get(data.trustName.toString().toUpperCase().trim());
                }

                if (!trustId || !trustIds.has(trustId)) {
                    failed.push({ index, message: "Invalid Trust association", trustName: data.trustName, trustId: data.trustId });
                    continue;
                }

                validRecords.push({
                    infoProjects: Number(data.infoProjects) || 0,
                    communityConsult: Number(data.communityConsult) || 0,
                    localParticipation: Number(data.localParticipation) || 0,
                    reportMechanism: Number(data.reportMechanism) || 0,
                    conflictMinimization: Number(data.conflictMinimization) || 0,
                    settlorAction: Number(data.settlorAction) || 0,
                    nuprcAction: Number(data.nuprcAction) || 0,
                    projectHandover: Number(data.projectHandover) || 0,
                    maintenanceConsult: Number(data.maintenanceConsult) || 0,
                    incomeProject: Number(data.incomeProject) || 0,
                    trustId: trustId,
                });
            } catch (error: any) {
                failed.push({ index, message: error.message, data });
            }
        }

        const result = validRecords.length > 0 
            ? await prisma.averageCommunitySatisfaction.createMany({ data: validRecords, skipDuplicates: true })
            : { count: 0 };

        return {
            totalRecords: records.length,
            totalInserted: result.count,
            totalFailed: failed.length,
            failed,
        };
    } catch (error) {
        console.error("Bulk satisfaction upload failed:", error);
        throw new Error("Bulk satisfaction upload failed");
    }
};
