import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const CityProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Always allow access to select-location page
  if (location.pathname === '/select-location') {
    return children;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect to select-location if no city is selected and not already on select-location page
  if (!user?.city && location.pathname !== '/select-location') {
    return <Navigate to="/select-location" state={{ from: location }} replace />;
  }

  return children;
};

export default CityProtectedRoute; 