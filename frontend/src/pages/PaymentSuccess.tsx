import { Box, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Stripe appends this automatically
  const params = new URLSearchParams(location.search);
  const paymentIntentId = params.get("payment_intent");

  return (
    <Box
      minHeight="70vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Typography variant="h4" fontWeight={700} color="success.main">
        Payment Successful 🎉
      </Typography>

      <Typography>
        Your booking is confirmed.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate(`/my-bookings/${paymentIntentId}`)}
      >
        View My Booking
      </Button>
    </Box>
  );
};

export default PaymentSuccess;