import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from './FileUploader';
import { FileList } from './FileList';
import { URL } from '../utils/url';
import { FileListImproved } from './FileListImproved';
import { User } from 'lucide-react';
import { Navbar } from './Navbar';

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  ownerId: string;
}

export const FileDashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      console.error('User ID not found in local storage');
      return; // or handle the error as needed
    }

    try {
      const response = await fetch(`${URL}/api/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId! })
      });
      const data = await response.json();
      console.log(data);
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchFiles();
  };

  const handleDownload = async (fileId: string) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      console.error('User ID not found in local storage');
      return; // or handle the error as needed
    }
    try {
      const response = await fetch(`${URL}/api/files/${fileId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure proper content type for JSON body
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId }),
      });
    
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
    
      const blob = await response.blob(); // Ensure proper handling of binary response
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = files.find(f => f.id === fileId)?.name || 'download.pdf'; // Add appropriate file extension
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }    
  };

  const handleShare = async (fileId: string, email: string) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      console.error('User ID not found in local storage');
      return; // or handle the error as needed
    }
    try {
      await fetch(`${URL}/api/files/${fileId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, accessType: 'READ' , userId })
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.id : null;

    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    try {
      const response = await fetch(`${URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (response.status === 403) {
        // Handle permission denied
        alert('You do not have permission to delete this file');
        return;
      }

      // Update local state to remove the deleted file
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const email = user ? user.email : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={email} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FileUploader onUploadSuccess={handleUploadSuccess} />
        <FileListImproved
          files={files}
          onDownload={handleDownload}
          onShare={handleShare}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};