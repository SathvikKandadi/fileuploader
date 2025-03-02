import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    name: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(user);
    setUserData({
      email: parsedUser.email,
      name: parsedUser.name || 'Not provided',
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={userData.email} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-sm font-medium text-gray-500">Email</h2>
              <p className="mt-1 text-lg text-gray-800">{userData.email}</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-sm font-medium text-gray-500">Name</h2>
              <p className="mt-1 text-lg text-gray-800">{userData.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 