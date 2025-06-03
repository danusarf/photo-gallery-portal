import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.B2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY || ''
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';
  const delimiter = searchParams.get('delimiter') || '/';

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: delimiter
    });

    const response = await s3Client.send(command);
    
    return NextResponse.json({
      directories: response.CommonPrefixes?.map(p => p.Prefix) || [],
      files: response.Contents?.map(f => ({
        key: f.Key,
        lastModified: f.LastModified,
        size: f.Size
      })) || []
    });
  } catch (error) {
    console.error('Error listing B2 objects:', error);
    return NextResponse.json(
      { error: 'Failed to list directory' },
      { status: 500 }
    );
  }
}
