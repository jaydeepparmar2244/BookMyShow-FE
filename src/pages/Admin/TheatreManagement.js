import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Collapse,
  CircularProgress,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  LocalMovies,
  Email,
  Phone,
  LocationOn,
  Person,
  Screens as ScreensIcon,
  Theaters as TheatersIcon,
  ExpandMore as ExpandMoreIcon,
  Screen as ScreenIcon,
  Schedule as ScheduleIcon,
  TheaterComedy,
  AccessTime,
  Info,
  EventSeat,
  Stars,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { theatreAPI, screenAPI } from '../../services/api';
import ScreenManagement from './components/ScreenManagement';
import ShowManagement from './components/ShowManagement';
import ScreenForm from './components/ScreenForm';
import { DEFAULT_IMAGES } from '../../constants/defaultImages';

const FACILITIES = [
  "IMAX",
  "4DX",
  "Dolby Atmos",
  "VIP Lounge",
  "Recliner Seats",
  "Parking",
  "Food Court",
  "Wheelchair Accessible",
  "3D Screen",
  "Online Booking",
];

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: '#333333',
  },
  '&.MuiButton-contained': {
    boxShadow: 'none',
  }
}));

const TheatreForm = ({ theatre, onSubmit, onClose }) => {
  const [theatreFormData, setTheatreFormData] = useState({
    theatre_name: theatre?.theatre_name || '',
    location: theatre?.location || '',
    total_screens: theatre?.total_screens || '',
    contact_person: theatre?.contact_person || '',
    contact_number: theatre?.contact_number || '',
    contact_email: theatre?.contact_email || '',
    facilities: theatre?.facilities || [],
    seating_capacity: theatre?.seating_capacity || '',
    ratings: theatre?.ratings || 0,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;

    if (!theatreFormData.theatre_name.trim()) {
      newErrors.theatre_name = 'Theatre name is required';
    }

    if (!theatreFormData.location || theatreFormData.location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    }

    if (!theatreFormData.total_screens || theatreFormData.total_screens < 1 || theatreFormData.total_screens > 100) {
      newErrors.total_screens = 'Total screens must be between 1 and 100';
    }

    if (!theatreFormData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person name is required';
    }

    if (!phoneRegex.test(theatreFormData.contact_number)) {
      newErrors.contact_number = 'Enter a valid contact number';
    }

    if (!emailRegex.test(theatreFormData.contact_email)) {
      newErrors.contact_email = 'Enter a valid email address';
    }

    if (!theatreFormData.seating_capacity || theatreFormData.seating_capacity < 50 || theatreFormData.seating_capacity > 5000) {
      newErrors.seating_capacity = 'Seating capacity must be between 50 and 5000';
    }

    if (theatreFormData.ratings < 0 || theatreFormData.ratings > 5) {
      newErrors.ratings = 'Ratings must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'facilities') {
      setTheatreFormData(prev => ({
        ...prev,
        [name]: Array.isArray(value) ? value : []
      }));
      return;
    }

    if (['total_screens', 'seating_capacity', 'ratings'].includes(name)) {
      const numValue = value === '' ? '' : Number(value);
      setTheatreFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }

    setTheatreFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(theatreFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Theatre Name"
            name="theatre_name"
            value={theatreFormData.theatre_name}
            onChange={handleChange}
            error={!!errors.theatre_name}
            helperText={errors.theatre_name}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={theatreFormData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Screens"
            name="total_screens"
            type="number"
            value={theatreFormData.total_screens}
            onChange={handleChange}
            error={!!errors.total_screens}
            helperText={errors.total_screens}
            required
            inputProps={{ min: 1, max: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Seating Capacity"
            name="seating_capacity"
            type="number"
            value={theatreFormData.seating_capacity}
            onChange={handleChange}
            error={!!errors.seating_capacity}
            helperText={errors.seating_capacity}
            required
            inputProps={{ min: 50, max: 5000 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contact Person"
            name="contact_person"
            value={theatreFormData.contact_person}
            onChange={handleChange}
            error={!!errors.contact_person}
            helperText={errors.contact_person}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contact_number"
            value={theatreFormData.contact_number}
            onChange={handleChange}
            error={!!errors.contact_number}
            helperText={errors.contact_number}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Email"
            name="contact_email"
            type="email"
            value={theatreFormData.contact_email}
            onChange={handleChange}
            error={!!errors.contact_email}
            helperText={errors.contact_email}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Facilities</InputLabel>
            <Select
              multiple
              name="facilities"
              value={theatreFormData.facilities}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {FACILITIES.map((facility) => (
                <MenuItem key={facility} value={facility}>
                  {facility}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ratings"
            name="ratings"
            type="number"
            value={theatreFormData.ratings}
            onChange={handleChange}
            error={!!errors.ratings}
            helperText={errors.ratings}
            inputProps={{ min: 0, max: 5, step: 0.1 }}
          />
        </Grid>
      </Grid>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <StyledButton type="submit">
          {theatre ? 'Update Theatre' : 'Add Theatre'}
        </StyledButton>
      </DialogActions>
    </form>
  );
};

const TheatreManagement = () => {
  const [theatres, setTheatres] = useState([]);
  const [expandedTheatre, setExpandedTheatre] = useState(null);
  const [expandedScreen, setExpandedScreen] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [screenDialog, setScreenDialog] = useState({
    open: false,
    theatreId: null,
    theatreName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openScreenDialog, setOpenScreenDialog] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedTheatreId, setSelectedTheatreId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [theatreFormData, setTheatreFormData] = useState({
    theatre_name: '',
    location: '',
    total_screens: '',
    contact_person: '',
    contact_number: '',
    contact_email: '',
    facilities: [],
    seating_capacity: '',
    ratings: 0
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'facilities') {
      setTheatreFormData(prev => ({
        ...prev,
        [name]: Array.isArray(value) ? value : []
      }));
      return;
    }

    if (['total_screens', 'seating_capacity', 'ratings'].includes(name)) {
      const numValue = value === '' ? '' : Number(value);
      setTheatreFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }

    setTheatreFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      setLoading(true);
      const response = await theatreAPI.getAllTheatres();
      setTheatres(response.data);
    } catch (err) {
      setError('Failed to fetch theatres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheatre = async (theatreData) => {
    try {
      await theatreAPI.addTheatre(theatreData);
      setAlert({
        show: true,
        message: 'Theatre added successfully!',
        type: 'success',
      });
      setOpenDialog(false);
      fetchTheatres();
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Failed to add theatre',
        type: 'error',
      });
    }
  };

  const handleEditTheatre = async (theatreData) => {
    try {
      await theatreAPI.updateTheatre(selectedTheatre._id, theatreData);
      setAlert({
        show: true,
        message: 'Theatre updated successfully!',
        type: 'success',
      });
      setOpenDialog(false);
      setSelectedTheatre(null);
      fetchTheatres();
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || 'Failed to update theatre',
        type: 'error',
      });
    }
  };

  const handleDeleteTheatre = async (theatreId) => {
    if (window.confirm('Are you sure you want to delete this theatre?')) {
      try {
        await theatreAPI.deleteTheatre(theatreId);
        setAlert({
          show: true,
          message: 'Theatre deleted successfully!',
          type: 'success',
        });
        fetchTheatres();
      } catch (error) {
        setAlert({
          show: true,
          message: error.message || 'Failed to delete theatre',
          type: 'error',
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandTheatre = (theatreId) => {
    setExpandedTheatre(expandedTheatre === theatreId ? null : theatreId);
    setExpandedScreen(null);
  };

  const handleExpandScreen = (screenId) => {
    setExpandedScreen(expandedScreen === screenId ? null : screenId);
  };

  const handleOpenScreenDialog = (theatreId, screen = null) => {
    setSelectedTheatre(theatreId);
    setSelectedScreen(screen);
    setOpenScreenDialog(true);
  };

  const handleCloseScreenDialog = () => {
    setSelectedTheatre(null);
    setSelectedScreen(null);
    setOpenScreenDialog(false);
  };

  const handleEditScreen = (theatreId, screen) => {
    handleOpenScreenDialog(theatreId, screen);
  };

  const handleDeleteScreen = async (screenId) => {
    if (!window.confirm('Are you sure you want to delete this screen?')) {
      return;
    }

    try {
      setLoading(true);
      await screenAPI.deleteScreen(screenId);
      await fetchTheatres();
      setError(null);
    } catch (err) {
      setError('Failed to delete screen');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenSubmit = async (screenData) => {
    try {
      setLoading(true);
      if (selectedScreen) {
        await screenAPI.updateScreen(selectedScreen._id, {
          ...screenData,
          theatre_id: selectedTheatre
        });
      } else {
        await screenAPI.addScreen({
          ...screenData,
          theatre_id: selectedTheatre
        });
      }
      await fetchTheatres();
      handleCloseScreenDialog();
      setError(null);
    } catch (err) {
      setError('Failed to save screen');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (event) => {
    event.target.src = DEFAULT_IMAGES.THEATRE;
  };

  const handleScreenImageError = (event) => {
    event.target.src = DEFAULT_IMAGES.SCREEN;
  };

  const handleOpenDialog = (theatre = null) => {
    if (theatre) {
      setSelectedTheatre(theatre);
      setTheatreFormData({
        theatre_name: theatre.theatre_name,
        location: theatre.location,
        total_screens: theatre.total_screens,
        contact_person: theatre.contact_person,
        contact_number: theatre.contact_number,
        contact_email: theatre.contact_email,
        facilities: theatre.facilities || [],
        seating_capacity: theatre.seating_capacity,
        ratings: theatre.ratings || 0
      });
    } else {
      setSelectedTheatre(null);
      setTheatreFormData({
        theatre_name: '',
        location: '',
        total_screens: '',
        contact_person: '',
        contact_number: '',
        contact_email: '',
        facilities: [],
        seating_capacity: '',
        ratings: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTheatre(null);
    setTheatreFormData({
      theatre_name: '',
      location: '',
      total_screens: '',
      contact_person: '',
      contact_number: '',
      contact_email: '',
      facilities: [],
      seating_capacity: '',
      ratings: 0
    });
  };

  const handleTheatreSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      if (selectedTheatre) {
        await theatreAPI.updateTheatre(selectedTheatre._id, theatreFormData);
        setAlert({
          show: true,
          message: 'Theatre updated successfully!',
          type: 'success'
        });
      } else {
        await theatreAPI.addTheatre(theatreFormData);
        setAlert({
          show: true,
          message: 'Theatre added successfully!',
          type: 'success'
        });
      }
      fetchTheatres();
      handleCloseDialog();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Failed to save theatre',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;

    if (!theatreFormData.theatre_name.trim()) {
      errors.theatre_name = 'Theatre name is required';
    }

    if (!theatreFormData.location || theatreFormData.location.length < 3) {
      errors.location = 'Location must be at least 3 characters long';
    }

    if (!theatreFormData.total_screens || theatreFormData.total_screens < 1 || theatreFormData.total_screens > 100) {
      errors.total_screens = 'Total screens must be between 1 and 100';
    }

    if (!theatreFormData.contact_person.trim()) {
      errors.contact_person = 'Contact person name is required';
    }

    if (!phoneRegex.test(theatreFormData.contact_number)) {
      errors.contact_number = 'Enter a valid contact number';
    }

    if (!emailRegex.test(theatreFormData.contact_email)) {
      errors.contact_email = 'Enter a valid email address';
    }

    if (!theatreFormData.seating_capacity || theatreFormData.seating_capacity < 50 || theatreFormData.seating_capacity > 5000) {
      errors.seating_capacity = 'Seating capacity must be between 50 and 5000';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Theatre Management
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Theatre
        </StyledButton>
      </Box>

      {alert.show && (
        <Alert 
          severity={alert.type}
          sx={{ mb: 4 }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {theatres.map((theatre) => (
          <Grid item xs={12} key={theatre._id}>
            <Paper 
              elevation={2} 
              sx={{ 
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {theatre.theatre_name}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Typography variant="body2">
                            <LocationOn sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            {theatre.location}
                          </Typography>
                          <Typography variant="body2">
                            <TheaterComedy sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            Total Screens: {theatre.total_screens}
                          </Typography>
                          <Typography variant="body2">
                            <Person sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            {theatre.contact_person}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Typography variant="body2">
                            <Phone sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            {theatre.contact_number}
                          </Typography>
                          <Typography variant="body2">
                            <Email sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            {theatre.contact_email}
                          </Typography>
                          <Typography variant="body2">
                            <EventSeat sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            Capacity: {theatre.seating_capacity}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    alignItems: 'flex-start',
                    height: 'fit-content'
                  }}>
                    <IconButton 
                      onClick={() => handleOpenDialog(theatre)}
                      size="small"
                      sx={{ 
                        padding: '6px',
                        height: '32px',
                        width: '32px',
                        '&:hover': { 
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteTheatre(theatre._id)}
                      size="small"
                      sx={{ 
                        padding: '6px',
                        height: '32px',
                        width: '32px',
                        '&:hover': { 
                          backgroundColor: 'rgba(255, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Accordion 
                sx={{ 
                  '&:before': {
                    display: 'none',
                  },
                  boxShadow: 'none',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'grey.50',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Screens
                    </Typography>
                    <Chip 
                      label={`${theatre.screens?.length || 0} screens`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  {theatre.screens?.length > 0 ? (
                    <Grid container spacing={2}>
                      {theatre.screens.map((screen) => (
                        <Grid item xs={12} md={6} lg={4} key={screen._id}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              backgroundColor: 'white'
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography variant="h6">
                                {screen.screen_name}
                              </Typography>
                              <Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditScreen(theatre._id, screen)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteScreen(screen._id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Type: {screen.screen_type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Capacity: {screen.seating_capacity}
                            </Typography>
                            {screen.facilities?.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  Facilities:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {screen.facilities.map((facility, index) => (
                                    <Chip
                                      key={index}
                                      label={facility}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography color="text.secondary">
                        No screens added yet
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenScreenDialog(theatre._id)}
                        sx={{ mt: 1 }}
                      >
                        Add Screen
                      </Button>
                    </Box>
                  )}
                  {theatre.screens?.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenScreenDialog(theatre._id)}
                      >
                        Add Screen
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { p: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 3 }}>
          <Typography variant="h5" component="div">
            {selectedTheatre ? 'Edit Theatre' : 'Add New Theatre'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleTheatreSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Theatre Name"
                  name="theatre_name"
                  value={theatreFormData.theatre_name}
                  onChange={handleChange}
                  error={!!formErrors.theatre_name}
                  helperText={formErrors.theatre_name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={theatreFormData.location}
                  onChange={handleChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Screens"
                  name="total_screens"
                  type="number"
                  value={theatreFormData.total_screens}
                  onChange={handleChange}
                  error={!!formErrors.total_screens}
                  helperText={formErrors.total_screens}
                  required
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Seating Capacity"
                  name="seating_capacity"
                  type="number"
                  value={theatreFormData.seating_capacity}
                  onChange={handleChange}
                  error={!!formErrors.seating_capacity}
                  helperText={formErrors.seating_capacity}
                  required
                  inputProps={{ min: 50, max: 5000 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  name="contact_person"
                  value={theatreFormData.contact_person}
                  onChange={handleChange}
                  error={!!formErrors.contact_person}
                  helperText={formErrors.contact_person}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact_number"
                  value={theatreFormData.contact_number}
                  onChange={handleChange}
                  error={!!formErrors.contact_number}
                  helperText={formErrors.contact_number}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  value={theatreFormData.contact_email}
                  onChange={handleChange}
                  error={!!formErrors.contact_email}
                  helperText={formErrors.contact_email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.facilities}>
                  <InputLabel>Facilities</InputLabel>
                  <Select
                    multiple
                    name="facilities"
                    value={theatreFormData.facilities}
                    onChange={handleChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {FACILITIES.map((facility) => (
                      <MenuItem key={facility} value={facility}>
                        {facility}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.facilities && (
                    <FormHelperText>{formErrors.facilities}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <StyledButton
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                selectedTheatre ? 'Update Theatre' : 'Add Theatre'
              )}
            </StyledButton>
          </DialogActions>
        </form>
      </Dialog>

      <ScreenForm
        open={openScreenDialog}
        onClose={handleCloseScreenDialog}
        onSubmit={handleScreenSubmit}
        screen={selectedScreen}
        theatreId={selectedTheatre}
      />
    </Box>
  );
};

export default TheatreManagement; 