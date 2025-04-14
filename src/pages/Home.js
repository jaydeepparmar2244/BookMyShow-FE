import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieList from './MovieList';

const Home = () => {
  const navigate = useNavigate();
  const selectedCity = localStorage.getItem('selectedCity');

  useEffect(() => {
    if (!selectedCity) {
      navigate('/select-location');
    }
  }, [selectedCity, navigate]);

  if (!selectedCity) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <MovieList />;
};

export default Home; 