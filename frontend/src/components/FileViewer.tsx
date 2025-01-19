import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface FileViewerProps {
  filename: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ filename }) => {
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/download/${filename}`);
        if (!response.ok) throw new Error('Download failed');
        
        // Get the file type from the response headers
        const contentType = response.headers.get('content-type') || '';
        setFileType(contentType);

        // Convert the response to blob
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setFileData(objectUrl);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
    
    // Cleanup
    return () => {
      if (fileData) {
        URL.revokeObjectURL(fileData);
      }
    };
  }, [filename]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error loading file: {error}
      </div>
    );
  }

  const downloadFile = () => {
    if (fileData) {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderFileContent = () => {
    if (fileType.startsWith('image/') && fileData) {
      return (
        <img 
          src={fileData} 
          alt={filename}
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      );
    }
    
    if (fileType === 'application/pdf' && fileData) {
      return (
        <iframe
          src={fileData}
          title={filename}
          className="w-full h-screen border-none rounded-lg shadow-lg"
        />
      );
    }
    
    if (fileType.startsWith('text/')) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-lg">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {fileData}
          </pre>
        </div>
      );
    }

    // For other file types, show download button
    return (
      <div className="text-center">
        <p className="mb-4">This file type cannot be previewed directly.</p>
        <button
          onClick={downloadFile}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download size={20} />
          Download File
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{filename}</h2>
        <button
          onClick={downloadFile}
          className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Download size={16} />
          Download
        </button>
      </div>
      {renderFileContent()}
    </div>
  );
};

export default FileViewer;