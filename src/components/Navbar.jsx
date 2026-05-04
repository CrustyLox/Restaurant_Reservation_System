import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navLinks = [
    { path: '/dashboard',   label: 'Dashboard'   },
    { path: '/search',      label: 'Explore'      },
    { path: '/my-bookings', label: 'My Bookings'  },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(); // signOut does window.location.href = '/login' internally
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/login'; // fallback
    }
  };

  return (
    <nav className="bg-[#1a1a1a] text-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
              <span className="text-xl leading-none block">🍒</span>
            </div>
            <Link to="/dashboard" className="flex items-center hover:opacity-90 transition-opacity">
              <span className="font-bold text-2xl text-white">WhereMyFoodAt</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white text-[#1a1a1a]'
                        : 'text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="w-8 h-8 bg-[#ef5922] rounded-full flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-white transition-all cursor-pointer"
                title="Profile"
              >
                {user.user_metadata?.user_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white transition-colors p-1"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden bg-[#1a1a1a] border-t border-white/10 overflow-x-auto">
        <div className="flex px-4 py-2 space-x-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isActive ? 'bg-white text-[#1a1a1a]' : 'text-gray-300 hover:bg-white/20'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
