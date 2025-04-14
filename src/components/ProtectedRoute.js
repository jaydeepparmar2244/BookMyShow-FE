import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const selectedCity = localStorage.getItem('selectedCity');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/movies" replace />;
  }

  // Only check for city selection on non-admin routes
  if (!isAdminRoute && !selectedCity && location.pathname !== '/select-location') {
    return <Navigate to="/select-location" replace />;
  }

  return children;
};

export default ProtectedRoute; 