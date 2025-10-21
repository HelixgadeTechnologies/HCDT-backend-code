import { Prisma, PrismaClient } from "@prisma/client";
import { IFundsReceived, IOperationalExpenditureInsert, ITrust, ITrustEstablishmentStatus, ITrustView } from "../interface/trustInterface";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { sendReportLinkEmail } from "../utils/mail";
import { getEmailsFromDraAndAdmin } from "./conflictService";


const prisma = new PrismaClient();

export const createOrUpdateTrust = async (data: ITrust, isCreate: boolean) => {


    // Prepare trust data
    const trustData: Prisma.TrustCreateInput = {
        trustName: data.trustName as string,
        nameOfOmls: data.nameOfOmls || null,
        settlor: data.settlor || null,
        country: data.country || null,
        state: data.state || null,
        localGovernmentArea: data.localGovernmentArea || null,
        trustCommunities: data.trustCommunities || null,
        numberOfTrustCommunities: data.numberOfTrustCommunities || null,
        totalMaleBotMembers: data.totalMaleBotMembers || null,
        totalFemaleBotMembers: data.totalFemaleBotMembers || null,
        totalPwdBotMembers: data.totalPwdBotMembers || null,
        totalMaleAdvisoryCommitteeMembers: data.totalMaleAdvisoryCommitteeMembers || null,
        totalFemaleAdvisoryCommitteeMembers: data.totalFemaleAdvisoryCommitteeMembers || null,
        totalPwdAdvisoryCommitteeMembers: data.totalPwdAdvisoryCommitteeMembers || null,
        totalMaleManagementCommitteeMembers: data.totalMaleManagementCommitteeMembers || null,
        totalFemaleManagementCommitteeMembers: data.totalFemaleManagementCommitteeMembers || null,
        totalPwdManagementCommitteeMembers: data.totalPwdManagementCommitteeMembers || null,
        botDetailsOneFirstName: data.botDetailsOneFirstName || null,
        botDetailsOneLastName: data.botDetailsOneLastName || null,
        botDetailsOneEmail: data.botDetailsOneEmail || null,
        botDetailsOnePhoneNumber: data.botDetailsTwoPhoneNumber || null,
        botDetailsTwoFirstName: data.botDetailsTwoFirstName || null,
        botDetailsTwoLastName: data.botDetailsTwoLastName || null,
        botDetailsTwoEmail: data.botDetailsTwoEmail || null,
        botDetailsTwoPhoneNumber: data.botDetailsTwoPhoneNumber || null,
        completionStatus: data.completionStatus ?? null,
    };

    // Handle the foreign key for `settlorId`
    if (data.userId) {
        trustData["user"] = { connect: { userId: data.userId } };
    }

    let trust;

    if (isCreate) {
        trust = await prisma.trust.create({
            data: trustData
        });
    } else {
        let uniqueTrust = await prisma.trust.findUnique({ where: { trustId: data.trustId } })

        if (uniqueTrust == null) {
            throw new Error(`Invalid trust ID`);
        }

        trust = await prisma.trust.update({
            where: { trustId: data.trustId },
            data: trustData,
        });
    }
};

export const getAllTrust = async (): Promise<Array<ITrustView>> => {

    const trusts: Array<ITrustView> = await prisma.$queryRaw`
      SELECT * FROM trust_view
    `;

    return trusts
}

export const getTrust = async (trustId: string): Promise<ITrustView | null> => {
    const trusts: ITrustView[] = await prisma.$queryRaw`
        SELECT * FROM trust_view WHERE trustId = ${trustId}
    `;

    if (!trusts.length) return null; // Return null if trust is not found

    return trusts[0] as ITrustView;
};

