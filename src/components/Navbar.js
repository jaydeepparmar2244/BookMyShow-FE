import React, { useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountCircle,
  LocationOn,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const selectedCity = localStorage.getItem('selectedCity');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Check for authentication and city selection
  useEffect(() => {
    if (isAuthenticated && !selectedCity && !isAdminRoute && location.pathname !== '/select-location') {
      navigate('/select-location');
    }
  }, [isAuthenticated, selectedCity, location.pathname, navigate]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'black',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'box-shadow 0.3s ease-in-out',
        '&.sticky': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Toolbar>
        {/* Logo/Home link */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          BookMyShow
        </Typography>

        {/* Show location selector except on admin routes */}
        {!isAdminRoute && (
          <Button
            color="inherit"
            startIcon={<LocationOn />}
            onClick={() => navigate('/select-location')}
            sx={{ mr: 2 }}
          >
            {selectedCity || 'Select City'}
          </Button>
        )}

        {/* Auth section */}
        {!isAuthenticated ? (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Admin Panel Button - shown separately if user is admin */}
            {userRole === 'admin' && (
              <Button
                color="inherit"
                startIcon={<AdminPanelSettings />}
                onClick={() => navigate('/admin')}
                sx={{ mr: 2 }}
              >
                Admin Panel
              </Button>
            )}
            
            {/* User Menu */}
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  {userEmail}
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate('/profile')}>My Profile</MenuItem>
              <MenuItem onClick={() => navigate('/bookings')}>My Bookings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 