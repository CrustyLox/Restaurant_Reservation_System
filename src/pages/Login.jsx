import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        addToast('Successfully signed in!', 'success');
        navigate('/dashboard');
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          phone: formData.phone
        });
        if (error) throw error;
        addToast('Registration successful!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-dark flex-col justify-between p-16 text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white p-2 rounded">
              <span className="text-3xl leading-none block">🍒</span>
            </div>
            <div>
              <span className="font-bold text-3xl block">WhereMyFoodAt</span>
              <span className="text-gray-400 text-sm">Your dining experience, simplified</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold leading-relaxed mb-12 text-primary pr-12">
            WhereMyFoodAt helps you find, book, and manage restaurant reservations in seconds.<br/><br/>
            No calls, no waiting — just great food and great experiences.
          </h1>
          
          <ul className="space-y-8">
            <li>
              <div className="flex items-center gap-3 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Instant Reservations</span>
              </div>
              <p className="text-gray-400 text-sm pl-5">Reserve tables at top restaurants in seconds</p>
            </li>
            <li>
              <div className="flex items-center gap-3 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Manage Bookings</span>
              </div>
              <p className="text-gray-400 text-sm pl-5">View, modify, and cancel reservations effortlessly</p>
            </li>
            <li>
              <div className="flex items-center gap-3 font-semibold mb-1">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>Exclusive Access</span>
              </div>
              <p className="text-gray-400 text-sm pl-5">Get priority reservations at premium venues</p>
            </li>
          </ul>
        </div>
        
        <div className="mt-20">
          <p className="italic text-gray-400 mb-6 max-w-md">"Wheremyfoodat has completely transformed how I experience dining. No more waiting or phone calls - just simple, elegant bookings."</p>
          <div className="mb-12">
            <p className="font-bold text-white text-sm">Cherry</p>
            <p className="text-xs text-gray-400">Food Enthusiast</p>
          </div>
          <p className="text-xs text-gray-500">© 2026 WhereMyFoodAt All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[440px]">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-white p-2 rounded">
              <span className="text-3xl leading-none block">🍒</span>
            </div>
            <span className="font-bold text-2xl text-dark">WhereMyFoodAt</span>
          </div>

          <div className="bg-white rounded-[12px] shadow-sm p-10 border border-gray-100">
            <div className="flex mb-10 bg-[#f4ede4] p-1.5 rounded-lg text-sm">
              <button
                type="button"
                className={`flex-1 py-2.5 font-semibold rounded-md transition-colors ${isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setIsLogin(true); setErrors({}); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 font-semibold rounded-md transition-colors ${!isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => { setIsLogin(false); setErrors({}); }}
              >
                Register
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-8">Sign in to manage your reservations</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name <span className="text-primary">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field bg-[#faf9f7] ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number <span className="text-primary">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-field bg-[#faf9f7] ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address <span className="text-primary">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field bg-[#faf9f7] ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Password <span className="text-primary">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field bg-[#faf9f7] ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Confirm Password <span className="text-primary">*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field bg-[#faf9f7] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-500">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ef5922] hover:bg-[#d94a1a] text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ef5922] mt-8 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  isLogin ? 'Sign In' : 'Register'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
