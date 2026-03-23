import { Box, Typography, Container } from "@mui/material";

interface Props {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalLayout = ({ title, lastUpdated, children }: Props) => {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={4}>
          Last updated: {lastUpdated}
        </Typography>

        <Box sx={{ lineHeight: 1.8 }}>{children}</Box>
      </Container>
    </Box>
  );
};

export default LegalLayout;