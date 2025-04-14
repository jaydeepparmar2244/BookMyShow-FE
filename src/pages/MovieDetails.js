import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  TheaterComedy as GenreIcon,
} from "@mui/icons-material";
import { moviesAPI, showsAPI } from "../services/api";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        const [movieResponse, showsResponse] = await Promise.all([
          moviesAPI.getMovieById(id),
          showsAPI.getShowsByMovie(id),
        ]);
        setMovie(movieResponse.data);
        setShows(showsResponse.data);
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography align="center" variant="h6">
          Movie not found
        </Typography>
      </Container>
    );
  }

  const handleBookShow = (showId) => {
    navigate(`/booking/${showId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img
              src={movie.poster || "https://via.placeholder.com/300x450"}
              alt={movie.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {movie.name}
            </Typography>
            <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`${movie.duration} mins`}
              />
              <Chip icon={<LanguageIcon />} label={movie.language} />
              <Chip icon={<GenreIcon />} label={movie?.genre} />
              <Chip icon={<StarIcon />} label={`${movie.rating}/10`} />
            </Box>
            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Available Shows
            </Typography>
            <Grid container spacing={2}>
              {shows.length > 0 ? (
                shows.map((show) => (
                  <Grid item xs={12} sm={6} md={4} key={show._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          {new Date(show.show_time).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                          {new Date(show.show_time).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Available Seats: {show.available_seats}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Price: ₹{show.price_per_seat}
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => handleBookShow(show._id)}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    No shows available at the moment.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MovieDetails;
