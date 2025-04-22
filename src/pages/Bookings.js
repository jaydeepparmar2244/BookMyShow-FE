import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { bookingsAPI } from '../services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';
import { useNavigate } from 'react-router-dom';

const BookingsHeader = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(3),
    '& .MuiAvatar-root': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const BookingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  '& svg': {
    color: theme.palette.primary.main,
    fontSize: '1.2rem',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "confirmed"
      ? "#4caf50"
      : status === "cancelled"
      ? theme.palette.error.main
      : theme.palette.warning.main,
  color: "#ffffff",
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  "& .MuiChip-label": {
    color: "#ffffff",
    fontSize: '0.9rem',
  },
}));

const Bookings = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookingsAPI.getUserBookings();
      setBookings(data || []); // Ensure we always set an array
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BookingsHeader elevation={3}>
        <Avatar
          sx={{
            width: isMobile ? 80 : 100,
            height: isMobile ? 80 : 100,
            mr: isMobile ? 0 : 3,
            bgcolor: 'primary.main',
            boxShadow: theme.shadows[2],
          }}
        >
          <MovieIcon sx={{ fontSize: isMobile ? 40 : 50 }} />
        </Avatar>
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            My Bookings
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            View and manage your movie bookings
          </Typography>
        </Box>
      </BookingsHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          You haven't made any bookings yet.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <BookingCard>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={booking.show?.movie?.image}
                        alt={booking.show?.movie?.movie_name}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          objectFit: 'cover',
                          boxShadow: theme.shadows[2],
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 2 : 0,
                        mb: 2,
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {booking.show?.movie?.movie_name}
                        </Typography>
                        <StatusChip 
                          label={booking.status} 
                          status={booking.status}
                        />
                      </Box>
                      <InfoRow>
                        <TheatersIcon />
                        <Typography variant="body1">
                          {booking.show?.theatre?.theatre_name} • {booking.show?.screen?.screen_name}
                        </Typography>
                      </InfoRow>
                      <InfoRow>
                        <AccessTimeIcon />
                        <Typography variant="body1">
                          {booking.show_date} at {booking.show?.show_time?.start_time} - {booking.show?.show_time?.end_time}
                        </Typography>
                      </InfoRow>
                      <InfoRow>
                        <EventSeatIcon />
                        <Typography variant="body1">
                          {booking.number_of_seats} seats • ₹{booking.total_amount}
                        </Typography>
                      </InfoRow>
                      <Box sx={{ 
                        mt: 3, 
                        display: 'flex', 
                        gap: 1,
                        flexWrap: 'wrap',
                        mb: 2,
                      }}>
                        <Chip
                          label={`Booking ID: ${booking._id}`}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Chip
                          label={`Booked on: ${formatDate(booking.createdAt)}`}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.text.secondary,
                          }}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleViewMovie(booking.show?.movie?._id)}
                        fullWidth={isMobile}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        View Movie Details
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </BookingCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Bookings; 