import { PrismaClient } from "@prisma/client";
import { ICauseOfConflict, IConflict, IConflictStatus, IConflictView, ICourtLitigationStatus, IIssuesAddressBy, IPartiesInvolve } from "../interface/conflictInterface";


const prisma = new PrismaClient();

export const createOrUpdateConflict = async (conflictData: IConflict, isCreate: boolean) => {

    if (isCreate) {
        // Create a new conflict
        return await prisma.conflict.create({
            data: { ...conflictData, conflictId: undefined },
        });
    } else {
        // Update existing conflict
        if (!conflictData.conflictId) {
            throw new Error("Conflict ID is required for updating a record.");
        }
        console.log(conflictData)
        return await prisma.conflict.update({
            where: { conflictId: conflictData.conflictId },
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