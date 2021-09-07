const SM4 = require('gm-crypt').sm4

/**
 * 配置sm4参数
 */
const sm4Config = {
  key: 'AJBINFO2021APRIL',
  mode: 'ecb',
  cipherType: 'base64'
}

const sm4 = new SM4(sm4Config)

// 加密
export function encrypt(str) {
  return sm4.encrypt(str)
}

// 解密
export function decrypt(encryptedStr) {
  return sm4.decrypt(encryptedStr)
}

