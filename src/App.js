import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/ProtectedRoute';
import CityProtectedRoute from './components/CityProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LocationSelector from './pages/LocationSelector';
import MovieList from './pages/MovieList';
import MovieDetails from './pages/MovieDetails';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MovieManagement from './pages/Admin/MovieManagement';
import TheatreManagement from './pages/Admin/TheatreManagement';
import DashboardOverview from './pages/Admin/DashboardOverview';
import SelectLocation from './pages/SelectLocation';

// Components
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar will always be visible */}
        <Navbar />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-location" element={<SelectLocation />} />

          {/* City Protected Routes */}
          <Route 
            path="/movies" 
            element={
              <CityProtectedRoute>
                <MovieList />
              </CityProtectedRoute>
            } 
          />
          <Route 
            path="/movie/:id" 
            element={
              <CityProtectedRoute>
                <MovieDetails />
              </CityProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <CityProtectedRoute>
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              </CityProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={
              <CityProtectedRoute>
                <Navigate to="/movies" replace />
              </CityProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 