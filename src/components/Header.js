import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MovieIcon from "@mui/icons-material/Movie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
}));

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedCity = localStorage.getItem("selectedCity") || "Select City";

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBookingsClick = () => {
    navigate("/bookings");
    handleMenuClose();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <MovieIcon sx={{ fontSize: "2rem", color: "#f84480", mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #f84480 30%, #ff6b6b 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BookMyShow
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<LocationOnIcon />}
            sx={{
              color: "#000",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {selectedCity}
          </Button>

          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: "#000",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
              },
            }}
          >
            <MenuItem onClick={handleBookingsClick}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ConfirmationNumberIcon fontSize="small" />
                <Typography>My Bookings</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 