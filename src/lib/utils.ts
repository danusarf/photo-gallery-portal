/**
 * Generates a random string of the specified length
 * @param length - Length of the string to generate (default: 8)
 * @returns A random string
 */
export function generateShareCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Use crypto.getRandomValues for better randomness if available
  const randomValues = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
  } else {
    // Fallback to Math.random() if crypto is not available (should only happen in non-browser environments)
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256);
    }
  }

  // Convert random values to characters
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}

/**
 * Validates a share code
 * @param code - The code to validate
 * @returns boolean indicating if the code is valid
 */
export function isValidShareCode(code: string): boolean {
  // Only allow alphanumeric characters, 6-12 characters long
  return /^[A-Za-z0-9]{6,12}$/.test(code);
}

/**
 * Creates a shareable URL for a gallery
 * @param code - The gallery's share code
 * @returns The full shareable URL
 */
export function createShareUrl(code: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/share/${code}`;
  }
  // Fallback for server-side rendering
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/share/${code}`;
}
