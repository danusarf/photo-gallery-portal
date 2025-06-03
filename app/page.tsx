'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [key, setKey] = useState('');
  const router = useRouter();

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      router.push(`/gallery/${encodeURIComponent(key.trim())}`);
    }
  };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Welcome to Photo Gallery
        </h1>
        
        <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
          <form onSubmit={handleKeySubmit} className="w-full">
            <div className="flex flex-col space-y-2 mb-4">
              <label htmlFor="galleryKey" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter Gallery Key
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="galleryKey"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g., wedding-2025"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!key.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go
                </button>
              </div>
            </div>
          </form>
          
          <div className="relative w-full flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          <Link 
            href="/api/auth/signin"
            className="w-full px-6 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Sign In
          </Link>
          
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Or{' '}
            <Link 
              href="/gallery" 
              className="text-blue-500 hover:underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              browse public galleries
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
