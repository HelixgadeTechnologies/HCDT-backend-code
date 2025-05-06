import { PrismaClient } from "@prisma/client";
import { ICauseOfConflict, IConflict, IConflictStatus, IConflictView, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../interface/conflictInterface";


const prisma = new PrismaClient();

export const createOrUpdateConflict = async (conflictData: IConflict, isCreate: boolean,userId:string) => {

    if (isCreate) {
        // Create a new conflict
        return await prisma.conflict.create({
            data: { ...conflictData, conflictId: undefined,userId:userId },
        });
    } else {
        // Update existing conflict
        if (!conflictData.conflictId) {
            throw new Error("Conflict ID is required for updating a record.");
        }
        // console.log(conflictData)
        return await prisma.conflict.update({
            where: { conflictId: conflictData.conflictId,userId:userId },
            data: conflictData,
        });
    }
};

export const getAllConflicts = async (): Promise<IConflictView[]> => {
    try {
        const conflicts = await prisma.$queryRaw<IConflictView[]>`
            SELECT * FROM conflict_view
        `;
        return conflicts;
    } catch (error) {
        throw new Error("Failed to retrieve conflicts");
    }
};

export const getConflictById = async (conflictId: string): Promise<IConflictView | null> => {
    try {
        const conflict = await prisma.$queryRaw<IConflictView[]>`
            SELECT * FROM conflict_view WHERE conflictId = ${conflictId}
        `;

        return conflict.length > 0 ? conflict[0] : null;
    } catch (error) {
        throw new Error("Failed to retrieve conflict");
    }
};
export const getConflictByTrustId = async (trustId: string): Promise<Array<IConflictView>> => {
    try {
        const conflict = await prisma.$queryRaw<IConflictView[]>`
            SELECT * FROM conflict_view WHERE trustId = ${trustId}
        `;

        return conflict;
    } catch (error) {
        throw new Error("Failed to retrieve conflict");
    }
};

export const getCauseOfConflict = async (): Promise<ICauseOfConflict[]> => {
    try {
        const causeOfConflicts = await prisma.causeOfConflict.findMany();
        return causeOfConflicts
    } catch (error) {
        throw new Error(`Error fetching conflict-related data: ${error}`);
    }
}
export const getPartiesInvolve = async (): Promise<IPartiesInvolve[]> => {
    try {
        const partiesInvolves = await prisma.partiesInvolve.findMany();
        return partiesInvolves
    } catch (error) {
        throw new Error(`Error fetching conflict-related data: ${error}`);
    }
}
export const getConflictStatuses = async (): Promise<IConflictStatus[]> => {
    try {
        const conflictStatuses = await prisma.conflictStatus.findMany();
        return conflictStatuses
    } catch (error) {
        throw new Error(`Error fetching conflict-related data: ${error}`);
    }
}
export const getIssuesAddressedBy = async (): Promise<IIssuesAddressBy[]> => {
    try {
        const issuesAddressedBy = await prisma.issuesAddressBy.findMany();
        return issuesAddressedBy
    } catch (error) {
        throw new Error(`Error fetching conflict-related data: ${error}`);
    }
}
export const getCourtLitigationStatuses = async (): Promise<ICourtLitigationStatus[]> => {
    try {
        const courtLitigationStatuses = await prisma.courtLitigationStatus.findMany();
        return courtLitigationStatuses
    } catch (error) {
        throw new Error(`Error fetching conflict-related data: ${error}`);
    }
};

// function normalizeBigInts<T>(data: T): T {
//     if (Array.isArray(data)) {
//         return data.map(normalizeBigInts) as any;
//     } else if (typeof data === 'object' && data !== null) {
//         const normalized: any = {};
//         for (const key in data) {
//             const value = (data as any)[key];
//             normalized[key] =
//                 typeof value === 'bigint' ? Number(value) : normalizeBigInts(value);
//         }
//         return normalized;
//     }
//     return data;
// }


function normalizeBigInts<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map(normalizeBigInts) as any;
    } else if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data; // ✅ Leave Date objects untouched
        }

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
async function callProcedure(option: number, trustId: string): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL ConflictDashboard(?,?)`,
        option,
        trustId
    );


    const cleaned = normalizeBigInts(raw);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["All_CONFLICT"]: row.f0,
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["RESOLVED_CONFLICT"]: row.f0,
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["PENDING_CONFLICT"]: row.f0,
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["CONFLICT_IN_COURT"]: row.f0,
        }));
    } else if (option == 5) {
        return cleaned.map((row: any) => ({
            ["THE_ISSUE_HAS_BEEN_EFFECTIVELY_ADDRESSED"]: row.f1,
            ["THE_ISSUE_IS_NOT_EFFECTIVELY_ADDRESSED"]: row.f2,
            ["THE_ISSUE_IS_CURRENTLY_BEING_ADDRESSED"]: row.f3,
            ["THE_ISSUE_IS_YET_TO_BE_ADDRESSED"]: row.f4,
            ["VALUE_TYPE"]: "Percentage"
        }));
    } else if (option == 6) {
        return cleaned.map((row: any) => ({
            ["THE_LITIGATION_IS_ONGOING"]: row.f1,
            ["THE_LITIGATION_HAS_BEEN_WITHDRAWN"]: row.f2,
            ["THERE_IS_A_COURT_JUDGEMENT"]: row.f3,
            ["VALUE_TYPE"]: "Percentage"
        }));
    } else if (option == 7) {
        return cleaned.map((row: any) => ({
            ["MONTH"]: row.f0,
            ["REPORT_COUNT"]: row.f1,
            ["VALUE_TYPE"]: "TOTAL",
        }));
    } else if (option == 8) {
        return cleaned.map((row: any) => ({
            ["LAND_BORDER"]: row.f1,
            ["CONSTITUTION_OF_BOT"]: row.f2,
            ["CONSTITUTION_OF_MANAGEMENT_COMMITTEE"]: row.f3,
            ["CONSTITUTION_OF_ADVISORY_COMMITTEE"]: row.f4,
            ["PIPELINE_VANDALISM_AND_OIL_SPILL"]: row.f5,
            ["DISTRIBUTION_MATRIX"]: row.f6,
            ["LATE_RECEIVE_OF_TRUST_FUND"]: row.f7,
            ["CONTRACTING_AND_PROJECT_DELIVERY"]: row.f8,
            ["VALUE_TYPE"]: "TOTAL"
        }));
    } else if (option == 9) {
        return cleaned.map((row: any) => ({
            conflictId: row.f0,
            projectId: row.f1,
            projectTitle: row.f2,
            userId:row.f3,
            userFirstName:row.f4,
            userLastName: row.f5,
            userEmail: row.f6,
            userPhoneNumber: row.f7,
            causeOfConflictId: row.f8,
            causeOfConflictName: row.f9,
            partiesInvolveId: row.f10,
            partiesInvolveName: row.f11,
            narrateIssues: row.f12,
            conflictStatusId: row.f13,
            conflictStatusName: row.f14,
            issuesAddressById:row.f15,
            issuesAddressByName:row.f16,
            courtLitigationStatusId: row.f17,
            courtLitigationStatusName: row.f18,
            createAt:row.f19,
            updateAt: row.f20,
            trustId: row.f21,
            projectCreateAt:row.f22
        }))
    } else if (option == 10) {
        return cleaned.map((row: any) => (
        {
            conflictId: row.f0,
            projectId: row.f1,
            projectTitle: row.f2,
            userId:row.f3,
            userFirstName:row.f4,
            userLastName: row.f5,
            userEmail: row.f6,
            userPhoneNumber: row.f7,
            causeOfConflictId: row.f8,
            causeOfConflictName: row.f9,
            partiesInvolveId: row.f10,
            partiesInvolveName: row.f11,
            narrateIssues: row.f12,
            conflictStatusId: row.f13,
            conflictStatusName: row.f14,
            issuesAddressById:row.f15,
            issuesAddressByName:row.f16,
            courtLitigationStatusId: row.f17,
            courtLitigationStatusName: row.f18,
            createAt:row.f19,
            updateAt: row.f20,
            projectCreateAt:row.f21
        }
    ))
    } else {
        return []
    }
}

export async function getConflictDashboardData(projectId: string) {
    // Optionally return them as a keyed object
    const keys = [
        'ALL_CONFLICT_REPORT',
        'RESOLVED_CONFLICT',
        'PENDING_CONFLICT',
        'CONFLICTS_IN_COURT',
        'STATUS_OF_CONFLICT',
        'CONFLICT_OF_COURT_LITIGATION',
        'REPORT_FREQUENCY',
        'CAUSE_OF_CONFLICT',
        'RESOLVED_CONFLICTS',
        'UNRESOLVED_CONFLICTS'
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(index + 1, projectId);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}
