import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { URL } from '../utils/url';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.id : null;

    if (userId) {
      formData.append('userId', userId);
    }
    try {
      const response = await fetch(`${URL}/api/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      setSelectedFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="mb-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        
        <p className="mt-2 text-sm text-gray-600">
          {uploading ? 'Uploading...' : 'Drag and drop a file or click to select'}
        </p>
        
        {selectedFile && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelectedFile();
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};