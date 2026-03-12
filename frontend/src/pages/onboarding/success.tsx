import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OnboardingSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={8}>
      <Typography variant="h4" fontWeight={700}>
        🎉 Verification Complete
      </Typography>

      <Typography mt={2}>
        You can now list your bike and start earning.
      </Typography>

      <Button
        sx={{ mt: 4 }}
        variant="contained"
        onClick={() => navigate("/create-listing")}
      >
        Create Listing
      </Button>
    </Box>
  );
};

export default OnboardingSuccess; 