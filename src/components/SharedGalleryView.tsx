import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Download, ArrowLeft, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
}

interface GalleryData {
  id: string;
  title: string;
  description: string | null;
  photos: Photo[];
  viewCount: number;
  createdAt: string;
}

export function SharedGalleryView() {
  const params = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/share/${params.code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Gallery not found or not shared');
          } else {
            setError('Failed to load gallery');
          }
          return;
        }

        const data = await response.json();
        setGallery(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('An error occurred while loading the gallery');
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.code) {
      fetchGallery();
    }
  }, [params.code]);

  const handleDownload = async (photo: Photo) => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = photo.url;
      
      // Extract filename from URL or use photo ID
      const urlParts = photo.url.split('/');
      let filename = photo.title || `photo-${photo.id}`;
      
      // Add file extension if missing
      if (!filename.includes('.')) {
        const extension = photo.url.split('.').pop()?.split('?')[0] || 'jpg';
        filename = `${filename}.${extension}`;
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (err) {
      console.error('Error downloading photo:', err);
      toast.error('Failed to download photo');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Gallery</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error}. Please check the link and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{gallery.title}</CardTitle>
          {gallery.description && (
            <p className="text-muted-foreground">{gallery.description}</p>
          )}
          <div className="text-sm text-muted-foreground">
            {gallery.photos.length} photos • {gallery.viewCount} views • Shared on{' '}
            {new Date(gallery.createdAt).toLocaleDateString()}
          </div>
        </CardHeader>
      </Card>

      {gallery.photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-lg">
          <p className="text-muted-foreground">No photos in this gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={photo.url}
                  alt={photo.title || 'Gallery photo'}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 cursor-zoom-in"
                  onClick={() => setSelectedPhoto(photo)}
                />
              </div>
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              {(photo.title || photo.description) && (
                <div className="mt-2">
                  {photo.title && (
                    <h3 className="font-medium line-clamp-1">{photo.title}</h3>
                  )}
                  {photo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen photo viewer */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.title || 'Gallery photo'}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedPhoto);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
