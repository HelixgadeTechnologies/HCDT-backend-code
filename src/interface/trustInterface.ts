export interface ITrust {
    trustId: string;
    trustName?: string;
    settlor?: string;
    nameOfOmls?: string;
    userId?: string;
    country?: string;
    state?: string;
    localGovernmentArea?: string;
    trustCommunities?: string;
    // botDetails: IBotDetails[];
    botDetailsOneFirstName?: string;
    botDetailsOneLastName?: string;
    botDetailsOneEmail?: string;
    botDetailsOnePhoneNumber?: string;
    botDetailsTwoFirstName?: string;
    botDetailsTwoLastName?: string;
    botDetailsTwoEmail?: string;
    botDetailsTwoPhoneNumber?: string;

    totalMaleBotMembers?: number;
    totalFemaleBotMembers?: number;
    totalPwdBotMembers?: number;
    totalMaleAdvisoryCommitteeMembers?: number;
    totalFemaleAdvisoryCommitteeMembers?: number;
    totalPwdAdvisoryCommitteeMembers?: number;
    totalMaleManagementCommitteeMembers?: number;
    totalFemaleManagementCommitteeMembers?: number;
    totalPwdManagementCommitteeMembers?: number;
    createAt?: string;
}

interface IBotDetails {
    botDetailsId: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    trustId?: string | null;
}
export interface IBotDetailsInsert {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    trustId: string;
}
export interface ITrustView {
    trustId: string;
    trustName: string;
    settlor: string;
    nameOfOmls: string;
    userId: string;
    userFirstName: string;
    userLastName: string;
    country: string;
    state: string;
    localGovernmentArea: string;
    trustCommunities: string;
    botDetailsOneFirstName: string;
    botDetailsOneLastName: string;
    botDetailsOneEmail: string;
    botDetailsOnePhoneNumber: string;
    botDetailsTwoFirstName: string;
    botDetailsTwoLastName: string;
    botDetailsTwoEmail: string;
    botDetailsTwoPhoneNumber: string;

    totalMaleBotMembers: number;
    totalFemaleBotMembers: number;
    totalPwdBotMembers: number;
    totalMaleAdvisoryCommitteeMembers: number;
    totalFemaleAdvisoryCommitteeMembers: number;
    totalPwdAdvisoryCommitteeMembers: number;
    totalMaleManagementCommitteeMembers: number;
    totalFemaleManagementCommitteeMembers: number;
    totalPwdManagementCommitteeMembers: number;
    createAt: string;
}

export interface ITrustEstablishmentStatus {
    trustEstablishmentStatusId: string;
    trustRegisteredWithCAC?: number | null;
    cscDocument?: string | null;
    cscDocumentMimeType?: string | null;
    yearIncorporated?: number | null;
    botConstitutedAndInaugurated?: number | null;
    managementCommitteeConstitutedAndInaugurated?: number | null;
    advisoryCommitteeConstitutedAndInaugurated?: number | null;
    isTrustDevelopmentPlanReadilyAvailable?: number | null;
    isTrustDevelopmentPlanBudgetReadilyAvailable?: number | null;
    yearDeveloped?: number | null;
    yearExpired?: number | null;
    developmentPlanDocument?: string | null;
    developmentPlanDocumentMimeType?: string | null;
    developmentPlanBudgetDocument?: string | null;
    developmentPlanBudgetDocumentMimeType?: string | null;
    yearOfFundsReceivedByTrust?: number | null;
    totalFundsReceivedByTrust?: number | null;
    capitalExpenditure?: number | null;
    reserve?: number | null;
    admin?: string | null;
    yearOfNeedsAssessment?: number | null;
    statusOfNeedAssessment?: number | null;
    communityWomenConsulted?: number | null;
    pwDsConsulted?: number | null;
    communityYouthsConsulted?: number | null;
    communityLeadershipConsulted?: number | null;
    attendanceSheet?: number | null;
    distributionMatrixDevelopedBySettlor?: boolean | null;
    trustDistributionMatrixDocument?: string | null;
    trustDistributionMatrixDocumentMimeType?: string | null;
    settlorOperationalExpenditures?: IOperationalExpenditure[];
    trustId?: string;
    completionStatus: number | null;
    createAt?: Date | null;
    updateAt?: Date | null;
}

export interface IOperationalExpenditure {
    OperationalExpenditureId: string;
    settlorOperationalExpenditureYear?: number | null;
    settlorOperationalExpenditure?: number | null;
    trustEstablishmentStatusId?: string | null;
}
export interface IOperationalExpenditureInsert {
    settlorOperationalExpenditureYear?: number | null;
    settlorOperationalExpenditure?: number | null;
    trustEstablishmentStatusId?: string | null;
}