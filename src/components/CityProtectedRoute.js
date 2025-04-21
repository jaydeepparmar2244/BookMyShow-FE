import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const CityProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("CityProtectedRoute - Current user:", user);
    console.log("CityProtectedRoute - Is authenticated:", isAuthenticated());
    console.log("CityProtectedRoute - Is loading:", isLoading);
  }, [user, isAuthenticated, isLoading]);

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
    console.log("CityProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect to select-location if no city is selected and not already on select-location page
  if (!user?.city && location.pathname !== '/select-location') {
    console.log("CityProtectedRoute - No city selected, redirecting to select-location");
    return <Navigate to="/select-location" state={{ from: location }} replace />;
  }

  return children;
};

export default CityProtectedRoute; 