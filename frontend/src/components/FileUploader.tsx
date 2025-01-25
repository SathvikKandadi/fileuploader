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
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ease-in-out
          ${dragActive 
            ? 'border-purple-500 bg-purple-50 shadow-lg' 
            : 'border-indigo-300 bg-gradient-to-br from-blue-50 to-purple-50'}
          ${uploading 
            ? 'opacity-60 cursor-not-allowed' 
            : 'cursor-pointer hover:shadow-xl hover:border-indigo-400'}
          ${selectedFile ? 'border-green-400 bg-green-50' : ''}`}
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
        
        <Upload 
          className={`mx-auto h-16 w-16 transition-colors duration-300 
            ${dragActive ? 'text-purple-500' : 'text-indigo-400'}
            ${uploading ? 'animate-pulse' : ''}
            ${selectedFile ? 'text-green-500' : ''}`} 
        />
        
        <p className={`mt-4 text-md font-medium transition-colors duration-300
          ${dragActive ? 'text-purple-700' : 'text-indigo-600'}
          ${uploading ? 'text-gray-500' : ''}
          ${selectedFile ? 'text-green-700' : ''}`}>
          {uploading 
            ? 'Uploading...' 
            : selectedFile 
              ? 'File Selected' 
              : 'Drag and drop a file or click to select'}
        </p>
        
        {selectedFile && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              {selectedFile.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelectedFile();
              }}
              className="p-2 hover:bg-red-50 rounded-full hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5 text-indigo-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
 
};