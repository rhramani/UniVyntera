export const normalizeFilePath = (filePath) => {
    if (!filePath) return "";
    let normalizedPath = String(filePath).replace(/\\/g, "/");

    // Remove uploads/ prefix if it exists
    if (normalizedPath.startsWith("uploads/")) {
        normalizedPath = normalizedPath.substring(8);
    }

    return normalizedPath;
};