import React, { useEffect } from 'react';
import { Box, CircularProgress, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShowsList from './ShowsList';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Home = () => {
  const navigate = useNavigate();
  const selectedCity = localStorage.getItem('selectedCity');

  if (!selectedCity) {
    return (
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            gap: 3
          }}
        >
          <LocationOnIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Select Your City
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please select your city to view available shows and movies
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<LocationOnIcon />}
            onClick={() => navigate('/select-location')}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              borderRadius: '8px'
            }}
          >
            Choose Location
          </Button>
        </Box>
      </Container>
    );
  }

  return <ShowsList />;
};

export default Home; 