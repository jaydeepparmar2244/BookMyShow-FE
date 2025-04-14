import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Rating,
  Chip,
  CardActionArea,
  Button,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { moviesAPI } from "../services/api";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  position: "relative", // Added for admin controls positioning
}));

const MovieImage = styled(CardMedia)({
  height: 400,
  objectFit: "cover",
});

const AdminControls = styled(Box)({
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "20px",
  padding: "4px",
});

const MovieList = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";
  const selectedCity = localStorage.getItem('selectedCity');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    // If user is authenticated but hasn't selected a city, redirect to city selection
    if (isAuthenticated && !selectedCity) {
      navigate('/select-location');
    }
  }, [isAuthenticated, selectedCity, navigate]);

  // If no city is selected, show loading or placeholder
  if (isAuthenticated && !selectedCity) {
    return null; // or a loading component
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMovie = (movieId) => {
    navigate(`/admin/edit-movie/${movieId}`);
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await moviesAPI.deleteMovie(movieId);
        // Refresh the movie list after deletion
        fetchMovies();
      } catch (err) {
        setError(err.message || "Failed to delete movie");
      }
    }
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
        <Button variant="contained" onClick={fetchMovies}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            borderBottom: "3px solid #000",
            display: "inline-block",
          }}
        >
          Now Showing
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin")}
            sx={{
              bgcolor: "#000",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Manage Movies
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
            <StyledCard>
              {isAdmin && (
                <AdminControls>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMovie(movie._id);
                    }}
                    size="small"
                    sx={{ color: "#000", mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMovie(movie._id);
                    }}
                    size="small"
                    sx={{ color: "#000" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </AdminControls>
              )}
              <CardActionArea onClick={() => navigate(`/movie/${movie._id}`)}>
                <MovieImage
                  component="img"
                  image={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = "/movie-placeholder.jpg";
                  }}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {movie.title}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Rating
                      value={movie.rating / 2}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}
                  >
                    {movie.genre?.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre.trim()}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#000",
                          color: "#000",
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    Duration: {movie.duration}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Language: {movie.language}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {movies.length === 0 && !loading && !error && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No movies available at the moment
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MovieList;
