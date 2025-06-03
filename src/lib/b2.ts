import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Backblaze B2 configuration
const b2Config = {
  endpoint: process.env.B2_ENDPOINT || '',
  region: process.env.B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID || '',
    secretAccessKey: process.env.B2_APPLICATION_KEY || '',
  },
};

// Initialize S3 client with Backblaze B2 credentials
const s3Client = new S3Client({
  ...b2Config,
  forcePathStyle: true, // Required for Backblaze B2
});

/**
 * Upload a file to Backblaze B2
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The name to give the file in the bucket
 * @param mimeType - The MIME type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ url: string; key: string }> {
  const bucketName = process.env.B2_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('B2_BUCKET_NAME is not defined in environment variables');
  }

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Generate a public URL for the uploaded file
    const publicUrl = `https://${bucketName}.s3.${b2Config.region}.backblazeb2.com/${fileName}`;
    
    return {
      url: publicUrl,
      key: fileName,
    };
  } catch (error) {
    console.error('Error uploading to Backblaze B2:', error);
    throw new Error('Failed to upload file to Backblaze B2');
  }
}

/**
 * Delete a file from Backblaze B2
 * @param fileKey - The key of the file to delete
 */
export async function deleteFile(fileKey: string): Promise<void> {
  const bucketName = process.env.B2_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('B2_BUCKET_NAME is not defined in environment variables');
  }

  const deleteParams = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.error('Error deleting from Backblaze B2:', error);
    throw new Error('Failed to delete file from Backblaze B2');
  }
}

/**
 * Generate a pre-signed URL for a file
 * @param fileKey - The key of the file
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns The pre-signed URL
 */
export async function getSignedFileUrl(
  fileKey: string,
  expiresIn = 3600
): Promise<string> {
  const bucketName = process.env.B2_BUCKET_NAME;
  
  if (!bucketName) {
    throw new Error('B2_BUCKET_NAME is not defined in environment variables');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw new Error('Failed to generate pre-signed URL');
  }
}
