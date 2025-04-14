import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Paper,
  Button,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Divider,
  CircularProgress,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PublicIcon from '@mui/icons-material/Public';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(45deg, #f5f5f5 0%, #ffffff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const ModalCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 1000,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: 600,
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: '0 0 40%',
  backgroundColor: '#000000',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: '1',
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

const SearchBox = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    height: '52px',
    border: '2px solid #000000',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused': {
      border: '2px solid #000000',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '16px',
    color: '#000000',
    '&::placeholder': {
      color: '#666666',
      opacity: 1,
    },
  },
}));

const CityCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  '&:hover': {
    backgroundColor: '#000000',
    color: '#ffffff',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    '& .city-name': {
      color: '#ffffff',
    },
    '& .city-icon': {
      color: '#ffffff',
    },
  },
}));

const DetectLocationButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: 'transparent',
  border: '2px solid #ffffff',
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    backgroundColor: '#ffffff',
    color: '#000000',
  },
}));

// New styled components for the expanded city list
const ExpandedCityList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: '#f8f8f8',
  borderRadius: 16,
  border: '1px solid #e0e0e0',
}));

const CityListItem = styled(Button)(({ theme }) => ({
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1.5),
  color: '#000000',
  textTransform: 'none',
  borderRadius: 8,
  '&:hover': {
    backgroundColor: '#000000',
    color: '#ffffff',
  },
}));

const LocationSelector = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showAllCities, setShowAllCities] = useState(false);

  // Extended city list
  const allCities = [
    // Popular cities
    { id: 1, name: 'Mumbai', state: 'Maharashtra' },
    { id: 2, name: 'Delhi-NCR', state: 'Delhi' },
    { id: 3, name: 'Bengaluru', state: 'Karnataka' },
    { id: 4, name: 'Hyderabad', state: 'Telangana' },
    { id: 5, name: 'Chandigarh', state: 'Chandigarh' },
    { id: 6, name: 'Ahmedabad', state: 'Gujarat' },
    { id: 7, name: 'Chennai', state: 'Tamil Nadu' },
    { id: 8, name: 'Pune', state: 'Maharashtra' },
    { id: 9, name: 'Kolkata', state: 'West Bengal' },
    { id: 10, name: 'Kochi', state: 'Kerala' },
    // Additional cities
    { id: 11, name: 'Jaipur', state: 'Rajasthan' },
    { id: 12, name: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 13, name: 'Indore', state: 'Madhya Pradesh' },
    { id: 14, name: 'Bhopal', state: 'Madhya Pradesh' },
    { id: 15, name: 'Nagpur', state: 'Maharashtra' },
    { id: 16, name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { id: 17, name: 'Bhubaneswar', state: 'Odisha' },
    { id: 18, name: 'Goa', state: 'Goa' },
    { id: 19, name: 'Dehradun', state: 'Uttarakhand' },
    { id: 20, name: 'Surat', state: 'Gujarat' },
    // Add more cities as needed
  ];

  // Popular cities (first 10)
  const popularCities = allCities.slice(0, 10);

  // Filter cities based on search query
  const filteredCities = allCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle city selection
  const handleCitySelect = (cityName) => {
    localStorage.setItem('selectedCity', cityName);
    navigate('/movies');
  };

  // Handle location detection
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      // Use reverse geocoding to get city name
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const city = data.results[0].components.city || 
                    data.results[0].components.town ||
                    data.results[0].components.state_district;
        
        if (city) {
          localStorage.setItem('selectedCity', city);
          navigate('/movies');
        } else {
          setLocationError('Could not determine your city. Please select manually.');
        }
      }
    } catch (error) {
      if (error.code === 1) {
        setLocationError('Location permission denied. Please enable location access or select city manually.');
      } else if (error.code === 2) {
        setLocationError('Location unavailable. Please select your city manually.');
      } else {
        setLocationError('Error detecting location. Please select your city manually.');
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <StyledContainer maxWidth="xl">
      <ModalCard elevation={0}>
        <LeftPanel>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <LocalMoviesIcon sx={{ color: 'white', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                MovieTic
              </Typography>
            </Box>
            
            <Typography variant="h3" sx={{ 
              color: 'white', 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
              Select Your Location
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#999999', mb: 4 }}>
              Choose your city to discover movies playing in theaters near you
            </Typography>

            <Box>
              <DetectLocationButton
                startIcon={isDetectingLocation ? 
                  <CircularProgress size={20} color="inherit" /> : 
                  <MyLocationIcon />
                }
                fullWidth
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
              >
                {isDetectingLocation ? 'Detecting location...' : 'Detect my location'}
              </DetectLocationButton>

              {locationError && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ff4444',
                    mt: 2,
                    textAlign: 'center'
                  }}
                >
                  {locationError}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
              Why select location?
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              Get personalized movie suggestions and up-to-date showtimes for theaters in your area.
            </Typography>
          </Box>
        </LeftPanel>

        <RightPanel>
          <SearchBox
            fullWidth
            placeholder="Search for your city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#000000' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Show filtered results if searching, otherwise show popular cities */}
          {searchQuery ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Search Results
              </Typography>
              <Grid container spacing={2}>
                {filteredCities.map((city) => (
                  <Grid item xs={12} sm={6} key={city.id}>
                    <CityListItem
                      onClick={() => handleCitySelect(city.name)}
                      startIcon={<LocationOnIcon />}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {city.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {city.state}
                        </Typography>
                      </Box>
                    </CityListItem>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <>
              <Box sx={{ mt: 4, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Popular Cities
                </Typography>
                <Grid container spacing={2}>
                  {popularCities.map((city) => (
                    <Grid item xs={6} sm={4} md={4} key={city.id}>
                      <CityCard 
                        onClick={() => handleCitySelect(city.name)}
                        elevation={0}
                      >
                        <Box className="city-icon">
                          <PublicIcon />
                        </Box>
                        <Typography
                          variant="body1"
                          className="city-name"
                          sx={{ fontWeight: 500 }}
                        >
                          {city.name}
                        </Typography>
                      </CityCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Button
                onClick={() => setShowAllCities(!showAllCities)}
                endIcon={showAllCities ? 
                  <KeyboardArrowUpIcon /> : 
                  <ArrowForwardIcon />
                }
                sx={{
                  color: '#000000',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                {showAllCities ? 'Show Less' : 'View All Cities'}
              </Button>

              <Collapse in={showAllCities}>
                <ExpandedCityList>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    All Cities
                  </Typography>
                  <Grid container spacing={2}>
                    {allCities.slice(10).map((city) => (
                      <Grid item xs={12} sm={6} key={city.id}>
                        <CityListItem
                          onClick={() => handleCitySelect(city.name)}
                          startIcon={<LocationOnIcon />}
                        >
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {city.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {city.state}
                            </Typography>
                          </Box>
                        </CityListItem>
                      </Grid>
                    ))}
                  </Grid>
                </ExpandedCityList>
              </Collapse>
            </>
          )}
        </RightPanel>
      </ModalCard>
    </StyledContainer>
  );
};

export default LocationSelector; 