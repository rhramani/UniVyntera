import { decryptData } from "./encryptionUtils";


export const countryCodeISO = () => {
  try {
    const encryptedCode = localStorage.getItem("countryISOCode");
    if (encryptedCode) {
      const decryptedCode = decryptData(encryptedCode);
      return decryptedCode?.toLowerCase() || "in";
    }
    return "in";
  } catch (error) {
    console.error("Error getting default country:", error);
    return "in";
  }
};
