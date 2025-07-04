import { Prisma, PrismaClient } from "@prisma/client";
import { IFundsReceived, IOperationalExpenditureInsert, ITrust, ITrustEstablishmentStatus, ITrustView } from "../interface/trustInterface";
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
            ["yearDeveloped"]: Number(row.f5),
            ["yearExpired"]: Number(row.f6),
            ["communityLeadershipConsulted"]: Number(row.f7),
            ["communityYouthsConsulted"]: Number(row.f8),
            ["communityWomenConsulted"]: Number(row.f9),
            ["pwDsConsulted"]: Number(row.f10),
            ["yearOfNeedsAssessment"]: Number(row.f11),
            ["trustDistributionMatrixDocument"]: row.f12,
            ["completionStatus"]: row.f13,
            ["updateAt"]: row.f14,
            ["statusOfNeedAssessment"]: Number(row.f15),
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
