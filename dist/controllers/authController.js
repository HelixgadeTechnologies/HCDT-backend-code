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
exports.test = exports.login = exports.deleteSettlor = exports.listAllSettlor = exports.addSettlor = exports.listAllDRA = exports.addDRA = exports.listAllNUPRC = exports.addNuprc = exports.listAllAdmin = exports.addAdmin = exports.deleteUser = exports.register = void 0;
const authService_1 = require("../service/authService");
const responseHandler_1 = require("../utils/responseHandler");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, authService_1.registerUser)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)("User registered successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.register = register;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json((0, responseHandler_1.notFoundResponse)("User ID is required", userId));
        }
        const user = yield (0, authService_1.removeUser)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)("User removed successfully", user));
    }
    catch (error) {
        res.status(500).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.deleteUser = deleteUser;
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield (0, authService_1.registerAdmin)(req.body.data, req.body.isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("Admin registered successfully", admin));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.addAdmin = addAdmin;
const listAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield (0, authService_1.getAllAdmin)();
        res.status(201).json((0, responseHandler_1.successResponse)("Admin", admin));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.listAllAdmin = listAllAdmin;
const addNuprc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const NUPRC = yield (0, authService_1.registerNuprc)(req.body.data, req.body.isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("NUPRC registered successfully", NUPRC));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.addNuprc = addNuprc;
const listAllNUPRC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuprc = yield (0, authService_1.getAllNUPRC)();
        res.status(201).json((0, responseHandler_1.successResponse)("NUPRC-ADR", nuprc));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.listAllNUPRC = listAllNUPRC;
const addDRA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DRA = yield (0, authService_1.registerDRA)(req.body.data, req.body.isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("DRA registered successfully", DRA));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.addDRA = addDRA;
const listAllDRA = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dra = yield (0, authService_1.getAllDRA)();
        res.status(201).json((0, responseHandler_1.successResponse)("DRA", dra));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.listAllDRA = listAllDRA;
const addSettlor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settlor = yield (0, authService_1.registerSettlor)(req.body.data, req.body.isCreate);
        res.status(201).json((0, responseHandler_1.successResponse)("Settlor registered successfully", settlor));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.addSettlor = addSettlor;
const listAllSettlor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settlor = yield (0, authService_1.getAllSettlor)();
        res.status(201).json((0, responseHandler_1.successResponse)("SETTLOR", settlor));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.listAllSettlor = listAllSettlor;
const deleteSettlor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settlor = yield (0, authService_1.removeSettlor)(req.body);
        res.status(201).json((0, responseHandler_1.successResponse)("SETTLOR", settlor));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.deleteSettlor = deleteSettlor;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (0, authService_1.loginUser)(req.body);
        res.status(200).json((0, responseHandler_1.successResponse)("Login successfully", token));
    }
    catch (error) {
        res.status(400).json((0, responseHandler_1.errorResponse)("Internal server error", error));
    }
});
exports.login = login;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("HCDT API WORKING");
});
exports.test = test;
