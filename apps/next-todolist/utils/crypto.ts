import CryptoJS from "crypto-js";

const getScretKey = () => {
  return process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY ?? "";
};

export function encryptData(data: any) {
  const secretKey = getScretKey(); // 应该是一个复杂的密钥
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export function decryptData(encryptedData: string) {
  const secretKey = getScretKey(); // 应该是相同的密钥
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
