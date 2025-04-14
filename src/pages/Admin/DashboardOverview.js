import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  ConfirmationNumber as TicketIcon,
} from "@mui/icons-material";
import { theatreAPI, moviesAPI } from "../../services/api";

const StatCard = ({ icon, title, value, color }) => (
  <Paper
    elevation={2}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      bgcolor: color,
      color: "white",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
      },
    }}
  >
    <Box sx={{ mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="subtitle2">{title}</Typography>
    </Box>
  </Paper>
);

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalScreens: 0,
    recentMovies: [],
    recentTheatres: [],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [moviesData, theatresData] = await Promise.all([
        moviesAPI.getAllMovies(),
        theatreAPI.getAllTheatres(),
      ]);

      const totalScreens = theatresData.data.reduce(
        (acc, theatre) => acc + (theatre.screens?.length || 0),
        0
      );

      setStats({
        totalMovies: moviesData.data.length,
        totalTheatres: theatresData.data.length,
        totalScreens,
        recentMovies: moviesData.data.slice(-5).reverse(),
        recentTheatres: theatresData.data.slice(-5).reverse(),
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<MovieIcon sx={{ fontSize: 40 }} />}
            title="Total Movies"
            value={stats.totalMovies}
            color="#1a237e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<TheatersIcon sx={{ fontSize: 40 }} />}
            title="Total Theatres"
            value={stats.totalTheatres}
            color="#0d47a1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<TicketIcon sx={{ fontSize: 40 }} />}
            title="Total Screens"
            value={stats.totalScreens}
            color="#1565c0"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Movies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Recently Added Movies
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentMovies.length > 0 ? (
              stats.recentMovies.map((movie) => (
                <Box
                  key={movie._id}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {movie.movie_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Added on {new Date(movie.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary" align="center">
                No movies added yet
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Theatres */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Recently Added Theatres
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.recentTheatres.length > 0 ? (
              stats.recentTheatres.map((theatre) => (
                <Box
                  key={theatre._id}
                  sx={{
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {theatre.theatre_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {theatre.location} • Added on{" "}
                    {new Date(theatre.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary" align="center">
                No theatres added yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
