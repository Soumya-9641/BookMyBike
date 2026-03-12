import { Button, Typography, Box } from "@mui/material";

const OnboardingRefresh = () => {
  const retry = async () => {
    window.location.href = "/create-listing";
  };

  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h6" mb={2}>
        Stripe verification incomplete
      </Typography>
      <Button variant="contained" onClick={retry}>
        Try Again
      </Button>
    </Box>
  );
};

export default OnboardingRefresh;