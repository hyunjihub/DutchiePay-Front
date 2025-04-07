import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { encrypted } = await req.json();

  const encryptedData = CryptoJS.enc.Base64.parse(encrypted);
  const key = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  const extracted = JSON.parse(decrypted);
  const userInfo = {
    userId: extracted.userId,
    nickname: extracted.nickname,
    profileImage: extracted.profileImg,
    location: extracted.location,
    isCertified: extracted.isCertified,
  };

  const response = NextResponse.json({
    userInfo,
    access: extracted.access,
    loginType: extracted.type,
    refresh: extracted.refresh,
    status: 200,
  });

  return response;
}
