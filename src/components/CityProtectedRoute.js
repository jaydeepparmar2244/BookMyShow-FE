import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CityProtectedRoute = ({ children }) => {
  const location = useLocation();
  const selectedCity = localStorage.getItem('selectedCity');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't enforce city selection for admin routes and the location selection page itself
  if (!isAdminRoute && !selectedCity && location.pathname !== '/select-location') {
    // Save the attempted path to redirect back after city selection
    return <Navigate to="/select-location" state={{ from: location }} replace />;
  }

  return children;
};

export default CityProtectedRoute; 