"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToHex = exports.hexToBuffer = void 0;
// Convert Hex string to Buffer (for saving in Prisma)
const hexToBuffer = (hexString) => {
    return Buffer.from(hexString, "hex");
};
exports.hexToBuffer = hexToBuffer;
// Convert Buffer to Hex string (for sending to frontend)
const bufferToHex = (buffer) => {
    return buffer.toString("hex");
};
exports.bufferToHex = bufferToHex;
