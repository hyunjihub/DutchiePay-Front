import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { decrypted } = await req.json();

  const encrypt = CryptoJS.AES.encrypt(
    JSON.stringify(decrypted),
    process.env.SECRET_KEY
  ).toString();

  const response = NextResponse.json({
    encrypt,
    status: 200,
  });

  return response;
}
