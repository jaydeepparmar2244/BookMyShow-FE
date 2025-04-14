import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ErrorOutline,
} from '@mui/icons-material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Styled components (same as Signup)
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  padding: theme.spacing(3),
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: '#000000',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  padding: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
    },
  },
  '& .MuiInputBase-input': {
    color: '#000000',
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#000000',
  padding: '12px',
  borderRadius: 8,
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        const decodedToken = jwtDecode(response.data.token);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userRole', decodedToken.role);
        localStorage.setItem('userId', decodedToken.id);

        const from = location.state?.from?.pathname || '/movies';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <AuthCard elevation={0}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LocalMoviesIcon sx={{ fontSize: 40, color: 'white', mb: 2 }} />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: '#999999' }}>
            Sign in to continue booking tickets
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
              Email Address
            </Typography>
            <StyledTextField
              fullWidth
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#666666' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
              Password
            </Typography>
            <StyledTextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#666666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#666666' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <ErrorOutline color="error" fontSize="small" />
              <Typography
                color="error"
                variant="body2"
                sx={{
                  textAlign: 'center',
                  wordBreak: 'break-word'
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <ActionButton
            type="submit"
            fullWidth
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: '#000000' }} />
            ) : (
              'Sign In'
            )}
          </ActionButton>

          <Divider sx={{ my: 3, bgcolor: '#333333' }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </AuthCard>
    </StyledContainer>
  );
};

export default Login; 