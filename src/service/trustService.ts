import { Prisma, PrismaClient, Trust, TrustEstablishmentStatus } from "@prisma/client";
import { IBotDetailsInsert, IOperationalExpenditureInsert, ITrust, ITrustEstablishmentStatus, ITrustView } from "../interface/trustInterface";
import { bufferToHex, hexToBuffer } from "../utils/hexBufaBufaHex";

const prisma = new PrismaClient();

export const createOrUpdateTrust = async (data: ITrust, isCreate: boolean) => {

    // Prepare trust data
    const trustData: Prisma.TrustCreateInput = {
        trustName: data.trustName as string,
        nameOfOmls: data.nameOfOmls || null,
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
    };

    // Handle the foreign key for `settlorId`
    if (data.settlorId && data.userId) {
        trustData["settlor"] = { connect: { settlorId: data.settlorId } };
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

export const removeTrust = async (trustId: string): Promise<Trust> => {
    let trust = await prisma.trust.findUnique({ where: { trustId } })

    if (trust == null) {
        throw new Error(`Invalid trust ID`);
    }

    let deletedTrust = await prisma.trust.delete({ where: { trustId } })
    return deletedTrust
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
        yearOfFundsReceivedByTrust: data.yearOfFundsReceivedByTrust ?? null,
        totalFundsReceivedByTrust: data.totalFundsReceivedByTrust ?? null,
        capitalExpenditure: data.capitalExpenditure ?? null,
        reserve: data.reserve ?? null,
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
    };

    let trustEstablishmentStatus;

    // Use upsert to avoid redundant findUnique()
    trustEstablishmentStatus = await prisma.trustEstablishmentStatus.upsert({
        where: { trustId: data.trustId },
        update: trustOperationalEstablishmentData,
        create: trustOperationalEstablishmentData,
    });

    //  Handle settlorOperationalExpenditures efficiently
    if (data.settlorOperationalExpenditures!.length > 0) {
        const operationalExpenditureInsert: IOperationalExpenditureInsert[] = data.settlorOperationalExpenditures!.map((ope) => ({
            settlorOperationalExpenditureYear: ope.settlorOperationalExpenditureYear,
            settlorOperationalExpenditure: ope.settlorOperationalExpenditure,
            trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId,
        }));

        await prisma.$transaction([
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

    return {
        ...trustEstablishmentStatus,
        trustId: trustEstablishmentStatus.trustId as string,
        settlorOperationalExpenditures
    } as ITrustEstablishmentStatus;
};
