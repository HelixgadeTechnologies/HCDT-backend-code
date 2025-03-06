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
exports.getSpecificTrustEstablishmentST = exports.addTrustEstablishmentST = exports.deleteTrust = exports.getTrustInfo = exports.getAll = exports.createTrust = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const trustService_1 = require("../service/trustService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTrust = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, trustService_1.createOrUpdateTrust)(req.body.data, req.body.isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("Trust creation successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.createTrust = createTrust;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trusts = yield (0, trustService_1.getAllTrust)();
        res.status(201).json((0, responseHandler_1.successResponse)("Trusts", trusts));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.getAll = getAll;
const getTrustInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trustId } = req.params;
        const trust = yield (0, trustService_1.getTrust)(trustId);
        res.status(201).json((0, responseHandler_1.successResponse)("Trust", trust));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.getTrustInfo = getTrustInfo;
const deleteTrust = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trustId } = req.body;
        if (!trustId) {
            res.status(400).json((0, responseHandler_1.notFoundResponse)("Trust ID is required", trustId));
        }
        const user = yield (0, trustService_1.removeTrust)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)("Trust removed successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.deleteTrust = deleteTrust;
const addTrustEstablishmentST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tes = yield (0, trustService_1.addTrustEstablishmentStatus)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)("Trust Establishment Status successfully Saved", tes));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.addTrustEstablishmentST = addTrustEstablishmentST;
const getSpecificTrustEstablishmentST = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trustId } = req.params;
        const tes = yield (0, trustService_1.getTrustEstablishment)(trustId);
        res.status(201).json((0, responseHandler_1.successResponse)("Trust Establishment Status", tes));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.getSpecificTrustEstablishmentST = getSpecificTrustEstablishmentST;
