import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  ConfirmationNumber as TicketIcon,
  Group as UserIcon,
} from '@mui/icons-material';
import { theatreAPI, moviesAPI } from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalScreens: 0,
    recentMovies: [],
    recentTheatres: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [moviesData, theatresData] = await Promise.all([
        moviesAPI.getAllMovies(),
        theatreAPI.getAllTheatres()
      ]);

      const totalScreens = theatresData.data.reduce((acc, theatre) => 
        acc + (theatre.screens?.length || 0), 0
      );

      setStats({
        totalMovies: moviesData.data.length,
        totalTheatres: theatresData.data.length,
        totalScreens,
        recentMovies: moviesData.data.slice(-5),
        recentTheatres: theatresData.data.slice(-5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'primary.dark',
              color: 'white'
            }}
          >
            <MovieIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4">{stats.totalMovies}</Typography>
              <Typography variant="subtitle2">Total Movies</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'secondary.dark',
              color: 'white'
            }}
          >
            <TheatersIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4">{stats.totalTheatres}</Typography>
              <Typography variant="subtitle2">Total Theatres</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3,
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'success.dark',
              color: 'white'
            }}
          >
            <TicketIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4">{stats.totalScreens}</Typography>
              <Typography variant="subtitle2">Total Screens</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* Recent Movies */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recently Added Movies
            </Typography>
            {stats.recentMovies.map((movie) => (
              <Box 
                key={movie._id} 
                sx={{ 
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Typography variant="subtitle1">
                  {movie.movie_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(movie.release_date).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Recent Theatres */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recently Added Theatres
            </Typography>
            {stats.recentTheatres.map((theatre) => (
              <Box 
                key={theatre._id} 
                sx={{ 
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <Typography variant="subtitle1">
                  {theatre.theatre_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {theatre.location}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 