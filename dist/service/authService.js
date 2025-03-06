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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.removeSettlor = exports.getAllSettlor = exports.registerSettlor = exports.getAllDRA = exports.registerDRA = exports.getAllNUPRC = exports.registerNuprc = exports.getAllAdmin = exports.registerAdmin = exports.removeUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET = "hcdtSecretKey";
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield prisma.role.findFirst({ where: { roleName: "ADMIN" } });
    const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser)
        throw new Error("User with this email already exists");
    // hash password
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    return prisma.user.create({
        data: {
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            email: data.email,
            address: data.address || null,
            phoneNumber: data.phoneNumber || null,
            community: data.community || null,
            state: data.state || null,
            status: 1,
            localGovernmentArea: data.localGovernmentArea || null,
            role: (roles === null || roles === void 0 ? void 0 : roles.roleId) ? { connect: { roleId: roles === null || roles === void 0 ? void 0 : roles.roleId } } : undefined,
            password: hashedPassword
        }
    });
});
exports.registerUser = registerUser;
const removeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield prisma.user.delete({ where: { userId } });
    return user;
});
exports.removeUser = removeUser;
const registerAdmin = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCreate) {
        const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new Error("User with this email already exists");
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash("12345", 10);
        return prisma.user.create({
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email,
                roleId: data.roleId || null,
                trusts: data.trusts,
                status: 0,
                password: hashedPassword
            }
        });
    }
    else {
        return prisma.user.update({
            where: { userId: data.userId },
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email || null,
                roleId: data.roleId || null,
                trusts: data.trusts,
                status: 0
            },
        });
    }
});
exports.registerAdmin = registerAdmin;
const getAllAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.$queryRaw `
    SELECT * FROM user_view WHERE role IN(${"SUPER ADMIN"},${"ADMIN"})
  `;
    return user;
});
exports.getAllAdmin = getAllAdmin;
const registerNuprc = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield prisma.role.findFirst({ where: { roleName: "NUPRC-ADR" } });
    if (isCreate) {
        const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new Error("User with this email already exists");
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash("12345", 10);
        return prisma.user.create({
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email,
                phoneNumber: data.phoneNumber || null,
                roleId: (roles === null || roles === void 0 ? void 0 : roles.roleId) || null,
                password: hashedPassword
            }
        });
    }
    else {
        return prisma.user.update({
            where: { userId: data.userId },
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email || null,
                phoneNumber: data.phoneNumber || null,
            }
        });
    }
});
exports.registerNuprc = registerNuprc;
const getAllNUPRC = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.$queryRaw `
   SELECT * FROM user_view WHERE role IN(${"NUPRC-ADR"})
 `;
    return user;
});
exports.getAllNUPRC = getAllNUPRC;
const registerDRA = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield prisma.role.findFirst({ where: { roleName: "DRA" } });
    if (isCreate) {
        const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser)
            throw new Error("User with this email already exists");
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash("12345", 10);
        return prisma.user.create({
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email,
                phoneNumber: data.phoneNumber || null,
                role: (roles === null || roles === void 0 ? void 0 : roles.roleId) ? { connect: { roleId: roles === null || roles === void 0 ? void 0 : roles.roleId } } : undefined,
                password: hashedPassword
            }
        });
    }
    else {
        return prisma.user.update({
            where: { userId: data.userId },
            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                email: data.email || null,
                phoneNumber: data.phoneNumber || null,
            }
        });
    }
});
exports.registerDRA = registerDRA;
const getAllDRA = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.$queryRaw `
   SELECT * FROM user_view WHERE role IN(${"DRA"})
 `;
    return user;
});
exports.getAllDRA = getAllDRA;
const registerSettlor = (data, isCreate) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const settlorData = {
        settlorName: (_a = data.settlorName) !== null && _a !== void 0 ? _a : null,
        omlCode: (_b = data.omlCode) !== null && _b !== void 0 ? _b : null,
        contactName: (_c = data.contactName) !== null && _c !== void 0 ? _c : null,
        contactEmail: (_d = data.contactEmail) !== null && _d !== void 0 ? _d : null,
        contactPhoneNumber: (_e = data.contactPhoneNumber) !== null && _e !== void 0 ? _e : null,
    };
    if (isCreate) {
        const existingSettlor = yield prisma.settlor.findUnique({
            where: { omlCode: data.omlCode },
        });
        if (existingSettlor)
            throw new Error("Settlor with this OmlCode already exists");
        return prisma.settlor.create({ data: settlorData });
    }
    return prisma.settlor.update({
        where: { settlorId: data.settlorId },
        data: settlorData,
    });
});
exports.registerSettlor = registerSettlor;
const getAllSettlor = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.$queryRaw `
  SELECT * FROM settlor
`;
    return user;
});
exports.getAllSettlor = getAllSettlor;
const removeSettlor = (settlorId) => __awaiter(void 0, void 0, void 0, function* () {
    const settlor = prisma.settlor.delete({ where: { settlorId } });
    return settlor;
});
exports.removeSettlor = removeSettlor;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.$queryRaw `
  SELECT * FROM user_view WHERE email = ${data.email}
`;
    if (user.length < 1)
        throw new Error("Invalid credentials");
    const isPasswordValid = yield bcryptjs_1.default.compare(data.password, user[0].password);
    if (!isPasswordValid)
        throw new Error("Invalid credentials");
    return jsonwebtoken_1.default.sign(user[0], SECRET, { expiresIn: "1h" });
});
exports.loginUser = loginUser;
