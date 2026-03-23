import { Box, Typography, Container } from "@mui/material";

const RentalAgreement = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User (Rental) Agreement
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last updated: 01 January 2026
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Purpose
      </Typography>
      <Typography paragraph>
        This Agreement governs each individual bicycle rental transaction between
        Owners and Renters.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Parties
      </Typography>
      <Typography paragraph>
        Owner, Renter, and RentMyBike (RM Platforms AB)
      </Typography>

      {/* 👉 Continue all clauses */}
    </Container>
  );
};

export default RentalAgreement;