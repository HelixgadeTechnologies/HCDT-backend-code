export interface IProject {
    projectId: string;
    projectTitle?: string;
    projectCategoryId?: number | null;
    totalBudget?: number | null;
    community?: string | null;
    awardDate?: Date | null;
    nameOfContractor?: string | null;
    annualApprovedBudget?: string | null;
    projectStatus?: number | null;
    qualityRatingId?: number | null;
    projectVideo?: string | null; // Assuming Prisma stores Bytes as Buffer
    projectVideoMimeType?: string | null;
    numberOfMaleEmployedByContractor?: number | null;
    numberOfFemaleEmployedByContractor?: number | null;
    numberOfPwDsEmployedByContractor?: number | null;
    typeOfWork?: string | null;
    numberOfHostCommunityMemberContracted?: number | null;
    numberOfMaleBenefited?: number | null;
    numberOfFemaleBenefited?: number | null;
    numberOfPwDsBenefited?: number | null;
    trustId?: string | null;
    createAt?: Date | null;
    updateAt?: Date | null;
}


export interface IProjectView {
    projectId: string;
    projectTitle?: string | null;
    projectCategory?: string | null;
    totalBudget?: number | null;
    community?: string | null;
    awardDate?: Date | null;
    nameOfContractor?: string | null;
    annualApprovedBudget?: string | null;
    projectStatus?: number | null;
    projectStatusName?: string | null;
    qualityRatingId?: number | null;
    qualityRatingName?: string | null;
    projectVideo?:string | null;
    projectVideoMimeType?: string | null;
    numberOfMaleEmployedByContractor?: number | null;
    numberOfFemaleEmployedByContractor?: number | null;
    numberOfPwDsEmployedByContractor?: number | null;
    typeOfWork?: string | null;
    numberOfHostCommunityMemberContracted?: number | null;
    numberOfMaleBenefited?: number | null;
    numberOfFemaleBenefited?: number | null;
    numberOfPwDsBenefited?: number | null;
    trustId?: string | null;
    createAt?: Date | null;
    updateAt?: Date | null;
}
export interface IProjectClient {
    projectId: string;
    projectTitle?: string | null;
    projectCategory?: string | null;
    totalBudget?: number | null;
    community?: string | null;
    awardDate?: Date | null;
    nameOfContractor?: string | null;
    annualApprovedBudget?: string | null;
    projectStatus?: number | null;
    projectStatusName?: string | null;
    qualityRatingId?: number | null;
    qualityRatingName?: string | null;
    projectVideo?: string | null;
    projectVideoMimeType?: string | null;
    numberOfMaleEmployedByContractor?: number | null;
    numberOfFemaleEmployedByContractor?: number | null;
    numberOfPwDsEmployedByContractor?: number | null;
    typeOfWork?: string | null;
    numberOfHostCommunityMemberContracted?: number | null;
    numberOfMaleBenefited?: number | null;
    numberOfFemaleBenefited?: number | null;
    numberOfPwDsBenefited?: number | null;
    trustId?: string | null;
    createAt?: Date | null;
    updateAt?: Date | null;
}

export interface IProjectCategory {
    projectCategoryId: number;
    categoryName?: string | null;
}

export interface IQualityRating {
    qualityRatingId: number;
    qualityRating?: string | null;
}

export interface IStatusReport {
    statusReportId: number;
    statusReport?: string | null;
}

export interface ITypeOfWork {
    typeOfWorkId: number;
    typeOfWork?: string | null;
}