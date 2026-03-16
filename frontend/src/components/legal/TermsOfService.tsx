import { Box, Typography, Container } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Terms of Service
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last updated: 01 January 2026
      </Typography>

      <Typography paragraph>
        RentMyBike (Trademarked & operated by RM Platforms AB, org.nr 559542-5843)
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Introduction
      </Typography>
      <Typography paragraph>
        These Terms govern your access to and use of our peer-to-peer bicycle rental
        platform.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Eligibility
      </Typography>
      <Typography paragraph>
        Users must be at least 18 years old or use the platform with parental consent.
      </Typography>

      {/* 👉 Continue sections exactly like your text */}
    </Container>
  );
};

export default TermsOfService;