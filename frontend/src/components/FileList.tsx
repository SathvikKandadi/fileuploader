import React, { useState } from 'react';
import { Download, Share2, Clock, Trash2, AlertCircle } from 'lucide-react';

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface FileListProps {
  files: File[];
  onDownload: (fileId: string) => void;
  onShare: (fileId: string, email: string) => void;
  onDelete: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onDownload, onShare, onDelete }) => {
  const [sharingFileId, setSharingFileId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleShare = async (fileId: string) => {
    if (!shareEmail) return;
    await onShare(fileId, shareEmail);
    setSharingFileId(null);
    setShareEmail('');
  };

  const handleDeleteConfirm = async (fileId: string) => {
    await onDelete(fileId);
    setDeletingFileId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        {files.length === 0 ? (
          <div className="text-center text-gray-500">
            No files uploaded yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {file.type.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center gap-2">
                    <button
                      onClick={() => onDownload(file.id)}
                      className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                     <button
                      onClick={() => setSharingFileId(file.id)}
                      className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                      title="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button> 

                    <button
                      onClick={() => setDeletingFileId(file.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {sharingFileId === file.id && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter email to share with"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleShare(file.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => setSharingFileId(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {deletingFileId === file.id && (
                  <div className="mt-4 bg-red-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Delete file?
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          Are you sure you want to delete "{file.name}"? This action cannot be undone.
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleDeleteConfirm(file.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingFileId(null)}
                            className="px-4 py-2 bg-white text-gray-700 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};