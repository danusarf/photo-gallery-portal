import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    B2_BUCKET_NAME: process.env.B2_BUCKET_NAME,
    B2_REGION: process.env.B2_REGION,
    B2_ENDPOINT: process.env.B2_ENDPOINT,
    hasKey: !!process.env.B2_ACCESS_KEY_ID,
    hasSecret: !!process.env.B2_SECRET_ACCESS_KEY
  });
}
