import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Rating,
  OutlinedInput,
  ListItemText,
  Checkbox,
  FormHelperText,
  CardMedia,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  CloudUpload as CloudUploadIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { moviesAPI } from "../../services/api";
import { FALLBACK_IMAGES } from '../../constants/images';
import { DEFAULT_IMAGES } from '../../constants/defaultImages';
import axios from "axios";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary"
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
  "Other"
];

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const MovieCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.spacing(1),
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Styled component for hidden file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const MovieFormDialog = ({ open, handleClose, selectedMovie, handleSubmit }) => {
  const [formData, setFormData] = useState({
    movie_name: '',
    release_date: '',
    genre: [],
    description: '',
    language: '',
    rating: 0,
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedMovie) {
      setFormData({
        movie_name: selectedMovie.movie_name || '',
        release_date: selectedMovie.release_date ? new Date(selectedMovie.release_date).toISOString().split('T')[0] : '',
        genre: selectedMovie.genre || [],
        description: selectedMovie.description || '',
        language: selectedMovie.language || '',
        rating: selectedMovie.rating || 0,
        image: null
      });
      setImagePreview(selectedMovie.image || '');
    } else {
      setFormData({
        movie_name: '',
        release_date: '',
        genre: [],
        description: '',
        language: '',
        rating: 0,
        image: null
      });
      setImagePreview('');
    }
  }, [selectedMovie]);

  const validateForm = () => {
    const newErrors = {};

    // Movie name validation
    if (!formData.movie_name.trim()) {
      newErrors.movie_name = 'Movie name is required';
    }

    // Release date validation
    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    }

    // Genre validation
    if (!formData.genre.length) {
      newErrors.genre = 'Genre is required';
    } else {
      const invalidGenres = formData.genre.filter(g => !GENRES.includes(g));
      if (invalidGenres.length) {
        newErrors.genre = 'Invalid genre selected';
      }
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    // Language validation
    if (!formData.language) {
      newErrors.language = 'Language is required';
    } else if (!LANGUAGES.includes(formData.language)) {
      newErrors.language = 'Invalid language selected';
    }

    // Rating validation
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    // Image validation
    if (!selectedMovie && !formData.image) {
      newErrors.image = 'Movie poster is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Only JPG, PNG and WEBP formats are allowed'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'File size should be less than 5MB'
        }));
        return;
      }

      // Create a new File object with explicit type
      const imageFile = new File([file], file.name, {
        type: file.type,
      });

      setFormData(prev => ({
        ...prev,
        image: imageFile
      }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));

      // Log for debugging
      console.log('Image file:', imageFile);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview('');
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    
    // Append basic fields
    formDataToSend.append('movie_name', formData.movie_name.trim());
    formDataToSend.append('release_date', formData.release_date);
    // Don't stringify genre array for FormData
    formData.genre.forEach((g, index) => {
      formDataToSend.append(`genre[${index}]`, g);
    });
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('language', formData.language);
    formDataToSend.append('rating', formData.rating);

    // Handle image
    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    } else if (selectedMovie && !formData.image) {
      // If editing and no new image, don't send image field at all
      // Let the backend keep the existing image
    }

    // Debug log
    console.log('FormData contents:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    handleSubmit(formDataToSend);
  };

  const ImageUploadSection = () => (
    <Stack spacing={2} alignItems="center">
      {imagePreview ? (
        <Box
          sx={{
            width: '100%',
            height: 200,
            position: 'relative',
            borderRadius: 1,
            overflow: 'hidden',
            boxShadow: 1
          }}
        >
          <CardMedia
            component="img"
            image={imagePreview}
            alt="Movie poster preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%'
            }}
          >
            <Tooltip title="Remove image">
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{ color: 'white' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 200,
            borderRadius: 1,
            bgcolor: 'grey.50',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: errors.image ? 'error.main' : 'grey.300',
            transition: 'border-color 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              cursor: 'pointer'
            }
          }}
        >
          <CloudUploadIcon 
            sx={{ 
              fontSize: 40, 
              color: errors.image ? 'error.main' : 'grey.500',
              mb: 1
            }} 
          />
          <Typography 
            variant="body1" 
            color={errors.image ? 'error' : 'text.secondary'}
          >
            Click to upload movie poster
          </Typography>
        </Box>
      )}

      <Stack spacing={1} alignItems="center" width="100%">
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          color={errors.image ? 'error' : 'primary'}
          sx={{
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          {imagePreview ? 'Change Poster' : 'Upload Poster'}
          <VisuallyHiddenInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
          />
        </Button>

        <Typography 
          variant="caption" 
          color="text.secondary"
          align="center"
        >
          Supported formats: JPG, PNG, WEBP
          <br />
          Recommended size: 500x750 pixels
        </Typography>

        {errors.image && (
          <Typography 
            variant="caption" 
            color="error" 
            align="center"
          >
            {errors.image}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Movie Name"
                value={formData.movie_name}
                onChange={(e) => setFormData(prev => ({ ...prev, movie_name: e.target.value }))}
                error={!!errors.movie_name}
                helperText={errors.movie_name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Release Date"
                value={formData.release_date}
                onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                error={!!errors.release_date}
                helperText={errors.release_date}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.language} required>
                <InputLabel>Language</InputLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  label="Language"
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
                {errors.language && (
                  <FormHelperText>{errors.language}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.genre} required>
                <InputLabel>Genre</InputLabel>
                <Select
                  multiple
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  input={<OutlinedInput label="Genre" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {GENRES.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      <Checkbox checked={formData.genre.indexOf(genre) > -1} />
                      <ListItemText primary={genre} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.genre && (
                  <FormHelperText>{errors.genre}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                error={!!errors.description}
                helperText={errors.description || `${formData.description.length}/500 characters`}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={Number(formData.rating)}
                precision={0.5}
                onChange={(_, value) => setFormData(prev => ({ ...prev, rating: value }))}
              />
              {errors.rating && (
                <Typography color="error" variant="caption">
                  {errors.rating}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <ImageUploadSection />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {selectedMovie ? 'Update' : 'Add'} Movie
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    genre: '',
    language: '',
    releaseDate: '',
    rating: '',
    poster: '',
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAllMovies();
      console.log('Movie data example:', response.data[0]);
      setMovies(response.data || []);
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (movie = null) => {
    if (movie) {
      setSelectedMovie(movie);
      setFormData(movie);
    } else {
      setSelectedMovie(null);
      setFormData({
        name: '',
        description: '',
        duration: '',
        genre: '',
        language: '',
        releaseDate: '',
        rating: '',
        poster: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovie(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (selectedMovie) {
        await moviesAPI.updateMovie(selectedMovie._id, formData);
      } else {
        await moviesAPI.addMovie(formData);
      }
      fetchMovies();
      handleCloseDialog();
    } catch (err) {
      console.error('Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to save movie');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        setLoading(true);
        await moviesAPI.deleteMovie(movieId);
        fetchMovies();
      } catch (err) {
        setError('Failed to delete movie');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageError = (event) => {
    event.target.src = FALLBACK_IMAGES.MOVIE_POSTER;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Movie Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: 'black',
            '&:hover': { bgcolor: 'grey.800' },
          }}
        >
          Add Movie
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} md={6} lg={4} key={movie._id}>
            <MovieCard 
              elevation={1}
              sx={{ 
                p: 3,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fff',
                '&:hover': {
                  boxShadow: 2
                }
              }}
            >
              {/* Movie Image */}
              <Box 
                sx={{ 
                  width: '100%',
                  height: 200,
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden',
                  bgcolor: '#f5f5f5'
                }}
              >
                <img
                  src={movie.image}
                  alt={movie.movie_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/default-movie.jpg';
                  }}
                />
              </Box>

                {/* Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                  mb: 2,
                  fontSize: '1.25rem'
                  }}
                >
                  {movie.movie_name}
                </Typography>

                {/* Genres */}
              <Box sx={{ mb: 2 }}>
                  {movie.genre.map((g, index) => (
                    <Chip
                      key={index}
                      label={g}
                      size="small"
                      sx={{ 
                      mr: 1,
                      mb: 1,
                      bgcolor: '#f5f5f5',
                      color: '#333',
                        fontWeight: 500,
                      height: 28,
                      '& .MuiChip-label': {
                        px: 1.5
                      }
                      }}
                    />
                  ))}
                </Box>

              {/* Info List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Language */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                      {movie.language}
                    </Typography>
                </Box>

                {/* Release Date */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                </Box>
              </Box>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{
                  mt: 2,
                  mb: 3,
                  color: 'text.secondary',
                  lineHeight: 1.6
                  }}
                >
                  {movie.description}
                </Typography>

              {/* Actions */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                  gap: 2,
                  mt: 'auto',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                  }}
                >
                  <Button
                  startIcon={<EditIcon sx={{ fontSize: '1.2rem' }} />}
                    onClick={() => handleOpenDialog(movie)}
                    sx={{
                    color: '#000',
                      textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 0,
                    p: 0,
                    '&:hover': {
                      bgcolor: 'transparent',
                      opacity: 0.7
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon sx={{ fontSize: '1.2rem' }} />}
                  onClick={() => handleDelete(movie._id)}
                  sx={{
                    color: '#d32f2f',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 0,
                    p: 0,
                    '&:hover': {
                      bgcolor: 'transparent',
                      opacity: 0.7
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </MovieCard>
          </Grid>
        ))}
      </Grid>

      <MovieFormDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        selectedMovie={selectedMovie}
        handleSubmit={handleSubmit}
      />
    </Box>
  );
};

export default MovieManagement;
