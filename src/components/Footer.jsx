import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <footer className="bg-dark text-gray-400 py-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍒</span>
          <span className="font-semibold text-white">WhereMyFoodAt</span>
          <span className="text-sm ml-2">© {new Date().getFullYear()}</span>
        </div>
        
        <div className="flex space-x-6 text-sm">
          <Link to="#" className="hover:text-primary transition-colors">About Us</Link>
          <Link to="#" className="hover:text-primary transition-colors">Help Center</Link>
          <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
