import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { showsAPI, moviesAPI } from '../../../services/api';

const ShowManagement = ({ theatreId, screenId }) => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    movie: '',
    show_time: new Date().toISOString().slice(0, 16), // Format: "YYYY-MM-DDThh:mm"
    available_seats: '',
    price_per_seat: '',
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
  }, [theatreId]);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await showsAPI.getShowsByTheatre(theatreId);
      setShows(response.data);
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Failed to fetch shows' });
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data);
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Failed to fetch movies' });
    }
  };

  const handleOpenDialog = (show = null) => {
    if (show) {
      setSelectedShow(show);
      setFormData({
        movie: show.movie._id,
        show_time: new Date(show.show_time).toISOString().slice(0, 16),
        available_seats: show.available_seats,
        price_per_seat: show.price_per_seat,
      });
    } else {
      setSelectedShow(null);
      setFormData({
        movie: '',
        show_time: new Date().toISOString().slice(0, 16),
        available_seats: '',
        price_per_seat: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShow(null);
    setFormData({
      movie: '',
      show_time: new Date().toISOString().slice(0, 16),
      available_seats: '',
      price_per_seat: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const showData = {
        ...formData,
        theatre: theatreId,
        screen: screenId,
      };

      if (selectedShow) {
        await showsAPI.updateShow(selectedShow._id, showData);
        setAlertMessage({ type: 'success', message: 'Show updated successfully' });
      } else {
        await showsAPI.addShow(showData);
        setAlertMessage({ type: 'success', message: 'Show added successfully' });
      }
      fetchShows();
      handleCloseDialog();
    } catch (error) {
      setAlertMessage({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to save show' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        setLoading(true);
        await showsAPI.deleteShow(showId);
        setAlertMessage({ type: 'success', message: 'Show deleted successfully' });
        fetchShows();
      } catch (error) {
        setAlertMessage({ type: 'error', message: 'Failed to delete show' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {alertMessage.message && (
        <Alert 
          severity={alertMessage.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlertMessage({ type: '', message: '' })}
        >
          {alertMessage.message}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add New Show
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Movie</TableCell>
              <TableCell>Show Time</TableCell>
              <TableCell>Available Seats</TableCell>
              <TableCell>Price per Seat</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shows.map((show) => (
              <TableRow key={show._id}>
                <TableCell>{show.movie.name}</TableCell>
                <TableCell>
                  {new Date(show.show_time).toLocaleString()}
                </TableCell>
                <TableCell>{show.available_seats}</TableCell>
                <TableCell>₹{show.price_per_seat}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(show)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(show._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedShow ? 'Edit Show' : 'Add New Show'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Movie"
                  value={formData.movie}
                  onChange={(e) => setFormData({ ...formData, movie: e.target.value })}
                  required
                >
                  {movies.map((movie) => (
                    <MenuItem key={movie._id} value={movie._id}>
                      {movie.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Show Time"
                  type="datetime-local"
                  value={formData.show_time}
                  onChange={(e) => setFormData({ ...formData, show_time: e.target.value })}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Available Seats"
                  type="number"
                  value={formData.available_seats}
                  onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price per Seat"
                  type="number"
                  value={formData.price_per_seat}
                  onChange={(e) => setFormData({ ...formData, price_per_seat: e.target.value })}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {selectedShow ? 'Update' : 'Add'} Show
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ShowManagement;