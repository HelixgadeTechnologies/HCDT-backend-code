export interface IConflict {
    conflictId: string;
    projectId?: string | null;
    userId?: string | null;
    causeOfConflictId?: number | null;
    partiesInvolveId?: number | null;
    narrateIssues?: string | null;
    conflictStatusId?: number | null;
    issuesAddressById?: number | null;
    courtLitigationStatusId?: number | null;
    createAt?: Date | null;
    updateAt?: Date | null;
}

export interface IConflictView {
    conflictId: string;
    projectId?: string | null;
    projectTitle?: string | null;
    userId?: string | null;
    userFirstName?: string | null;
    userLastName?: string | null;
    userEmail?: string | null;
    userPhoneNumber?: string | null;
    causeOfConflictId?: number | null;
    causeOfConflictName?: string | null;
    partiesInvolveId?: number | null;
    partiesInvolveName?: string | null;
    narrateIssues?: string | null;
    conflictStatusId?: number | null;
    conflictStatusName?: string | null;
    issuesAddressById?: number | null;
    issuesAddressByName?: string | null;
    courtLitigationStatusId?: number | null;
    courtLitigationStatusName?: string | null;
    createAt?: Date | null;
    updateAt?: Date | null;
    trustId?: string | null;
    projectCreateAt: Date | null;
}

export interface ICauseOfConflict {
    causeOfConflictId: number;
    causeOfConflict?: string | null;
}

export interface IPartiesInvolve {
    partiesInvolveId: number;
    partiesInvolve?: string | null;
}

export interface IConflictStatus {
    conflictStatusId: number;
    conflictStatus?: string | null;
}

export interface IIssuesAddressBy {
    issuesAddressById: number;
    issuesAddressBy?: string | null;
}

export interface ICourtLitigationStatus {
    courtLitigationStatusId: number;
    courtLitigationStatus?: string | null;
}

