"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrustEstablishment = exports.addTrustEstablishmentStatus = exports.removeTrust = exports.getTrust = exports.getAllTrust = exports.createOrUpdateTrust = void 0;
const client_1 = require("@prisma/client");
const hexBufaBufaHex_1 = require("../utils/hexBufaBufaHex");
const prisma = new client_1.PrismaClient();
const createOrUpdateTrust = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    // Prepare trust data
    const trustData = {
        trustName: data.trustName,
        nameOfOmls: data.nameOfOmls || null,
        country: data.country || null,
        state: data.state || null,
        localGovernmentArea: data.localGovernmentArea || null,
        trustCommunities: data.trustCommunities || null,
        totalMaleBotMembers: data.totalMaleBotMembers || null,
        totalFemaleBotMembers: data.totalFemaleBotMembers || null,
        totalPwdBotMembers: data.totalPwdBotMembers || null,
        totalMaleAdvisoryCommitteeMembers: data.totalMaleAdvisoryCommitteeMembers || null,
        totalFemaleAdvisoryCommitteeMembers: data.totalFemaleAdvisoryCommitteeMembers || null,
        totalPwdAdvisoryCommitteeMembers: data.totalPwdAdvisoryCommitteeMembers || null,
        totalMaleManagementCommitteeMembers: data.totalMaleManagementCommitteeMembers || null,
        totalFemaleManagementCommitteeMembers: data.totalFemaleManagementCommitteeMembers || null,
        totalPwdManagementCommitteeMembers: data.totalPwdManagementCommitteeMembers || null,
    };
    // Handle the foreign key for `settlorId`
    if (data.settlorId && data.userId) {
        trustData["settlor"] = { connect: { settlorId: data.settlorId } };
        trustData["user"] = { connect: { userId: data.userId } };
    }
    let trust;
    if (isCreate) {
        // Use upsert to avoid redundant findUnique()
        trust = yield prisma.trust.upsert({
            where: { trustName: data.trustName },
            update: {},
            create: trustData,
        });
    }
    else {
        trust = yield prisma.trust.update({
            where: { trustId: data.trustId },
            data: trustData,
        });
    }
    // Handle botDetails efficiently
    if (data.botDetails.length > 0) {
        const botDetails = data.botDetails.map((botDetail) => ({
            firstName: botDetail.firstName,
            lastName: botDetail.lastName,
            email: botDetail.email,
            phoneNumber: botDetail.phoneNumber,
            trustId: trust.trustId,
        }));
        yield prisma.$transaction([
            prisma.botDetails.deleteMany({ where: { trustId: trust.trustId } }),
            prisma.botDetails.createMany({ data: botDetails, skipDuplicates: true }),
        ]);
    }
});
exports.createOrUpdateTrust = createOrUpdateTrust;
const getAllTrust = () => __awaiter(void 0, void 0, void 0, function* () {
    const trusts = yield prisma.$queryRaw `
      SELECT * FROM trust_view
    `;
    return trusts;
});
exports.getAllTrust = getAllTrust;
const getTrust = (trustId) => __awaiter(void 0, void 0, void 0, function* () {
    const trusts = yield prisma.$queryRaw `
        SELECT * FROM trust_view WHERE trustId = ${trustId}
    `;
    if (!trusts.length)
        return null; // Return null if trust is not found
    const trust = trusts[0];
    const botDetails = yield prisma.botDetails.findMany({
        where: { trustId: trust.trustId },
    });
    return Object.assign(Object.assign({}, trust), { botDetails: botDetails.length > 0 ? botDetails : [] });
});
exports.getTrust = getTrust;
const removeTrust = (trustId) => __awaiter(void 0, void 0, void 0, function* () {
    let trust = yield prisma.trust.delete({ where: { trustId } });
    return trust;
});
exports.removeTrust = removeTrust;
const addTrustEstablishmentStatus = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    const trustOperationalEstablishmentData = {
        trustId: (_a = data.trustId) !== null && _a !== void 0 ? _a : null,
        trustRegisteredWithCAC: (_b = data.trustRegisteredWithCAC) !== null && _b !== void 0 ? _b : null,
        cscDocument: data.cscDocument ? (0, hexBufaBufaHex_1.hexToBuffer)(data.cscDocument) : null,
        cscDocumentMimeType: (_c = data.cscDocumentMimeType) !== null && _c !== void 0 ? _c : null,
        yearIncorporated: (_d = data.yearIncorporated) !== null && _d !== void 0 ? _d : null,
        botConstitutedAndInaugurated: (_e = data.botConstitutedAndInaugurated) !== null && _e !== void 0 ? _e : null,
        managementCommitteeConstitutedAndInaugurated: (_f = data.managementCommitteeConstitutedAndInaugurated) !== null && _f !== void 0 ? _f : null,
        advisoryCommitteeConstitutedAndInaugurated: (_g = data.advisoryCommitteeConstitutedAndInaugurated) !== null && _g !== void 0 ? _g : null,
        isTrustDevelopmentPlanReadilyAvailable: (_h = data.isTrustDevelopmentPlanReadilyAvailable) !== null && _h !== void 0 ? _h : null,
        isTrustDevelopmentPlanBudgetReadilyAvailable: (_j = data.isTrustDevelopmentPlanBudgetReadilyAvailable) !== null && _j !== void 0 ? _j : null,
        yearDeveloped: (_k = data.yearDeveloped) !== null && _k !== void 0 ? _k : null,
        yearExpired: (_l = data.yearExpired) !== null && _l !== void 0 ? _l : null,
        developmentPlanDocument: data.developmentPlanDocument ? (0, hexBufaBufaHex_1.hexToBuffer)(data.developmentPlanDocument) : null,
        developmentPlanDocumentMimeType: (_m = data.developmentPlanDocumentMimeType) !== null && _m !== void 0 ? _m : null,
        developmentPlanBudgetDocument: data.developmentPlanBudgetDocument ? (0, hexBufaBufaHex_1.hexToBuffer)(data.developmentPlanBudgetDocument) : null,
        developmentPlanBudgetDocumentMimeType: (_o = data.developmentPlanBudgetDocumentMimeType) !== null && _o !== void 0 ? _o : null,
        yearOfFundsReceivedByTrust: (_p = data.yearOfFundsReceivedByTrust) !== null && _p !== void 0 ? _p : null,
        totalFundsReceivedByTrust: (_q = data.totalFundsReceivedByTrust) !== null && _q !== void 0 ? _q : null,
        capitalExpenditure: (_r = data.capitalExpenditure) !== null && _r !== void 0 ? _r : null,
        reserve: (_s = data.reserve) !== null && _s !== void 0 ? _s : null,
        admin: (_t = data.admin) !== null && _t !== void 0 ? _t : null,
        yearOfNeedsAssessment: (_u = data.yearOfNeedsAssessment) !== null && _u !== void 0 ? _u : null,
        statusOfNeedAssessment: (_v = data.statusOfNeedAssessment) !== null && _v !== void 0 ? _v : null,
        communityWomenConsulted: (_w = data.communityWomenConsulted) !== null && _w !== void 0 ? _w : null,
        pwDsConsulted: (_x = data.pwDsConsulted) !== null && _x !== void 0 ? _x : null,
        communityYouthsConsulted: (_y = data.communityYouthsConsulted) !== null && _y !== void 0 ? _y : null,
        communityLeadershipConsulted: (_z = data.communityLeadershipConsulted) !== null && _z !== void 0 ? _z : null,
        attendanceSheet: (_0 = data.attendanceSheet) !== null && _0 !== void 0 ? _0 : null,
        distributionMatrixDevelopedBySettlor: (_1 = data.distributionMatrixDevelopedBySettlor) !== null && _1 !== void 0 ? _1 : null,
        trustDistributionMatrixDocument: data.trustDistributionMatrixDocument ? (0, hexBufaBufaHex_1.hexToBuffer)(data.trustDistributionMatrixDocument) : null,
        trustDistributionMatrixDocumentMimeType: (_2 = data.trustDistributionMatrixDocumentMimeType) !== null && _2 !== void 0 ? _2 : null,
    };
    let trustEstablishmentStatus;
    // Use upsert to avoid redundant findUnique()
    trustEstablishmentStatus = yield prisma.trustEstablishmentStatus.upsert({
        where: { trustId: data.trustId },
        update: trustOperationalEstablishmentData,
        create: trustOperationalEstablishmentData,
    });
    //  Handle settlorOperationalExpenditures efficiently
    if (data.settlorOperationalExpenditures.length > 0) {
        const operationalExpenditureInsert = data.settlorOperationalExpenditures.map((ope) => ({
            settlorOperationalExpenditureYear: ope.settlorOperationalExpenditureYear,
            settlorOperationalExpenditure: ope.settlorOperationalExpenditure,
            trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId,
        }));
        yield prisma.$transaction([
            prisma.operationalExpenditure.deleteMany({ where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId } }),
            prisma.operationalExpenditure.createMany({ data: operationalExpenditureInsert, skipDuplicates: true }),
        ]);
    }
});
exports.addTrustEstablishmentStatus = addTrustEstablishmentStatus;
const getTrustEstablishment = (trustId) => __awaiter(void 0, void 0, void 0, function* () {
    const trustEstablishmentStatus = yield prisma.trustEstablishmentStatus.findUnique({
        where: { trustId }
    });
    if (!trustEstablishmentStatus)
        return null;
    const settlorOperationalExpenditures = yield prisma.operationalExpenditure.findMany({
        where: { trustEstablishmentStatusId: trustEstablishmentStatus.trustEstablishmentStatusId },
    });
    return Object.assign(Object.assign({}, trustEstablishmentStatus), { cscDocument: trustEstablishmentStatus.cscDocument
            ? (0, hexBufaBufaHex_1.bufferToHex)(Buffer.from(trustEstablishmentStatus.cscDocument))
            : null, developmentPlanDocument: trustEstablishmentStatus.developmentPlanDocument
            ? (0, hexBufaBufaHex_1.bufferToHex)(Buffer.from(trustEstablishmentStatus.developmentPlanDocument))
            : null, developmentPlanBudgetDocument: trustEstablishmentStatus.developmentPlanBudgetDocument
            ? (0, hexBufaBufaHex_1.bufferToHex)(Buffer.from(trustEstablishmentStatus.developmentPlanBudgetDocument))
            : null, trustDistributionMatrixDocument: trustEstablishmentStatus.trustDistributionMatrixDocument
            ? (0, hexBufaBufaHex_1.bufferToHex)(Buffer.from(trustEstablishmentStatus.trustDistributionMatrixDocument))
            : null, trustId: trustEstablishmentStatus.trustId, settlorOperationalExpenditures });
});
exports.getTrustEstablishment = getTrustEstablishment;
