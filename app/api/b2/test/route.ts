import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const B2_ENDPOINT = `https://s3.${process.env.B2_REGION}.backblazeb2.com`;

export async function GET() {
  const s3Client = new S3Client({
    region: process.env.B2_REGION || 'us-east-005',
    endpoint: B2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.B2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!
    }
  });

  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    
    return NextResponse.json({
      success: true,
      owner: response.Owner,
      buckets: response.Buckets?.map(b => b.Name),
      region: process.env.B2_REGION,
      endpoint: B2_ENDPOINT
    });
  } catch (error: any) {
    console.error('Test connection error:', {
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      region: process.env.B2_REGION,
      endpoint: B2_ENDPOINT
    });

    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        code: error.$metadata?.httpStatusCode,
        region: process.env.B2_REGION,
        endpoint: B2_ENDPOINT
      },
      { status: 500 }
    );
  }
}