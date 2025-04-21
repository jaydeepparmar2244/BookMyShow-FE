import React from 'react';
import {
  Container,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  minHeight: 'calc(100vh - 200px)',
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Terms = () => {
  const theme = useTheme();

  return (
    <StyledContainer maxWidth="md">
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: 'center',
          color: theme.palette.primary.main,
        }}
      >
        Terms of Use
      </Typography>

      <Section>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          By accessing and using BookMyShow, you accept and agree to be bound by the terms and provision of this agreement.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          2. Booking and Cancellation
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          All ticket bookings are subject to availability. Cancellations must be made at least 2 hours before the show time. 
          Refunds will be processed according to our cancellation policy.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          3. User Responsibilities
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Users are responsible for maintaining the confidentiality of their account information and for all activities 
          that occur under their account. You agree to notify us immediately of any unauthorized use of your account.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          4. Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Your use of BookMyShow is also governed by our Privacy Policy. Please review our Privacy Policy, which also 
          governs the site and informs users of our data collection practices.
        </Typography>
      </Section>

      <Section>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          5. Modifications to Terms
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          BookMyShow reserves the right to modify these terms at any time. We will notify users of any changes by 
          posting the new terms on the site.
        </Typography>
      </Section>
    </StyledContainer>
  );
};

export default Terms; 