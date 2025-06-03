interface DownloadOptions {
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Downloads a file from a URL
 * @param url - The URL of the file to download
 * @param options - Optional configuration
 * @returns A promise that resolves when the download starts
 */
export async function downloadFile(
  url: string,
  options: DownloadOptions = {}
): Promise<void> {
  const { filename, onSuccess, onError } = options;
  
  try {
    // Fetch the file
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }
    
    // Get the blob data
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Extract filename from URL if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      const urlPath = new URL(url).pathname;
      const urlFilename = urlPath.split('/').pop() || 'download';
      downloadFilename = urlFilename.includes('.') 
        ? urlFilename 
        : `${urlFilename}.jpg`; // Default to jpg if no extension
    }
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = downloadFilename;
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
    
    // Call success callback if provided
    if (onSuccess) {
      onSuccess();
    }
    
    return;
  } catch (error) {
    console.error('Download error:', error);
    
    // Call error callback if provided
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    
    throw error;
  }
}

/**
 * Opens a file in a new tab instead of downloading it
 * @param url - The URL of the file to open
 */
export function openFileInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Handles the download with user feedback
 * @param url - The URL of the file to download
 * @param filename - Optional filename for the downloaded file
 * @param toast - Optional toast function to show success/error messages
 */
export async function handleDownloadWithFeedback(
  url: string, 
  filename?: string,
  toast?: (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => void
): Promise<void> {
  try {
    await downloadFile(url, {
      filename,
      onSuccess: () => {
        if (toast) {
          toast({
            title: 'Download started',
            description: 'Your file is being downloaded.',
          });
        }
      },
      onError: (error) => {
        console.error('Download failed:', error);
        if (toast) {
          toast({
            title: 'Download failed',
            description: 'Could not download the file. Please try again.',
            variant: 'destructive',
          });
        }
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    if (toast) {
      toast({
        title: 'Error',
        description: 'An error occurred while trying to download the file.',
        variant: 'destructive',
      });
    }
  }
}
