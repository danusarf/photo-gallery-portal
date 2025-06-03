/**
 * Generates a shareable link for a gallery
 * @param shareCode - The unique share code of the gallery
 * @returns The full shareable URL
 */
export function generateShareLink(shareCode: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/share/${shareCode}`;
  }
  // Fallback for server-side rendering
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/share/${shareCode}`;
}

/**
 * Copies a share link to the clipboard
 * @param shareCode - The share code to copy
 * @returns A promise that resolves when the link is copied
 */
export async function copyShareLink(shareCode: string): Promise<boolean> {
  try {
    const shareLink = generateShareLink(shareCode);
    
    // Use the modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareLink);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = shareLink;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('Failed to copy share link: ', error);
    return false;
  }
}

/**
 * Extracts the share code from a share URL
 * @param url - The share URL
 * @returns The share code or null if not found
 */
export function extractShareCode(url: string): string | null {
  const match = url.match(/\/share\/([^/]+)/);
  return match ? match[1] : null;
}
