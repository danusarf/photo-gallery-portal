'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getThumbnailUrl, getFullImageUrl } from 'app/utils/imageUtils';

interface B2Object {
  key: string;
  lastModified?: Date;
  size?: number;
}

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const [objects, setObjects] = useState<B2Object[]>([]);
  const [directories, setDirectories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const path = Array.isArray(params.path) ? params.path.join('/') : '';

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const prefix = path ? (path.endsWith('/') ? path : `${path}/`) : '';
        const response = await fetch(`/api/b2?prefix=${encodeURIComponent(prefix)}&delimiter=/`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch gallery');
        }
        
        const data = await response.json();
        setDirectories(data.directories || []);
        setObjects(data.files || []);
      } catch (err: any) {
        console.error('Error fetching objects:', err);
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [path]);

  const navigateToPath = (key: string) => {
    const cleanKey = key.endsWith('/') ? key.slice(0, -1) : key;
    router.push(`/gallery/${cleanKey}`);
  };

  const openImage = (url: string) => {
    setSelectedImage(url);
  };

  const closeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImage}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeImage}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Full size"
                width={1200}
                height={800}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {path ? `Gallery: ${path}` : 'Photo Gallery'}
          </h1>
          {path && (
            <button
              onClick={() => {
                const parentPath = path.split('/').slice(0, -1).join('/');
                router.push(parentPath ? `/gallery/${parentPath}` : '/gallery');
              }}
              className="text-blue-500 hover:underline mt-2"
            >
              ← Back to parent directory
            </button>
          )}
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {directories.length === 0 && objects.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">This directory is empty.</p>
          ) : (
            <>
              {directories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Directories
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {directories.map((dir) => {
                      const dirName = dir.replace(path.endsWith('/') ? path : `${path}/`, '');
                      return (
                        <div
                          key={dir}
                          onClick={() => navigateToPath(dir)}
                          className="p-4 rounded-lg cursor-pointer bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          <div className="aspect-square flex items-center justify-center mb-2">
                            <span className="text-4xl">📁</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate text-center">
                            {dirName.replace(/\/$/, '')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {objects.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Images
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {objects.map((obj) => {
                      const fileName = obj.key.split('/').pop();
                      const thumbnailUrl = getThumbnailUrl(obj.key);
                      const fullImageUrl = getFullImageUrl(obj.key);
                      
                      return (
                        <div
                          key={obj.key}
                          className="group relative cursor-pointer"
                          onClick={() => openImage(fullImageUrl)}
                        >
                          <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <Image
                              src={thumbnailUrl}
                              alt={fileName || 'Gallery image'}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                              loading="lazy"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 truncate">
                            {fileName}
                          </p>
                          {obj.size && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(obj.size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