export const removeTrust = async (trustId: string): Promise<void> => {
    await prisma.$queryRawUnsafe<any[]>(
        `CALL DeleteTrust(?)`,
        trustId
    );
}
export const addTrustEstablishmentStatus = async (data: ITrustEstablishmentStatus) => {

    const trustOperationalEstablishmentData = {
        trustId: data.trustId ?? null,
        trustRegisteredWithCAC: data.trustRegisteredWithCAC ?? null,
        cscDocument: data.cscDocument ? data.cscDocument : null,
        cscDocumentMimeType: data.cscDocumentMimeType ?? null,
        yearIncorporated: data.yearIncorporated ?? null,
        botConstitutedAndInaugurated: data.botConstitutedAndInaugurated ?? null,
        managementCommitteeConstitutedAndInaugurated: data.managementCommitteeConstitutedAndInaugurated ?? null,
        advisoryCommitteeConstitutedAndInaugurated: data.advisoryCommitteeConstitutedAndInaugurated ?? null,
        isTrustDevelopmentPlanReadilyAvailable: data.isTrustDevelopmentPlanReadilyAvailable ?? null,
        isTrustDevelopmentPlanBudgetReadilyAvailable: data.isTrustDevelopmentPlanBudgetReadilyAvailable ?? null,
        yearDeveloped: data.yearDeveloped ?? null,
        yearExpired: data.yearExpired ?? null,
        developmentPlanDocument: data.developmentPlanDocument ? data.developmentPlanDocument : null,
        developmentPlanDocumentMimeType: data.developmentPlanDocumentMimeType ?? null,
        developmentPlanBudgetDocument: data.developmentPlanBudgetDocument ? data.developmentPlanBudgetDocument : null,
        developmentPlanBudgetDocumentMimeType: data.developmentPlanBudgetDocumentMimeType ?? null,
        admin: data.admin ?? null,
        yearOfNeedsAssessment: data.yearOfNeedsAssessment ?? null,
        statusOfNeedAssessment: data.statusOfNeedAssessment ?? null,
        communityWomenConsulted: data.communityWomenConsulted ?? null,
        pwDsConsulted: data.pwDsConsulted ?? null,
        communityYouthsConsulted: data.communityYouthsConsulted ?? null,
        communityLeadershipConsulted: data.communityLeadershipConsulted ?? null,
        attendanceSheet: data.attendanceSheet ?? null,
        distributionMatrixDevelopedBySettlor: data.distributionMatrixDevelopedBySettlor ?? null,
        trustDistributionMatrixDocument: data.trustDistributionMatrixDocument ? data.trustDistributionMatrixDocument : null,
        trustDistributionMatrixDocumentMimeType: data.trustDistributionMatrixDocumentMimeType ?? null,
        completionStatus: data.completionStatus ?? null,
    };

    let trustEstablishmentStatus;

    // Use upsert to avoid redundant findUnique()
    trustEstablishmentStatus = await prisma.trustEstablishmentStatus.upsert({
        where: { trustId: data.trustId },
        update: trustOperationalEstablishmentData,
        create: trustOperationalEstablishmentData,
    });


    //  Handle settlorOperationalExpenditures and Funds Received  efficiently
    if (data.settlorOperationalExpenditures!.length > 0 && data.fundsReceive!.length > 0) {

        const fundsReceivedInput: IFundsReceived[] = data.fundsReceive!.map((f) => ({
            yearReceived: f?.yearReceived,
            reserveReceived: f?.reserveReceived,
            capitalExpenditureReceived: f?.capitalExpenditureReceived,
            paymentCheck: f?.paymentCheck,
            totalFundsReceived: f?.totalFundsReceived,
            trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId,
        }));

        // console.log(fundsReceivedInput)

        const operationalExpenditureInsert: IOperationalExpenditureInsert[] = data.settlorOperationalExpenditures!.map((ope) => ({
            settlorOperationalExpenditureYear: ope.settlorOperationalExpenditureYear,
            settlorOperationalExpenditure: ope.settlorOperationalExpenditure,
            trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId,
        }));

        await prisma.$transaction([
            prisma.fundsReceivedByTrust.deleteMany({ where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId } }),
            prisma.fundsReceivedByTrust.createMany({ data: fundsReceivedInput, skipDuplicates: true }),
            prisma.operationalExpenditure.deleteMany({ where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId } }),
            prisma.operationalExpenditure.createMany({ data: operationalExpenditureInsert, skipDuplicates: true }),
        ]);
    }
};


export const getTrustEstablishment = async (trustId: string): Promise<ITrustEstablishmentStatus | null> => {
    const trustEstablishmentStatus = await prisma.trustEstablishmentStatus.findUnique({
        where: { trustId }
    });

    if (!trustEstablishmentStatus) return null;

    const settlorOperationalExpenditures = await prisma.operationalExpenditure.findMany({
        where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId },
    });

    const fundsReceive = await prisma.fundsReceivedByTrust.findMany({
        where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId },
    });

    return {
        ...trustEstablishmentStatus,
        trustId: trustEstablishmentStatus.trustId as string,
        settlorOperationalExpenditures,
        fundsReceive
    } as ITrustEstablishmentStatus;
};

