import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../baseUrl";

// Encrypt function
export function encryptData(data) {
  try {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    // console.log('ciphertextciphertext', ciphertext);
    return ciphertext;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

// Decrypt function
// export function decryptData(ciphertext) {
//     console.log('ciphertextciphertext', ciphertext)
//   try {
//     const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
//     const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//     console.log('decryptedData', decryptedData);
//     return decryptedData;
//   } catch (error) {
//     console.error("Decryption error:", error);
//     return null;
//   }
// }
export function decryptData(ciphertext) {
  try {
    if (!ciphertext || typeof ciphertext !== "string") {
      return null;
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) return null; // Handle decryption failures

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
