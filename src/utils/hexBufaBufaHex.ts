// Convert Hex string to Buffer (for saving in Prisma)
export const hexToBuffer = (hexString: string): Buffer => {
    return Buffer.from(hexString, "hex");
};

// Convert Buffer to Hex string (for sending to frontend)
export const bufferToHex = (buffer: Buffer): string => {
    return buffer.toString("hex");
};
