import CryptoJS from "crypto-js";

// AES 配置（根据项目实际需求修改）
const AES_CONFIG = {
  key: CryptoJS.enc.Utf8.parse("0123456789abcdef"), // 16位密钥（必须为16/24/32位，对应AES-128/192/256）
  iv: CryptoJS.enc.Utf8.parse("0123456789abcdef"), // 16位偏移量（CBC模式需要）
  mode: CryptoJS.mode.CBC, // 加密模式（常用CBC）
  padding: CryptoJS.pad.Pkcs7, // 填充方式（常用Pkcs7）
};

/**
 * AES 加密函数
 * @param {string} plainText 明文内容
 * @returns {string} 加密后的Base64字符串
 */
export function aesEncrypt(plainText) {
  const encrypted = CryptoJS.AES.encrypt(plainText, AES_CONFIG.key, {
    iv: AES_CONFIG.iv,
    mode: AES_CONFIG.mode,
    padding: AES_CONFIG.padding,
  });
  return encrypted.toString(); // 默认输出Base64格式
}

/**
 * AES 解密函数
 * @param {string} cipherText 加密后的Base64字符串
 * @returns {string} 解密后的明文内容
 */
export function aesDecrypt(cipherText) {
  const decrypted = CryptoJS.AES.decrypt(cipherText, AES_CONFIG.key, {
    iv: AES_CONFIG.iv,
    mode: AES_CONFIG.mode,
    padding: AES_CONFIG.padding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
