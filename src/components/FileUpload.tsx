'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (files: { url: string; key: string }[]) => void;
  multiple?: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({
  onUpload,
  multiple = true,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; key: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      setError(null);

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileName', file.name);
          formData.append('mimeType', file.type);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const result = await response.json();
          return { url: result.url, key: result.key };
        });

        const results = await Promise.all(uploadPromises);
        setUploadedFiles((prev) => [...prev, ...results]);
        onUpload(results);
      } catch (err) {
        console.error('Error uploading files:', err);
        setError('Failed to upload files. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    const removedFile = newFiles.splice(index, 1)[0];
    setUploadedFiles(newFiles);
    
    // Optionally, you can add a call to delete the file from B2
    // deleteFile(removedFile.key).catch(console.error);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-xs text-gray-500">
            {`Supports ${Object.values(accept)[0].join(', ')} (max ${maxSize / 1024 / 1024}MB)`}
          </p>
        </div>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Uploaded files:</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li
                key={file.key}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.key.split('/').pop()}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
