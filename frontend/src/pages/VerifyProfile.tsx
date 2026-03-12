import { Box, Button, Typography, Stack } from "@mui/material";
import {
  useCreateConnectAccountMutation,
  useLazyStartStripeOnboardingQuery,
} from "../services/stripeApi";

const VerifyProfile = () => {
  const [createAccount, { isLoading: creating }] =
    useCreateConnectAccountMutation();

  const [startOnboarding, { isFetching }] =
    useLazyStartStripeOnboardingQuery();

  const handleVerify = async () => {
    try {
      // 1️⃣ Create connect account (safe to call multiple times)
      await createAccount().unwrap();

      // 2️⃣ Get onboarding URL
      const res = await startOnboarding().unwrap();

      // 3️⃣ Redirect to Stripe-hosted onboarding
      window.location.href = res.url;
    } catch (err) {
      console.error(err);
      alert("Stripe verification failed");
    }
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={8}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Verify your profile
      </Typography>

      <Typography color="text.secondary" mb={4}>
        To list your bike, we need to verify your identity and bank details.
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={handleVerify}
          disabled={creating || isFetching}
        >
          Verify with Stripe
        </Button>
      </Stack>
    </Box>
  );
};

export default VerifyProfile;