import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import LocationOn from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#000",
  boxShadow: "none",
  position: "sticky",
  top: 0,
  zIndex: 1000,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.5rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: "white",
  margin: theme.spacing(0, 1),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(0, 0.5),
    padding: theme.spacing(0.5, 1),
    fontSize: "0.8rem",
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleBookingsClick = () => {
    navigate("/bookings");
    handleClose();
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button onClick={() => navigate("/")}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem 
          button 
          onClick={() => {
            navigate("/select-location");
            handleDrawerToggle();
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <LocationOn sx={{ mr: 1 }} />
          <ListItemText primary={user?.city || "Select City"} />
        </ListItem>
        {user && (
          <>
            <Divider />
            {user.role === "admin" && (
              <ListItem button onClick={() => navigate("/admin")}>
                <ListItemText primary="Admin Panel" />
              </ListItem>
            )}
            <ListItem button onClick={handleBookingsClick}>
              <ListItemText primary="My Bookings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <StyledAppBar>
      <StyledToolbar>
        <Logo variant="h6" onClick={() => navigate("/")}>
          BookMyShow
        </Logo>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              color="inherit"
              startIcon={<LocationOn />}
              onClick={() => navigate("/select-location")}
              sx={{ mr: 2 }}
            >
              {user?.city || "Select City"}
            </Button>
            {user && (
              <>
                {user.role === "admin" && (
                  <NavButton
                    startIcon={<AdminPanelSettings />}
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </NavButton>
                )}
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleBookingsClick}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ConfirmationNumberIcon fontSize="small" />
                      <Typography>My Bookings</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
            {!user && (
              <>
                <NavButton onClick={() => navigate("/login")}>Login</NavButton>
                <NavButton onClick={() => navigate("/signup")}>Sign Up</NavButton>
              </>
            )}
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar; 