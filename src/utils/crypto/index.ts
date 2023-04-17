import CryptoJS from 'crypto-js'

const CryptoSecret = '__CRYPTO_SECRET__'

export function enCrypto(data: any) {
  const str = JSON.stringify(data)
  return CryptoJS.AES.encrypt(str, CryptoSecret).toString()
}

export function deCrypto(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, CryptoSecret)
  const str = bytes.toString(CryptoJS.enc.Utf8)

  if (str)
    return JSON.parse(str)

  return null
}

export function encryption (params: any) {
  const { data, type, param } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach((ele:string) => {
      result[ele] = window.btoa(result[ele]);
    });
  } else {
    param.forEach((ele:string) => {
      const data = result[ele];
      const key = CryptoJS.enc.Latin1.parse(params.key);
      const iv = key;
      // 加密
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
}