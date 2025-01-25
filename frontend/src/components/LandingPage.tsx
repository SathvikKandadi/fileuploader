import React, { useState } from 'react';
import { Rocket, CloudUpload, Shield, Globe, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    { 
      icon: <Rocket className="w-12 h-12 text-blue-600" />, 
      title: "Fast Upload", 
      description: "Lightning-quick file transfers" 
    },
    { 
      icon: <CloudUpload className="w-12 h-12 text-purple-600" />, 
      title: "Cloud Storage", 
      description: "Unlimited secure cloud storage" 
    },
    { 
      icon: <Shield className="w-12 h-12 text-green-600" />, 
      title: "Secure", 
      description: "Military-grade encryption" 
    },
    { 
      icon: <Globe className="w-12 h-12 text-red-600" />, 
      title: "Accessible", 
      description: "Access from anywhere, anytime" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Navigation */}
      <nav className="relative container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          FileFlow
        </div>
        
        {/* Desktop Navigation */}
        {/* <div className="hidden md:flex space-x-6 items-center">
          <a href="#" className="text-gray-700 hover:text-blue-600">Features</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Pricing</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Support</a>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Login
          </button>
        </div> */}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute z-20 left-0 right-0 bg-white shadow-lg">
          <div className="flex flex-col items-center space-y-4 py-6">
            <a href="#" className="text-gray-700">Features</a>
            <a href="#" className="text-gray-700">Pricing</a>
            <a href="#" className="text-gray-700">Support</a>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
              Login
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          File Management Reimagined
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10">
          Securely store, share, and manage your files with our intuitive platform.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition transform hover:scale-105 shadow-lg" onClick={() => navigate("/auth")}>
            Get Started
          </button>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition transform hover:scale-105 shadow-md border">
            Learn More
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">&copy; 2024 FileFlow. All rights reserved.</p>
            <div className="space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-300 hover:text-white">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;