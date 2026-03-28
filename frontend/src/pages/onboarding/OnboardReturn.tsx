import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStripeStatusQuery } from "../../services/stripeApi";
import { useDispatch } from "react-redux";
import { setOnboardingStatus } from "../../features/auth/authSlice";

const OnboardReturn = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetStripeStatusQuery();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading && data?.success) {
      if (data.data.isOnboarded) {
        dispatch(setOnboardingStatus(true));
        navigate("/onboardSuccess", { replace: true });
      }
    }
  }, [isLoading, data, navigate]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
        <Typography mt={2}>
          Checking verification status...
        </Typography>
      </Box>
    );
  }

  if (isError || !data?.data?.isOnboarded) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" fontWeight={700} color="error">
          ❌ Verification Incomplete
        </Typography>

        <Typography mt={2}>
          Your Stripe onboarding was not completed.
          Please finish the remaining steps.
        </Typography>
        
        <Button
          sx={{ mt: 4, mb: 3 }}
          variant="contained"
          onClick={() => navigate("/verify-profile")}
        >
          Resume Verification
        </Button>
      </Box>
    );
  }

  return null;
};

export default OnboardReturn;