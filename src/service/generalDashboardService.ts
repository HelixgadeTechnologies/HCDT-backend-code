import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// function normalizeBigInts<T>(data: T): T {
//     if (Array.isArray(data)) {
//         return data.map(normalizeBigInts) as any;
//     } else if (typeof data === 'object' && data !== null) {
//         if (data instanceof Date) {
//             return data;
//         }

//         const normalized: any = {};
//         for (const key in data) {
//             const value = (data as any)[key];

//             if (typeof value === 'bigint') {
//                 normalized[key] = Number(value);
//             } else if (typeof value === 'string') {
//                 normalized[key] = value; // ✅ preserve strings like URLs
//             } else {
//                 normalized[key] = normalizeBigInts(value);
//             }
//         }
//         return normalized;
//     }

//     return data;
// }
// function normalizeBigInts<T>(data: T): T {
//     if (Array.isArray(data)) {
//         return data.map(normalizeBigInts) as any;
//     } else if (typeof data === 'object' && data !== null) {
//         if (data instanceof Date) {
//             return data; // ✅ Leave Date objects untouched
//         }

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
    }

    if (typeof data === 'object' && data !== null) {
        if (data instanceof Date) {
            return data;
        }

        const normalized: any = {};
        for (const key in data) {
            const value = (data as any)[key];

            if (typeof value === 'bigint') {
                normalized[key] = Number(value);
            } else if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                normalized[key] = value;
            } else {
                normalized[key] = normalizeBigInts(value);
            }
        }
        return normalized;
    }

    return data;
}

async function callProcedure(option: number): Promise<void | any[]> {
    const raws = await prisma.$queryRawUnsafe<any[]>(
        `CALL GetGeneralDashboard(?)`,
        option
    );
    // console.log(raw[0].f4)
    // console.log(raws)

    const cleaned = normalizeBigInts(raws);
    if (option == 1) {
        return cleaned.map((row: any) => ({
            ["percentFullyEstablished"]: Number(row.f0),
        }));
    } else if (option == 2) {
        return cleaned.map((row: any) => ({
            ["totalCompleteTrust"]: Number(row.f0),
            ["percentFullyEstablished"]: Number(row.f1),
            ["totalTrust"]: Number(row.f2),
        }));
    } else if (option == 3) {
        return cleaned.map((row: any) => ({
            ["state"]: row.f0,
            ["community_count"]: Number(row.f1),
        }));
    } else if (option == 4) {
        return cleaned.map((row: any) => ({
            ["community_count"]: Number(row.f0)
        }));
    } else if (option == 5) {
        return cleaned.map((row: any) => ({
            ["totalExpenditure"]: Number(row.f0)
        }));
    } else if (option == 6) {
        return cleaned.map((row: any) => ({
            ["qualityRating"]: row.f0,
            ["ratingCount"]: Number(row.f1),
            ["percentage"]: Number(row.f2),
            ["color"]: row.f3,
        }));
    } else if (option == 7) {
        return cleaned.map((row: any) => ({
            ["monthName"]: row.f0,
            ["totalCompleted"]: Number(row.f1),
        }));
    } else if (option == 8) {
        return cleaned.map((row: any) => ({
            ["trustName"]: row.f0,
            ["projectTitle"]: row.f1,
            ["community"]: row.f2,
            ["completeAt"]: row.f3,
            ["rating"]: Number(row.f4),
        }));
    } else if (option == 9) {
        return cleaned.map((row: any) => ({
            ["month"]: Number(row.f0),
            ["inCourt"]: Number(row.f1),
            ["notInCourt"]: Number(row.f2),
        }));
    } else if (option == 10) {
        return cleaned.map((row: any) => ({
            ["resolvedPercentage"]: Number(row.f0),
            ["unresolvedPercentage"]: Number(row.f1),
        }));
    } else if (option == 11) {
        return cleaned.map((row: any) => ({
            ["causeOfConflictName"]: row.f0,
            ["partiesInvolveName"]: row.f1,
            ["community"]: row.f2,
            ["conflictStatusName"]: row.f3,
        }));
    } else if (option == 12) {
        return cleaned.map((row: any) => ({
            ["projectTitle"]: row.f0,
            ["community"]: row.f1,
            ["totalEmployed"]: Number(row.f2),
        }));
    } else if (option == 13) {
        return cleaned.map((row: any) => ({
            ["projectTitle"]: row.f0,
            ["numberOfMaleEmployedByContractor"]: Number(row.f1),
            ["numberOfFemaleEmployedByContractor"]: Number(row.f2),
            ["numberOfPwDsEmployedByContractor"]: Number(row.f3),
        }));
    } else if (option == 14) {
        return cleaned.map((row: any) => ({
            ["fully_received_percentage"]: Number(row.f0),
        }));
    } else if (option == 15) {
        return cleaned.map((row: any) => ({
            ["total_complete"]: Number(row.f0),
        }));
    } else if (option == 16) {
        return cleaned.map((row: any) => ({
            ["distinct_community_count"]: Number(row.f0),
        }));
    } else if (option == 17) {
        return cleaned.map((row: any) => ({
            ["totalMaleBotMembers"]: Number(row.f0),
            ["totalFemaleBotMembers"]: Number(row.f1),
            ["totalPwdBotMembers"]: Number(row.f2),

            ["totalMaleAdvisoryCommitteeMembers"]: Number(row.f3),
            ["totalFemaleAdvisoryCommitteeMembers"]: Number(row.f4),
            ["totalPwdAdvisoryCommitteeMembers"]: Number(row.f5),

            ["totalMaleManagementCommitteeMembers"]: Number(row.f6),
            ["totalFemaleManagementCommitteeMembers"]: Number(row.f7),
            ["totalPwdManagementCommitteeMembers"]: Number(row.f8),
        }));
    } else if (option == 18) {
        return cleaned.map((row: any) => ({
            ["partiesInvolveId"]: Number(row.f0),
            ["partyName"]: row.f1,
            ["percentage"]: Number(row.f2),
        }));
    } else if (option == 19) {
        return cleaned.map((row: any) => ({
            ["botYesPercentage"]: Number(row.f0),
            ["managementYesPercentage"]: row.f1,
            ["advisoryYesPercentage"]: Number(row.f2),
        }));
    } else {
        return []
    }
}
export async function getGeneralDashboardData() {
    // const result = await callProcedure(2);
    const keys = [
        'FIELDS_COMPLETION',
        'COMPLETION_STATUS',
        'COMMUNITY_BENEFIT',
        'STATISTICS',
        'OPERATIONAL_EXPENDITURE',
        'QUALITY_RATINGS',
        'COMPLETION_OVER_MONTH',
        'PROJECT_DETAILS',
        'CONFLICT_RESOLUTION_OVER_TIME',
        'CONFLICT_RESOLUTION_PERCENTAGE',
        'CONFLICT_RESOLUTION_DETAILS',
        'TOTAL_WORKER_IN_PROJECT',
        'EMPLOYEE_PER_PROJECT',
        'STATISTICS_PERCENTAGE',
        'DISTRIBUTION_MATRIX',
        'NEEDS_ASSESSMENT_COMMUNITY_COUNT',
        'BOT_DISPLAY',
        'CONFLICT_RESOLUTION_OVER',
        'BOT_INAUGURATION_CHECK',
    ];

    const finalResult: Record<string, any> = {};

    for (let index = 0; index < keys.length; index++) {
        const result = await callProcedure(index + 1);
        finalResult[keys[index]] = result;
    }
    // console.log("result", finalResult)
    return finalResult;
}