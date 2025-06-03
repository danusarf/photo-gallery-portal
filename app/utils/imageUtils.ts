export const getThumbnailUrl = (key: string, width: number = 400, height: number = 400) => {
  const bucketName = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_B2_REGION;
  // Using Backblaze's image resizing feature
  return `https://${bucketName}.s3.${region}.backblazeb2.com/${key}?w=${width}&h=${height}&fit=cover`;
};

export const getFullImageUrl = (key: string) => {
  const bucketName = process.env.NEXT_PUBLIC_B2_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_B2_REGION;
  return `https://${bucketName}.s3.${region}.backblazeb2.com/${key}`;
};

// Add this function to handle different image formats
export const getOptimizedImageUrl = (key: string, width: number, height: number, format: 'webp' | 'jpeg' | 'png' = 'webp') => {
  const baseUrl = getFullImageUrl(key);
  return `${baseUrl}?w=${width}&h=${height}&format=${format}&quality=85`;
};
