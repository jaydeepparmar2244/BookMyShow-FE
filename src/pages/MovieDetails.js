import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { showsAPI, bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TheatersIcon from '@mui/icons-material/Theaters';
import LanguageIcon from '@mui/icons-material/Language';
import StarIcon from '@mui/icons-material/Star';

const MovieHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "400px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-end",
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)",
  },
}));

const MovieInfo = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  color: "#fff",
  maxWidth: "800px",
}));

const ShowCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: "#495057",
  "& svg": {
    color: theme.palette.primary.main,
  },
}));

const BookingForm = ({ show, open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    show: show._id,
    number_of_seats: 1,
    show_date: new Date().toLocaleDateString('en-GB').split('/').join('-'), // Format: DD-MM-YYYY
    total_amount: show.price_per_seat,
    seats: ['A1'] // Default seat, will be updated based on number_of_seats
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (formData.number_of_seats < 1 || formData.number_of_seats > show.available_seats) {
      newErrors.number_of_seats = `Must be between 1 and ${show.available_seats}`;
    }
    if (!formData.show_date) newErrors.show_date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Update seats array when number_of_seats changes
      if (name === 'number_of_seats') {
        const numSeats = parseInt(value);
        const seats = [];
        for (let i = 1; i <= numSeats; i++) {
          seats.push(`A${i}`);
        }
        newData.seats = seats;
        newData.total_amount = numSeats * show.price_per_seat;
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const bookingData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          show: formData.show,
          number_of_seats: parseInt(formData.number_of_seats),
          show_date: formData.show_date,
          total_amount: formData.number_of_seats * show.price_per_seat,
          seats: formData.seats
        };
        
        const response = await bookingsAPI.createBooking(bookingData);
        if (response.success) {
          onSubmit(response.data);
        } else {
          setApiError(response.error || 'Failed to create booking');
        }
      } catch (error) {
        console.error('Booking error:', error);
        setApiError(error.response?.data?.error || 'Failed to create booking. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book Your Tickets</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Seats"
                name="number_of_seats"
                type="number"
                value={formData.number_of_seats}
                onChange={handleChange}
                error={!!errors.number_of_seats}
                helperText={errors.number_of_seats}
                required
                inputProps={{ min: 1, max: show.available_seats }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Show Date"
                name="show_date"
                type="text"
                value={formData.show_date}
                onChange={handleChange}
                error={!!errors.show_date}
                helperText={errors.show_date}
                required
                placeholder="DD-MM-YYYY"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                Total Amount: ₹{formData.number_of_seats * show.price_per_seat}
              </Alert>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          {isSubmitting ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (movieId && user?.city) {
      fetchMovieDetails();
    } else if (!user?.city) {
      setError("Please select a city to view movie details");
      setLoading(false);
    }
  }, [movieId, user?.city]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await showsAPI.getShowsByMovie(movieId, user.city);
      console.log("API Response:", response);
      
      if (response && response.data) {
        setMovieData(response.data);
      } else {
        setError("No shows available for this movie");
        setMovieData(null);
      }
    } catch (err) {
      console.error("Error in fetchMovieDetails:", err);
      setError(err.message || "Failed to fetch movie details");
      setMovieData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShowClick = (show) => {
    setSelectedShow(show);
    setBookingOpen(true);
  };

  const handleBookingClose = () => {
    setBookingOpen(false);
    setSelectedShow(null);
  };

  const handleBookingSuccess = async (booking) => {
    setBookingOpen(false);
    setSelectedShow(null);
    setSnackbarMessage('Booking successful!');
    setSnackbarOpen(true);
    
    // Refresh the shows list to update available seats
    await fetchMovieDetails();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={fetchMovieDetails}
            sx={{
              backgroundColor: "#000",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  if (!movieData) {
    return null;
  }

  const { movie, shows } = movieData;

  return (
    <Box sx={{ mb: 8 }}>
      <MovieHeader
        sx={{
          backgroundImage: `url(${movie.image})`,
        }}
      >
        <MovieInfo>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            {movie.movie_name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Chip
              icon={<StarIcon sx={{ color: "#ffd700" }} />}
              label={`${movie.rating} Rating`}
              sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
            />
            <Chip
              icon={<LanguageIcon />}
              label={movie.language}
              sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
            />
          </Stack>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {movie.description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {movie.genre?.map((genre, index) => (
              <Chip
                key={index}
                label={genre.trim()}
                sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              />
            ))}
          </Box>
        </MovieInfo>
      </MovieHeader>

      <Container>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
          }}
        >
          Available Shows
        </Typography>

        <Grid container spacing={4}>
          {shows.map((show) => (
            <Grid item xs={12} sm={6} md={4} key={show._id}>
              <ShowCard>
                <CardContent>
                  <InfoRow>
                    <TheatersIcon />
                    <Typography variant="body1">
                      <strong>{show.theatre_name}</strong> • {show.screen_name} ({show.screen_type})
                    </Typography>
                  </InfoRow>
                  <InfoRow>
                    <AccessTimeIcon />
                    <Typography variant="body1">
                      {show.show_time.start_time} - {show.show_time.end_time}
                    </Typography>
                  </InfoRow>
                  <InfoRow>
                    <EventSeatIcon />
                    <Typography variant="body1">
                      {show.available_seats} seats available • ₹{show.price_per_seat} per seat
                    </Typography>
                  </InfoRow>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      backgroundColor: "#000",
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                    onClick={() => handleShowClick(show)}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </ShowCard>
            </Grid>
          ))}
        </Grid>

        {shows.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No shows available at the moment
            </Typography>
          </Box>
        )}
      </Container>

      {selectedShow && (
        <BookingForm
          show={selectedShow}
          open={bookingOpen}
          onClose={handleBookingClose}
          onSubmit={handleBookingSuccess}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieDetails;
