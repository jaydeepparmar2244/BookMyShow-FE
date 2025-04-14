import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const showTimeId = searchParams.get('showTime');
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState(null);
  const [showTime, setShowTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Here you would fetch movie and show time details from your API
    // For now, we'll use dummy data
    setMovie({
      id,
      title: 'Inception',
      imageUrl: 'https://via.placeholder.com/300x450',
    });

    setShowTime({
      id: showTimeId,
      time: '10:00 AM',
      theater: 'PVR Cinemas',
      price: 200,
    });
  }, [id, showTimeId]);

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seatsPerRow = 10;
    const seats = [];

    rows.forEach(row => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatNumber = `${row}${i}`;
        // Randomly mark some seats as booked
        const isBooked = Math.random() < 0.3;
        rowSeats.push({
          id: seatNumber,
          number: seatNumber,
          isBooked,
        });
      }
      seats.push(rowSeats);
    });

    return seats;
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) {
        return prev.filter(id => id !== seat.id);
      }
      return [...prev, seat.id];
    });
  };

  const handleBooking = () => {
    // Here you would make an API call to book the seats
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    // Here you would handle the payment and confirmation
    navigate('/movies');
  };

  if (!movie || !showTime) {
    return <Typography>Loading...</Typography>;
  }

  const seats = generateSeats();
  const totalAmount = selectedSeats.length * showTime.price;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {movie.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {showTime.theater} - {showTime.time}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Screen
          </Typography>
          <Box
            sx={{
              height: '4px',
              backgroundColor: 'primary.main',
              width: '100%',
              maxWidth: 600,
              margin: '0 auto',
            }}
          />
        </Box>

        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          {seats.map((row, index) => (
            <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
              {row.map((seat) => (
                <Grid item key={seat.id}>
                  <WeekendIcon
                    sx={{
                      fontSize: 32,
                      cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                      color: seat.isBooked
                        ? 'text.disabled'
                        : selectedSeats.includes(seat.id)
                        ? 'primary.main'
                        : 'action.active',
                      '&:hover': {
                        color: !seat.isBooked && 'primary.main',
                      },
                    }}
                    onClick={() => handleSeatClick(seat)}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Selected Seats
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedSeats.map((seat) => (
            <Chip key={seat} label={seat} color="primary" />
          ))}
        </Box>
      </Box>

      <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Total Amount</Typography>
          <Typography variant="h4">₹{totalAmount}</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          disabled={selectedSeats.length === 0}
          onClick={handleBooking}
        >
          Proceed to Pay
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Booking Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to book {selectedSeats.length} seat(s) for {movie.title}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Amount: ₹{totalAmount}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingPage; 