import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Search as SearchIcon, LocationCity } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MumbaiIcon from "../assets/mumbai.png";
import DelhiIcon from "../assets/delhi.png";
import BangaloreIcon from "../assets/bangalore.png";
import ChennaiIcon from "../assets/chennai.png";
import KolkataIcon from "../assets/kolkata.png";
import HyderabadIcon from "../assets/hyderabad.png";
import AhmedabadIcon from "../assets/ahmedabad.png";
import JaipurIcon from "../assets/jaipur.png";
import PuneIcon from "../assets/pune.png";

const cities = [
  { city: "Mumbai", icon: MumbaiIcon },
  { city: "Delhi", icon: DelhiIcon },
  { city: "Bangalore", icon: BangaloreIcon },
  { city: "Chennai", icon: ChennaiIcon },
  { city: "Kolkata", icon: KolkataIcon },
  { city: "Hyderabad", icon: HyderabadIcon },
  { city: "Ahmedabad", icon: AhmedabadIcon },
  { city: "Jaipur", icon: JaipurIcon },
  { city: "Pune", icon: PuneIcon },
];

const SelectLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCity, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user already has a city selected
    if (user?.city) {
      const from = location.state?.from?.pathname || "/movies";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const filteredCities = cities.filter((city) =>
    city?.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city) => {
    console.log("Selected city:", city);
    console.log("Current user:", user);
    
    // Update city in AuthContext
    updateCity(city);
    
    // Redirect to the previously attempted path or default to /movies
    const from = location.state?.from?.pathname || "/movies";
    console.log("Navigating to:", from);
    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <LocationCity sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
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
            <Grid item xs={12} sm={6} md={4} key={city.city}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out",
                  },
                }}
                onClick={() => handleCitySelect(city.city)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={city.icon}
                      alt={city.city}
                      style={{ width: "64px", height: "64px", marginBottom: "8px" }}
                    />
                    <Typography variant="h6">{city.city}</Typography>
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
