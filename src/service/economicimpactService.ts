import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import { IEconomicImpact, IEconomicImpactView, IImpactOptionOne, IImpactOptionTwo } from "../interface/economicImpactInterface";
import { getEmailsFronDraAndNUPRC } from "./conflictService";
import { sendConflictReportEmail, sendGeneralSurveyReportEmail } from "../utils/mail";

const prisma = new PrismaClient();

export const upsertEconomicImpact = async (data: IEconomicImpact, isCreate: boolean): Promise<IEconomicImpact> => {

    const emails = await getEmailsFronDraAndNUPRC(data.trustId as string);
    if (isCreate) {
          await sendGeneralSurveyReportEmail(emails, "Economic Impact");
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

export async function getEconomicImpactDataByTrust(trustId: string, selectedYear: number, selectedState: string, settlor: string) {
    // Optionally return them as a keyed object
    const keys = [
        'businessGrowth',
        'incomeIncrease',
        'livelihoodImprove',
        'accessAmenities'
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(trustId, index + 1, selectedYear, selectedState, settlor);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}

export async function validateEconomicImpactFile(base64String: string): Promise<any> {
    try {
        const buffer = Buffer.from(base64String, "base64");
        const workbook = XLSX.read(buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames.find(
            (name) => name.toLowerCase() === "economic impact" || name.toLowerCase() === "database"
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
            'businessGrowth', 'incomeIncrease', 'livelihoodImprove', 'accessAmenities'
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
                        // Check ranges
                        const maxVal = field === 'accessAmenities' ? 7 : 3;
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
            allEconomicImpactData: jsonData,
            validationSummary,
        };
    } catch (error: any) {
        console.error("Error validating economic impact file:", error);
        throw new Error("Failed to process Excel file.");
    }
}

export const bulkSaveEconomicImpact = async (records: any[]) => {
    const failed: any[] = [];
    const validRecords: any[] = [];

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
                    businessGrowth: Number(data.businessGrowth) || 0,
                    incomeIncrease: Number(data.incomeIncrease) || 0,
                    livelihoodImprove: Number(data.livelihoodImprove) || 0,
                    accessAmenities: Number(data.accessAmenities) || 0,
                    trustId: trustId,
                });
            } catch (error: any) {
                failed.push({ index, message: error.message, data });
            }
        }

        const result = validRecords.length > 0 
            ? await prisma.economicImpact.createMany({ data: validRecords, skipDuplicates: true })
            : { count: 0 };

        return {
            totalRecords: records.length,
            totalInserted: result.count,
            totalFailed: failed.length,
            failed,
        };
    } catch (error) {
        console.error("Bulk economic impact upload failed:", error);
        throw new Error("Bulk economic impact upload failed");
    }
};
