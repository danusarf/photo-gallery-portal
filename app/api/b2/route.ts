import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

// Backblaze B2 S3-compatible API endpoint
const B2_ENDPOINT = `https://s3.${process.env.B2_REGION}.backblazeb2.com`;

// Create S3 client with Backblaze B2 specific settings
const s3Client = new S3Client({
  region: process.env.B2_REGION || 'us-east-005',
  endpoint: B2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!
  }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';
  const delimiter = searchParams.get('delimiter') || '/';

  console.log('Listing B2 objects with prefix:', prefix);

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: delimiter,
      MaxKeys: 1000
    });

    const response = await s3Client.send(command);
    
    console.log('B2 API Response:', {
      prefix,
      directories: response.CommonPrefixes?.map(p => p.Prefix) || [],
      files: response.Contents?.map(f => f.Key) || []
    });
    
    return NextResponse.json({
      directories: response.CommonPrefixes?.map(p => p.Prefix).filter(Boolean) as string[],
      files: (response.Contents || [])
        .filter(file => {
          // Exclude the prefix itself and .bzEmpty files
          const shouldInclude = file.Key !== prefix && 
                              !file.Key?.endsWith('.bzEmpty') && 
                              !file.Key?.endsWith('/.bzEmpty');
          return shouldInclude;
        })
        .map(file => ({
          key: file.Key as string,
          lastModified: file.LastModified,
          size: file.Size
        }))
    });
  } catch (error: any) {
    console.error('B2 List Error:', {
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      region: process.env.B2_REGION,
      endpoint: B2_ENDPOINT,
      bucket: process.env.B2_BUCKET_NAME
    });

    return NextResponse.json(
      { 
        error: 'Failed to list B2 objects',
        message: error.message,
        code: error.$metadata?.httpStatusCode,
        region: process.env.B2_REGION,
        endpoint: B2_ENDPOINT
      },
      { status: 500 }
    );
  }
}