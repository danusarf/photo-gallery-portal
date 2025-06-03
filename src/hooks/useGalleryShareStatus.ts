import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface GalleryShareStatus {
  isShared: boolean;
  shareCode: string | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useGalleryShareStatus(galleryId: string): GalleryShareStatus {
  const { data: session, status } = useSession();
  const [isShared, setIsShared] = useState<boolean>(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShareStatus = async () => {
    if (status === 'loading' || !session?.user?.id) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/galleries/${galleryId}/share-status`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch share status');
      }
      
      const data = await response.json();
      setIsShared(data.isShared);
      setShareCode(data.shareCode);
    } catch (err) {
      console.error('Error fetching share status:', err);
      setError('Failed to load share status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchShareStatus();
    }
  }, [status, galleryId]);

  return {
    isShared,
    shareCode,
    isLoading,
    error,
    refresh: fetchShareStatus,
  };
}
