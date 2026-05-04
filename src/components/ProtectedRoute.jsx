import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // `user === undefined` means we're still reading the cached session (fast, <100ms)
  // `user === null`      means definitely logged out
  // `user === object`    means logged in
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5efe8]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ef5922]"></div>
      </div>
    );
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