export const setSurveyAccess = async (trustId: string, accessName: string, url: string): Promise<void> => {
    const trust = await prisma.trust.findUnique({
        where: { trustId: trustId }
    });
    // console.log(url)
    const emails = await getEmailsFromDraAndAdmin(trustId);
    if (trust) {
        if (accessName === "CONFLICT") {
            if (trust.disableConflictSurvey == false) {
                await sendReportLinkEmail(emails, "Conflict", url);
                // If the survey is already disabled, we do not send an email
            }

            await prisma.trust.update({
                where: { trustId: trustId },
                data: {
                    disableConflictSurvey: trust.disableConflictSurvey ? false : true,
                },
            });
        } else if (accessName === "SATISFACTION") {
            if (trust.disableConflictSurvey == false) {
                await sendReportLinkEmail(emails, "Average Community Satisfaction", url);
                // If the survey is already disabled, we do not send an email
            }

            await prisma.trust.update({
                where: { trustId: trustId },
                data: {
                    disableSatisfactionSurvey: trust.disableSatisfactionSurvey ? false : true,
                },
            });
        } else if (accessName === "ECONOMIC") {
            if (trust.disableConflictSurvey == false) {
                await sendReportLinkEmail(emails, "Economic Impact", url);
                // If the survey is already disabled, we do not send an email
            }

            await prisma.trust.update({
                where: { trustId: trustId },
                data: {
                    disableEconomicImpactSurvey: trust.disableEconomicImpactSurvey ? false : true,

                },
            });
        }
    }
}
export const removeCACFile = async (establishmentId: string): Promise<void> => {
    // Update cscDocument
    const completionStatus = await prisma.trustEstablishmentStatus.findUnique({
        where: { trustEstablishmentStatusId: establishmentId }
    })
    if (completionStatus) {

        await prisma.trustEstablishmentStatus.update({
            where: { trustEstablishmentStatusId: establishmentId },
            data: {
                cscDocument: null,
                cscDocumentMimeType: null,
                completionStatus: completionStatus.completionStatus! - 6,
            },
        });
    }
}
export const removeMatrixFile = async (establishmentId: string): Promise<void> => {
    const completionStatus = await prisma.trustEstablishmentStatus.findUnique({
        where: { trustEstablishmentStatusId: establishmentId }
    })
    // Update trustDistributionMatrixDocument
    if (completionStatus) {
        await prisma.trustEstablishmentStatus.update({
            where: { trustEstablishmentStatusId: establishmentId },
            data: {
                trustDistributionMatrixDocument: null,
                trustDistributionMatrixDocumentMimeType: null,
                completionStatus: completionStatus.completionStatus! - 6,
            },
        });
    }
}
function normalizeBigInts<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts) as any;
    } else if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data;
        }

        const normalized: any = {};
        for (const key in data) {
            const value = (data as any)[key];

            if (typeof value === 'bigint') {
                normalized[key] = Number(value);
            } else if (typeof value === 'string') {
                normalized[key] = value; // ✅ preserve strings like URLs
            } else {
                normalized[key] = normalizeBigInts(value);
            }
        }
        return normalized;
    }

    return data;
}

