// Convert Hex to Uint8Array (Raw Binary Data)
const hexToUint8Array = (hex: string) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
};

// Convert Hex to Base64 (For Images, PDFs, etc.)
export const hexToBase64 = (hex: string, mimeType: string) => {
    const bytes = hexToUint8Array(hex);
    return `data:${mimeType};base64,${btoa(String.fromCharCode(...bytes))}`;
};

// Convert Hex to Blob URL (For Large Files like DOCX, XLSX, etc.)
export const hexToBlobURL = (hex: string, mimeType: string) => {
    const bytes = hexToUint8Array(hex);
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
};

// Convert Hex to String (For Text Files)
export const hexToString = (hex: string) => {
    const bytes = hexToUint8Array(hex);
    return new TextDecoder().decode(bytes);
};
