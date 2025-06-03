'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PhotoIcon, ArrowLeftIcon, DownloadIcon } from '@heroicons/react/24/outline';

interface Gallery {
  id: string;
  title: string;
  description: string | null;
  photos: {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
  }[];
}

export default function ShareGalleryPage() {
  const { code } = useParams();
  const router = useRouter();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/share/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Gallery not found');
          } else {
            throw new Error('Failed to fetch gallery');
          }
          return;
        }

        const data = await response.json();
        setGallery(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Failed to load gallery. Please check the link and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [code]);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error downloading image:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Gallery not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{gallery.title}</h1>
          <div className="w-24"></div> {/* For alignment */}
        </div>
      </header>

      {/* Gallery Description */}
      {gallery.description && (
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-gray-700">{gallery.description}</p>
        </div>
      )}

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {gallery.photos.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No photos in this gallery</h3>
            <p className="mt-1 text-sm text-gray-500">This gallery doesn't contain any photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={photo.url}
                    alt={photo.title || 'Gallery photo'}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 cursor-pointer"
                    onClick={() => setSelectedImage(photo.url)}
                  />
                </div>
                {(photo.title || photo.description) && (
                  <div className="mt-2">
                    {photo.title && (
                      <h3 className="text-sm font-medium text-gray-900">{photo.title}</h3>
                    )}
                    {photo.description && (
                      <p className="text-sm text-gray-500">{photo.description}</p>
                    )}
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo.url, photo.title || `photo-${photo.id}.jpg`);
                  }}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[80vh] mx-auto object-contain"
            />
            <div className="mt-2 text-center">
              <button
                onClick={() => {
                  const filename = selectedImage.split('/').pop() || 'download.jpg';
                  handleDownload(selectedImage, filename);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