async function callProcedure(option: number, trustId: string): Promise<void | any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetTrustEstablishmentDashboard(?,?)`,
        option,
        trustId
    );
    // console.log(raw)
    // console.log(raw[0].f4)

    const cleaned = normalizeBigInts(raw);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["totalFundsReceivedByTrust"]: Number(row.f0),
            ["capitalExpenditure"]: Number(row.f1),
            ["reserve"]: Number(row.f2),
            ["trustRegisteredWithCAC"]: Number(row.f3),
            ["cscDocument"]: row.f4,
            ["yearIncorporated"]: Number(row.f5),
            ["yearDeveloped"]: Number(row.f6),
            ["yearExpired"]: Number(row.f7),
            ["communityLeadershipConsulted"]: Number(row.f8),
            ["communityYouthsConsulted"]: Number(row.f9),
            ["communityWomenConsulted"]: Number(row.f10),
            ["pwDsConsulted"]: Number(row.f11),
            ["yearOfNeedsAssessment"]: Number(row.f12),
            ["trustDistributionMatrixDocument"]: row.f13,
            ["completionStatus"]: row.f14,
            ["updateAt"]: row.f15,
            ["statusOfNeedAssessment"]: Number(row.f16),
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["settlorOperationalExpenditureYear"]: Number(row.f0),
            ["settlorOperationalExpenditure"]: Number(row.f1),
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["trustDevPlanProgress"]: Number(row.f0),
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["botYesPercentage"]: Number(row.f0),
            ["managementYesPercentage"]: Number(row.f1),
            ["advisoryYesPercentage"]: Number(row.f2),
        }));
    } else {
        return []
    }
}
async function callProcedure2(trustId: string, year: number): Promise<void | any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetFundsReceivedByTrust(?,?)`,
        trustId,
        year,
    );
    // console.log(raw)
    // console.log(raw[0].f4)

    const cleaned = normalizeBigInts(raw);
    return cleaned.map((row: any) => ({
        ["totalFundsReceived"]: Number(row.f0),
        ["capitalExpenditureReceived"]: Number(row.f1),
        ["reserveReceived"]: Number(row.f2),
        ["capitalPercentage"]: Number(row.f3),
        ["reservePercentage"]: Number(row.f4),
    }));

}
async function callProcedure3(trustId: string): Promise<void | any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetFundsReceivedStatusByTrust(?)`,
        trustId
    );
    // console.log(raw)
    // console.log(raw[0].f4)

    const cleaned = normalizeBigInts(raw);
    return cleaned.map((row: any) => ({
        ["yearReceived"]: Number(row.f0),
        ["paymentCheck"]: Number(row.f1),
    }));

}
export async function getEstablishmentDashboardData(projectId: string) {
    // Optionally return them as a keyed object
    const keys = [
        'SUB_FIELDS',
        'TRENDS',
        'OPERATION_YEAR',
        'BOT_INAUGURATION_CHECK'
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(index + 1, projectId);
        finalResult[keys[index]] = result;

    }

    return finalResult;
}
export async function getFundsSupplyDashboardData(trustId: string, year: number) {
    // Optionally return them as a keyed object
    const keys = [
        'FINANCIAL_SUMMARY',
    ];

    const finalResult: Record<string, any> = {};
    const result = await callProcedure2(trustId, year);
    finalResult[keys[0]] = result;
    return finalResult;
}
export async function getFundsSupplyStatusDashboardData(trustId: string) {
    // Optionally return them as a keyed object
    const keys = [
        'FINANCIAL_SUMMARY',
    ];

    const finalResult: Record<string, any> = {};
    const result = await callProcedure3(trustId);
    finalResult[keys[0]] = result;
    return finalResult;
}



/**
 * Validates a Trust Excel file provided as a base64 string.
 * The Excel must contain a sheet named "Trust".
 *
 * @param base64String - Base64-encoded Excel file content
 * @returns Validation summary including invalid settlors and full data
 */
// export async function validateTrustFile(base64String: string): Promise<any> {
//     try {
//         // Step 1: Decode base64 to buffer
//         const buffer = Buffer.from(base64String, "base64");

//         // Step 2: Read Excel from buffer
//         const workbook = XLSX.read(buffer, { type: "buffer" });

//         // Step 3: Check if "Trust" sheet exists
//         const sheetName = workbook.SheetNames.find(
//             (name) => name.toLowerCase() === "trust"
//         );
//         if (!sheetName) {
//             throw new Error('Excel file must contain a sheet named "Trust".');
//         }

//         // Step 4: Convert sheet to JSON
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

//         // Step 5: Fetch registered settlors
//         const registeredSettlor = await prisma.settlor.findMany({
//             select: { settlorName: true },
//         });

//         const settlorNames = registeredSettlor.map((s) =>
//             s?.settlorName?.toUpperCase().trim()
//         );

//         // Step 6: Validate each row
//         const validationSummary: any[] = [];

//         jsonData.forEach((row: any, index: number) => {
//             const rowNumber = index + 2; // Excel rows start at 2 (headers at 1)
//             const settlor = row["settlor"]
//                 ? row["settlor"].toString().trim()
//                 : null;

//             if (!settlor) {
//                 validationSummary.push({
//                     rowNumber,
//                     message: "Missing settlor name",
//                     data: row,
//                 });
//             } else if (!settlorNames.includes(settlor.toUpperCase())) {
//                 validationSummary.push({
//                     rowNumber,
//                     message: `Settlor "${settlor}" not registered`,
//                     data: row,
//                 });
//             }
//         });

//         // Step 7: Return structured validation results
//         return {
//             totalRecords: jsonData.length,
//             totalInvalid: validationSummary.length,
//             allTrustData: jsonData,
//             validationSummary,
//         };
//     } catch (error: any) {
//         console.error("Error validating trust file:", error);
//         throw new Error("Failed to process Excel file.");
//     }
// }


interface ValidationError {
    rowNumber: number;
    field: string;
    message: string;
    value: any;
    data: any;
}

/**
 * Validates a Trust Excel file provided as a base64 string.
 * Ensures correct sheet, field data types, and valid settlors.
 */
export async function validateTrustFile(base64String: string): Promise<any> {
    try {
        // Step 1: Decode base64 to buffer
        const buffer = Buffer.from(base64String, "base64");

        // Step 2: Read Excel from buffer
        const workbook = XLSX.read(buffer, { type: "buffer" });

        // Step 3: Ensure "Trust" sheet exists
        const sheetName = workbook.SheetNames.find(
            (name) => name.toLowerCase() === "trust"
        );
        if (!sheetName) {
            throw new Error('Excel file must contain a sheet named "Trust".');
        }

        // Step 4: Parse the sheet to JSON
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

        // Step 5: Fetch valid settlors
        const registeredSettlor = await prisma.settlor.findMany({
            select: { settlorName: true },
        });
        const settlorNames = registeredSettlor.map((s) =>
            s?.settlorName?.toUpperCase().trim()
        );

        // Step 6: Define expected data types
        const expectedTypes: Record<string, "string" | "number"> = {
            trustName: "string",
            settlor: "string",
            country: "string",
            state: "string",
            localGovernmentArea: "string",
            trustCommunities: "string",
            numberOfTrustCommunities: "number",
            totalMaleBotMembers: "number",
            totalFemaleBotMembers: "number",
            totalPwdBotMembers: "number",
            nameOfOmls: "string",
            totalFemaleAdvisoryCommitteeMembers: "number",
            totalFemaleManagementCommitteeMembers: "number",
            totalMaleAdvisoryCommitteeMembers: "number",
            totalMaleManagementCommitteeMembers: "number",
            totalPwdAdvisoryCommitteeMembers: "number",
            totalPwdManagementCommitteeMembers: "number",
            botDetailsOneFirstName: "string",
            botDetailsOneLastName: "string",
            botDetailsOneEmail: "string",
            botDetailsOnePhoneNumber: "string", // always treated as string
            botDetailsTwoFirstName: "string",
            botDetailsTwoLastName: "string",
            botDetailsTwoEmail: "string",
            botDetailsTwoPhoneNumber: "string", // always treated as string
        };

        // Fields to exclude from type validation
        const excludedFromTypeCheck = [
            "botDetailsOnePhoneNumber",
            "botDetailsTwoPhoneNumber",
        ];

        // Step 7: Validate each record
        const validationSummary: ValidationError[] = [];

        jsonData.forEach((row: any, index: number) => {
            const rowNumber = index + 2;
            const errors: ValidationError[] = [];

            // ✅ Settlor validation
            const settlor = row["settlor"]
                ? row["settlor"].toString().trim()
                : null;

            if (!settlor) {
                errors.push({
                    rowNumber,
                    field: "settlor",
                    message: "Missing settlor name",
                    value: null,
                    data: row,
                });
            } else if (!settlorNames.includes(settlor.toUpperCase())) {
                errors.push({
                    rowNumber,
                    field: "settlor",
                    message: `Settlor "${settlor}" not registered`,
                    value: settlor,
                    data: row,
                });
            }

            // ✅ Data type validation (excluding phone numbers)
            Object.entries(expectedTypes).forEach(([key, expectedType]) => {
                const value = row[key];

                if (excludedFromTypeCheck.includes(key)) return; // skip phone numbers
                if (value === null || value === undefined || value === "") return;

                if (expectedType === "number" && isNaN(Number(value))) {
                    errors.push({
                        rowNumber,
                        field: key,
                        message: `Invalid type for "${key}". Expected number but got "${value}"`,
                        value,
                        data: row,
                    });
                }

                if (expectedType === "string" && typeof value !== "string") {
                    errors.push({
                        rowNumber,
                        field: key,
                        message: `Invalid type for "${key}". Expected string but got ${typeof value}`,
                        value,
                        data: row,
                    });
                }
            });

            if (errors.length > 0) validationSummary.push(...errors);
        });

        // Step 8: Return validation summary
        return {
            totalRecords: jsonData.length,
            totalInvalid: validationSummary.length,
            allTrustData: jsonData,
            validationSummary,
        };
    } catch (error: any) {
        console.error("Error validating trust file:", error);
        throw new Error("Failed to process Excel file.");
    }
}


/**
 * Bulk saves multiple trust records to the database.
 * Performs validation to check if a trust with the same trustName already exists.
 * @param trusts - Array of trust objects
 * @param userId - String representing the user ID to associate with each trust
 * @returns Summary of upload results
 */
export const bulkSaveTrusts = async (trusts: ITrust[], userId: string) => {

    const failed: any[] = [];

    try {
        await prisma.$connect();

        // ✅ Fetch all existing trust names once (normalize for case-insensitive match)
        const existingTrusts = await prisma.trust.findMany({
            select: { trustName: true },
        });

        const existingTrustNames = new Set(
            existingTrusts
                .filter(t => t.trustName)
                .map(t => t.trustName.trim().toUpperCase())
        );

        const validatedTrust: Prisma.TrustCreateManyInput[] = [];

        for (const [index, data] of trusts.entries()) {
            try {
                const normalizedName = data.trustName?.trim().toUpperCase();

                if (!normalizedName || existingTrustNames.has(normalizedName)) {
                    failed.push({
                        index,
                        message: "Trust already exists or trustName is missing.",
                        trustName: data.trustName || null,
                        data,
                    });
                    continue;
                }

                // ✅ Prepare trust data
                const trustData: Prisma.TrustCreateManyInput = {
                    trustName: data.trustName!,
                    nameOfOmls: data.nameOfOmls ?? null,
                    settlor: data.settlor ?? null,
                    country: data.country ?? null,
                    state: data.state ?? null,
                    localGovernmentArea: data.localGovernmentArea ?? null,
                    trustCommunities: data.trustCommunities ?? null,
                    numberOfTrustCommunities: data.numberOfTrustCommunities ?? null,
                    totalMaleBotMembers: data.totalMaleBotMembers ?? null,
                    totalFemaleBotMembers: data.totalFemaleBotMembers ?? null,
                    totalPwdBotMembers: data.totalPwdBotMembers ?? null,
                    totalMaleAdvisoryCommitteeMembers: data.totalMaleAdvisoryCommitteeMembers ?? null,
                    totalFemaleAdvisoryCommitteeMembers: data.totalFemaleAdvisoryCommitteeMembers ?? null,
                    totalPwdAdvisoryCommitteeMembers: data.totalPwdAdvisoryCommitteeMembers ?? null,
                    totalMaleManagementCommitteeMembers: data.totalMaleManagementCommitteeMembers ?? null,
                    totalFemaleManagementCommitteeMembers: data.totalFemaleManagementCommitteeMembers ?? null,
                    totalPwdManagementCommitteeMembers: data.totalPwdManagementCommitteeMembers ?? null,
                    botDetailsOneFirstName: data.botDetailsOneFirstName ?? null,
                    botDetailsOneLastName: data.botDetailsOneLastName ?? null,
                    botDetailsOneEmail: data.botDetailsOneEmail ?? null,
                    botDetailsOnePhoneNumber: String(data.botDetailsOnePhoneNumber) ?? null,
                    botDetailsTwoFirstName: data.botDetailsTwoFirstName ?? null,
                    botDetailsTwoLastName: data.botDetailsTwoLastName ?? null,
                    botDetailsTwoEmail: data.botDetailsTwoEmail ?? null,
                    botDetailsTwoPhoneNumber: String(data.botDetailsTwoPhoneNumber) ?? null,
                    userId, // ✅ Direct field for createMany
                };

                validatedTrust.push(trustData);
                existingTrustNames.add(normalizedName); // Prevent duplicates in the same batch
            } catch (error: any) {
                failed.push({
                    index,
                    error: error.message,
                    data,
                });
            }
        }

        // ✅ Perform bulk insert
        const uploadResult = validatedTrust.length
            ? await prisma.trust.createMany({
                data: validatedTrust,
                skipDuplicates: true,
            })
            : { count: 0 };

        return {
            totalRecords: trusts.length,
            totalInserted: uploadResult.count,
            totalFailed: failed.length,
            failed,
        };
    } catch (error) {
        console.error("Bulk upload failed:", error);
        throw new Error("Bulk trust upload failed");
    } finally {
        await prisma.$disconnect();
    }
};
