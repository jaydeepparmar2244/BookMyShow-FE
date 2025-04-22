import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Person,
  Phone,
  ErrorOutline,
} from '@mui/icons-material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { authAPI } from '../services/api';

// Reuse the styled components from Login.js
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(3),
}));

const DecorativeLeft = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '10%',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '25%',
  height: '80%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
    transform: 'rotate(45deg)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(-45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
    transform: 'rotate(-45deg)',
    marginTop: '100px',
  },
}));

const DecorativeRight = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '10%',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '25%',
  height: '80%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'linear-gradient(-45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
    transform: 'rotate(-45deg)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
    transform: 'rotate(45deg)',
    marginTop: '120px',
  },
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 450,
  borderRadius: 20,
  overflow: 'hidden',
  backgroundColor: '#000000',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 16,
  },
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

const ErrorOutlineIcon = styled(ErrorOutline)(({ theme }) => ({
  color: theme.palette.error.main,
}));

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user',
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'user'
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      if (data.user) {
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userRole', data.user.role);
      }

      navigate('/select-location');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <DecorativeLeft />
      <DecorativeRight />
      <Box sx={{ 
        width: '100%',
        maxWidth: 450,
        position: 'relative',
        zIndex: 1,
      }}>
        <AuthCard elevation={0}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LocalMoviesIcon sx={{ 
              fontSize: { xs: 32, sm: 40 }, 
              color: 'white', 
              mb: { xs: 1.5, sm: 2 } 
            }} />
            <Typography variant="h4" sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#999999',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Sign up to start booking tickets
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                Full Name
              </Typography>
              <StyledTextField
                fullWidth
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#666666' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

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
                Phone Number
              </Typography>
              <StyledTextField
                fullWidth
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#666666' }} />
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
                placeholder="Create a password"
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

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                Confirm Password
              </Typography>
              <StyledTextField
                fullWidth
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#666666' }} />
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
                <ErrorOutlineIcon color="error" fontSize="small" />
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
                'Create Account'
              )}
            </ActionButton>

            <Divider sx={{ my: 3, bgcolor: '#333333' }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#999999' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </AuthCard>
      </Box>
    </StyledContainer>
  );
};

export default Signup; 