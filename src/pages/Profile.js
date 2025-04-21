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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { bookingsAPI } from '../services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TheatersIcon from '@mui/icons-material/Theaters';
import MovieIcon from '@mui/icons-material/Movie';

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const BookingCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
  '& svg': {
    color: theme.palette.primary.main,
  },
}));

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data || []);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
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
      <ProfileHeader>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mr: 3,
            bgcolor: 'primary.main',
          }}
        >
          <MovieIcon sx={{ fontSize: 50 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your movie bookings
          </Typography>
        </Box>
      </ProfileHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert severity="info">
          You haven't made any bookings yet.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <BookingCard>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box
                        component="img"
                        src={booking.show.movie.image}
                        alt={booking.show.movie.movie_name}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography variant="h6" gutterBottom>
                        {booking.show.movie.movie_name}
                      </Typography>
                      <InfoRow>
                        <TheatersIcon />
                        <Typography>
                          {booking.show.theatre.theatre_name} • {booking.show.screen.screen_name}
                        </Typography>
                      </InfoRow>
                      <InfoRow>
                        <AccessTimeIcon />
                        <Typography>
                          {formatDate(booking.show_date)} at {formatTime(booking.show.show_time.start_time)}
                        </Typography>
                      </InfoRow>
                      <InfoRow>
                        <EventSeatIcon />
                        <Typography>
                          {booking.number_of_seats} seats • ₹{booking.total_amount}
                        </Typography>
                      </InfoRow>
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`Booking ID: ${booking._id}`}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`Booked on: ${formatDate(booking.createdAt)}`}
                          size="small"
                        />
                      </Box>
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

export default Profile; 