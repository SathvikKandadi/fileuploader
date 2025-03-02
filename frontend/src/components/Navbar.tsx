import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  email: string;
  onLogout: () => void;
}

export const Navbar = ({ email, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              FileFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-2 rounded-md ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className={`px-4 py-2 rounded-md ${
                location.pathname === '/profile' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
            <div className="relative group">
              <User 
                className="h-6 w-6 cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={() => navigate('/profile')}
              />
              <span className="absolute right-0 transform translate-y-2 bg-gray-700 text-white text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {email}
              </span>
            </div>
            <button 
              onClick={onLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 