import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, LocationCity } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
];

const SelectLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city) => {
    localStorage.setItem('selectedCity', city);
    // Redirect to the previously attempted path or default to /movies
    const from = location.state?.from?.pathname || '/movies';
    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocationCity sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Select Your City
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose your city to see movie showtimes near you
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for your city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {filteredCities.map((city) => (
            <Grid item xs={12} sm={6} md={4} key={city}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
                onClick={() => handleCitySelect(city)}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 2
                  }}>
                    <LocationCity sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" component="div" align="center">
                      {city}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SelectLocation; 