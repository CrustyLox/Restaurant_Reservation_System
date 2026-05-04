import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import MyBookings from './pages/MyBookings';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// Layout wrapper for authenticated routes
const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/restaurant/:id" element={
              <ProtectedRoute>
                <AppLayout><RestaurantDetail /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <AppLayout><MyBookings /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/search" element={
              <ProtectedRoute>
                <AppLayout><Search /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/favorites" element={
              <ProtectedRoute>
                <AppLayout><Favorites /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={
              <AppLayout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
                  <button onClick={() => window.history.back()} className="btn-primary">
                    Go Back
                  </button>
                </div>
              </AppLayout>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
