export interface IAverageCommunitySatisfaction {
    averageCommunitySatisfactionId: string;
    infoProjects?: number | null;
    communityConsult?: number | null;
    localParticipation?: number | null;
    reportMechanism?: number | null;
    conflictMinimization?: number | null;
    settlorAction?: number | null,
    nuprcAction?: number | null,
    projectHandover?: number | null;
    maintenanceConsult?: number | null;
    incomeProject?: number | null;
    trustId?: string | null;
    createAt?: string | null;
}

export interface IAverageCommunitySatisfactionView {
    averageCommunitySatisfactionId: string;
    infoProjects?: number | null;
    communityConsult?: number | null;
    localParticipation?: number | null;
    reportMechanism?: number | null;
    conflictMinimization?: number | null;
    settlorAction?: number | null,
    nuprcAction?: number | null,

    infoProjectsStatus?: string | null;
    communityConsultStatus?: string | null;
    localParticipationStatus?: string | null;
    reportMechanismStatus?: string | null;
    conflictMinimizationStatus?: string | null;
    settlorActionStatus?: number | null,
    nuprcActionStatus?: number | null,

    projectHandover?: number | null;
    maintenanceConsult?: number | null;
    incomeProject?: number | null;

    projectHandoverStatus?: string | null;
    maintenanceConsultStatus?: string | null;
    incomeProjectStatus?: string | null;
    trustId?: string | null;
    trustName?: string | null;
    createAt?: string | null;
}

export interface IAcsOptionOne {
    acsOptionOneId: number;
    acsOptionOne: string;
}

export interface IAcsOptionTwo {
    acsOptionTwoId: number;
    acsOptionTwo: string;
}