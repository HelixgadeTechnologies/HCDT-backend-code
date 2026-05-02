import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function getDashboardSummaryStats() {
    try {
        const rawData = await prisma.$queryRawUnsafe<any[]>(
            `CALL GetDashboardSummaryStats()`
        );

        const cleaned = normalizeBigInts(rawData);
        
        // Since the procedure returns a single row of stats
        return cleaned[0] || {
            trustCacCount: 0,
            trustFundsCount: 0,
            totalConflicts: 0,
            resolvedConflicts: 0,
            grandTotalEmployment: 0,
            totalHostCommunityContracted: 0
        };
    } catch (error) {
        console.error("Error fetching dashboard summary stats:", error);
        throw error;
    }
}
