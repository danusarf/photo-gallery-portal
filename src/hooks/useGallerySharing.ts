import { useState } from 'react';
import { generateShareLink, copyShareLink } from '@/lib/share';

interface UseGallerySharingProps {
  galleryId: string;
  initialIsShared: boolean;
  shareCode: string;
}

interface UseGallerySharingReturn {
  isShared: boolean;
  shareLink: string;
  isCopying: boolean;
  isToggling: boolean;
  toggleSharing: () => Promise<void>;
  copyShareLinkToClipboard: () => Promise<boolean>;
}

export function useGallerySharing({
  galleryId,
  initialIsShared,
  shareCode,
}: UseGallerySharingProps): UseGallerySharingReturn {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [isToggling, setIsToggling] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const shareLink = generateShareLink(shareCode);

  const toggleSharing = async () => {
    try {
      setIsToggling(true);
      const response = await fetch(`/api/galleries/${galleryId}/toggle-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle sharing');
      }

      const data = await response.json();
      setIsShared(data.isShared);
    } catch (error) {
      console.error('Error toggling sharing:', error);
      // Revert the UI state on error
      setIsShared(!isShared);
    } finally {
      setIsToggling(false);
    }
  };

  const copyShareLinkToClipboard = async (): Promise<boolean> => {
    try {
      setIsCopying(true);
      const success = await copyShareLink(shareCode);
      return success;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    } finally {
      setIsCopying(false);
    }
  };

  return {
    isShared,
    shareLink,
    isCopying,
    isToggling,
    toggleSharing,
    copyShareLinkToClipboard,
  };
}
