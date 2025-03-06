"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authroute_1 = __importDefault(require("./authroute"));
const trustRoute_1 = __importDefault(require("./trustRoute"));
const rootRoutes = (0, express_1.Router)();
rootRoutes.use("/auth", authroute_1.default);
rootRoutes.use("/trust", trustRoute_1.default);
exports.default = rootRoutes;
