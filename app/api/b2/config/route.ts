import { NextResponse } from 'next/server';

export async function GET() {
  // Don't expose sensitive data in production
  return NextResponse.json({
    hasAccessKey: !!process.env.B2_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.B2_SECRET_ACCESS_KEY,
    bucket: process.env.B2_BUCKET_NAME,
    region: process.env.B2_REGION,
    endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
    nodeEnv: process.env.NODE_ENV
  });
}