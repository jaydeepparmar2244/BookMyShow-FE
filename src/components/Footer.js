import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  padding: theme.spacing(4, 0),
  marginTop: "auto",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#a0a0a0",
    transform: "translateX(5px)",
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: "#fff",
  transition: "all 0.3s ease",
  "&:hover": {
    color: "#a0a0a0",
    transform: "translateY(-3px)",
  },
}));

const Footer = () => {
  const theme = useTheme();

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              BookMyShow
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your one-stop destination for movie tickets and showtimes.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <SocialIcon>
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon>
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon>
                <InstagramIcon />
              </SocialIcon>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink to="/shows">Shows</FooterLink>
              <FooterLink to="/select-location">Select Location</FooterLink>
              <FooterLink to="/faqs">FAQs</FooterLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Help & Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FooterLink to="/faqs">FAQs</FooterLink>
              <FooterLink to="/terms">Terms of Use</FooterLink>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 4,
            pt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} BookMyShow. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer; 