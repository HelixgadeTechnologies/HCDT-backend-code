export interface IEconomicImpact {
    economicImpactId: string;
    businessGrowth?: number | null;
    incomeIncrease?: number | null;
    livelihoodImprove?: number | null;
    accessAmenities?: number | null;
    trustId?: string | null;
}

export interface IEconomicImpactView {
    economicImpactId: string;
    businessGrowth?: number | null;
    incomeIncrease?: number | null;
    livelihoodImprove?: number | null;
    businessGrowthStatus?: string | null;
    incomeIncreaseStatus?: string | null;
    livelihoodImproveStatus?: string | null;
    accessAmenities?: number | null;
    accessAmenitiesStatus?: string | null;
    trustId?: string | null;
    trustName?: string | null;
    createAt?: string | null;

}

export interface IImpactOptionOne {
    impactOptionOneId: number;
    impactOptionOne: string;
}

export interface IImpactOptionTwo {
    impactOptionTwoId: number;
    impactOptionTwo: string;
}