import React from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  minHeight: 'calc(100vh - 200px)',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  marginBottom: theme.spacing(2),
  borderRadius: '8px !important',
  '&:before': {
    display: 'none',
  },
}));

const FAQs = () => {
  const theme = useTheme();
  const faqs = [
    {
      question: 'How do I book tickets?',
      answer: 'To book tickets, first select your city, then browse available shows, choose your preferred seats, and proceed to payment.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the show time. A cancellation fee may apply.',
    },
    {
      question: 'How do I change my city?',
      answer: 'You can change your city by clicking on the location icon in the top navigation bar and selecting a new city.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, UPI, and net banking.',
    },
    {
      question: 'How do I get my ticket after booking?',
      answer: 'After successful booking, you will receive an email with your ticket details. You can also view your tickets in the My Bookings section.',
    },
  ];

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
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mt: 4 }}>
        {faqs.map((faq, index) => (
          <StyledAccordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '8px',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </StyledAccordion>
        ))}
      </Box>
    </StyledContainer>
  );
};

export default FAQs; 