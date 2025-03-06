"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.notFoundResponse = exports.successResponse = void 0;
const successResponse = (message, data) => ({
    success: true,
    message,
    data,
});
exports.successResponse = successResponse;
const notFoundResponse = (message, data) => ({
    success: false,
    message,
    data,
});
exports.notFoundResponse = notFoundResponse;
const errorResponse = (message, error) => ({
    success: false,
    message,
    error: (error === null || error === void 0 ? void 0 : error.toString()) || "An error occurred",
});
exports.errorResponse = errorResponse;
