import { PrismaClient } from "@prisma/client";
import { ICauseOfConflict, IConflict, IConflictStatus, IConflictView, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../interface/conflictInterface";
import { sendConflictReportEmail } from "../utils/mail";
import { getAllAdminByTrustId, getAllDRAByTrustId, getAllNUPRC } from "./authService";


const prisma = new PrismaClient();

export const getEmailsFronDraAndNUPRC = async (trustId: string): Promise<string[]> => {
    const dra = await getAllDRAByTrustId(trustId);
    const nuprc = await getAllNUPRC();

    const emails = [...dra, ...nuprc]
        .map(user => user.email)
        .filter(email => typeof email === 'string' && email.trim() !== '');

    // Remove duplicates
    return [...new Set(emails)] as string[];
};
export const getEmailsFromDraAndAdmin = async (trustId: string): Promise<string[]> => {
    const dra = await getAllDRAByTrustId(trustId);
    const admin = await getAllAdminByTrustId(trustId);

    const emails = [...dra, ...admin]
        .map(user => user.email)
        .filter(email => typeof email === 'string' && email.trim() !== '');

    // Remove duplicates
    return [...new Set(emails)] as string[];
};

export const createOrUpdateConflict = async (conflictData: IConflict, isCreate: boolean, userId: string) => {
    try {
        // Ensure conflictData is not null or undefined
        const emails = await getEmailsFronDraAndNUPRC(conflictData.trustId as string);
        if (isCreate) {
            await sendConflictReportEmail(emails, "Conflict");
            // Create a new conflict
            return await prisma.conflict.create({
                data: { ...conflictData, conflictId: undefined, userId: userId },
            });
        } else {
            // Update existing conflict
            if (!conflictData.conflictId) {
                throw new Error("Conflict ID is required for updating a record.");
            }
            // console.log(conflictData)
            return await prisma.conflict.update({
                where: { conflictId: conflictData.conflictId, userId: userId },
                data: conflictData,
            });
            
        } 
    } catch (error) {
        throw new Error(`Error creating or updating conflict: ${error}`);
        
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
async function callProcedure(option: number, trustId: string, selectedYear: number, selectedState: string, settlor: string): Promise<any[]> {
    const raw = await prisma.$queryRawUnsafe<any[]>(
        `CALL ConflictDashboard(?,?,?,?,?)`,
        option,
        trustId,
        selectedYear,
        selectedState,
        settlor
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
            userId: row.f1,
            userFirstName: row.f2,
            userLastName: row.f3,
            userEmail: row.f4,
            userPhoneNumber: row.f5,
            causeOfConflictId: row.f6,
            causeOfConflictName: row.f7,
            partiesInvolveId: row.f8,
            partiesInvolveName: row.f9,
            narrateIssues: row.f10,
            conflictStatusId: row.f11,
            conflictStatusName: row.f12,
            issuesAddressById: row.f13,
            issuesAddressByName: row.f14,
            courtLitigationStatusId: row.f15,
            courtLitigationStatusName: row.f16,
            createAt: row.f17,
            updateAt: row.f28,
            trustId: row.f19,
            community: row.f20,
            stateFromTrust: row.f21,
            createAtFromTrust: row.f22,
            settlor: row.f23,
            trustName: row.f24
        }))
    } else if (option == 10) {
        return cleaned.map((row: any) => (
            {
                conflictId: row.f0,
                userId: row.f1,
                userFirstName: row.f2,
                userLastName: row.f3,
                userEmail: row.f4,
                userPhoneNumber: row.f5,
                causeOfConflictId: row.f6,
                causeOfConflictName: row.f7,
                partiesInvolveId: row.f8,
                partiesInvolveName: row.f9,
                narrateIssues: row.f10,
                conflictStatusId: row.f11,
                conflictStatusName: row.f12,
                issuesAddressById: row.f13,
                issuesAddressByName: row.f14,
                courtLitigationStatusId: row.f15,
                courtLitigationStatusName: row.f16,
                createAt: row.f17,
                updateAt: row.f28,
                trustId: row.f19,
                community: row.f20,
                stateFromTrust: row.f21,
                createAtFromTrust: row.f22,
                settlor: row.f23,
                trustName: row.f24
            }
        ))
    } else {
        return []
    }
}

export async function getConflictDashboardData(projectId: string, selectedYear: number, selectedState: string, settlor: string) {
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
        const result = await callProcedure(index + 1, projectId, selectedYear, selectedState, settlor);
        finalResult[keys[index]] = result;
    }

    return finalResult;
}
