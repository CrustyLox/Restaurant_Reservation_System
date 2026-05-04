import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';
import { useToast } from '../context/ToastContext';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = () => {
  const { user, dbUser, session } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setFormData({
        name: dbUser.user_name || user?.user_metadata?.user_name || '',
        phone: dbUser.phone || user?.user_metadata?.phone || ''
      });
    } else if (user) {
      setFormData({
        name: user.user_metadata?.user_name || '',
        phone: user.user_metadata?.phone || ''
      });
    }
  }, [dbUser, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { user_name: formData.name, phone: formData.phone }
      });
      if (authError) throw authError;

      // 2. Update public.users table if dbUser exists
      if (dbUser) {
        const { error: dbError } = await supabase
          .from('users')
          .update({ user_name: formData.name, phone: formData.phone })
          .eq('user_id', dbUser.user_id);
          
        if (dbError) throw dbError;
      }

      addToast('Profile updated successfully!', 'success');
      // Force reload to refresh context
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-2 tracking-tight">My Profile</h1>
        <p className="text-gray-400 text-sm">Manage your personal information and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-[#f4ede4]/30 flex items-center gap-6">
          <div className="w-20 h-20 bg-[#ef5922] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-sm">
            {formData.name.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'User'}</h2>
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <Mail size={14} className="mr-2" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center">
                <User size={12} className="mr-1" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#ef5922] transition-colors"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center">
                <Phone size={12} className="mr-1" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#ef5922] transition-colors"
                placeholder="Your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center">
                <Mail size={12} className="mr-1" /> Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-md py-3 px-4 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <Shield size={12} className="mr-1 text-green-500" /> Email cannot be changed
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ef5922] hover:bg-[#d94a1a] text-white font-medium py-3 px-8 rounded-md transition-colors focus:outline-none flex items-center justify-center min-w-[160px]"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
