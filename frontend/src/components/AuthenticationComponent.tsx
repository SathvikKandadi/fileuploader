import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '../utils/url';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const endpoint = isLogin ? `${URL}/api/auth/login` : `${URL}/api/auth/signup`;
      const bodyData = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name || undefined
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (isLogin) {
          navigate('/dashboard');
        } else {
          setError('Account successfully created! Please log in.');
          setIsLogin(true);
        }
      } else {
        setError(data.message || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Signup'} failed:`, error);
      setError(`An error occurred during ${isLogin ? 'login' : 'signup'}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Secure Cloud Storage</h1>
      <p className="mb-6 text-gray-600">
        {isLogin 
          ? 'Welcome back! Please login to your account.' 
          : 'Create an account to get started.'}
      </p>
      
      <div className="bg-white p-6 rounded shadow-md w-96">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-2 px-4 ${isLogin 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 px-4 ${!isLogin 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className={`p-3 rounded text-sm bg-red-50 text-red-500` }>
              {error}
            </div>
          )}
          
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name (Optional)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isLogin 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;