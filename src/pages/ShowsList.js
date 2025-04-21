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
  Stack,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { showsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LanguageIcon from '@mui/icons-material/Language';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarIcon from '@mui/icons-material/Star';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const TitleIcon = styled(LocalMoviesIcon)(({ theme }) => ({
  fontSize: '2rem',
  color: theme.palette.primary.main,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const LocationIcon = styled(LocationOnIcon)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.primary.main,
  marginRight: theme.spacing(0.5),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  position: "relative",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    "& .movie-image": {
      transform: "scale(1.05)",
    },
  },
}));

const ShowImage = styled(CardMedia)({
  height: 400,
  objectFit: "cover",
  position: "relative",
  transition: "transform 0.3s ease-in-out",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
  },
});

const MovieInfo = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  color: "#fff",
  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
  backdropFilter: "blur(4px)",
}));

const GenreChip = styled(Chip)({
  margin: "4px",
  backgroundColor: "rgba(255,255,255,0.2)",
  color: "#fff",
  fontWeight: 500,
  backdropFilter: "blur(4px)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});

const RatingBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#fff",
  padding: theme.spacing(1, 2),
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  backdropFilter: "blur(4px)",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: "#fff",
  "& svg": {
    color: theme.palette.primary.main,
  },
}));

const ShowsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.city) {
      fetchMovies();
    }
  }, [user?.city]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await showsAPI.getMoviesShows(user.city);
      setMovies(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (!user?.city) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please select a city to view movies
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/select-location")}
          sx={{
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Select City
        </Button>
      </Box>
    );
  }

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
        <Button 
          variant="contained" 
          onClick={fetchMovies}
          sx={{
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ 
        textAlign: "center", 
        mb: 4,
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1,
          '&::before, &::after': {
            content: '""',
            width: '30px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #000000)',
          },
          '&::after': {
            background: 'linear-gradient(to left, transparent, #000000)',
          }
        }}>
          <TitleIcon />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#000000",
              fontSize: { xs: "1.5rem", md: "2rem" },
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Now Showing
          </Typography>
        </Box>

        <Box sx={{ 
          display: "flex", 
          alignItems: "center",
          gap: 0.5,
          mb: 1,
        }}>
          <LocationIcon />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "#000000",
              fontSize: { xs: "1rem", md: "1.25rem" },
              letterSpacing: '0.5px',
            }}
          >
            {user.city}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxWidth: "400px",
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            letterSpacing: '0.5px',
          }}
        >
          Discover the latest movies and book your tickets
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
            <StyledCard>
              <CardActionArea onClick={() => handleMovieClick(movie._id)}>
                <ShowImage
                  className="movie-image"
                  component="img"
                  image={movie.image}
                  alt={movie.movie_name}
                  onError={(e) => {
                    e.target.src = "/movie-placeholder.jpg";
                  }}
                />
                <RatingBadge>
                  <StarIcon sx={{ color: "#ffd700" }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {movie.rating}
                  </Typography>
                </RatingBadge>
                <MovieInfo>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#fff",
                      mb: 1,
                    }}
                  >
                    {movie.movie_name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <InfoRow>
                      <LanguageIcon />
                      <Typography variant="body2">
                        {movie.language}
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <CalendarMonthIcon />
                      <Typography variant="body2">
                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </InfoRow>
                  </Stack>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {movie.genre?.map((genre, index) => (
                      <GenreChip
                        key={index}
                        label={genre.trim()}
                      />
                    ))}
                  </Box>
                </MovieInfo>
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

export default ShowsList;
