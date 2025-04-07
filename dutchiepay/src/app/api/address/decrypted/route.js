import CryptoJS from 'crypto-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { encrypted } = await req.json();

  const decrypted = JSON.parse(
    CryptoJS.AES.decrypt(encrypted, process.env.SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    )
  );

  const response = NextResponse.json({
    decrypted,
    status: 200,
  });

  return response;
}
