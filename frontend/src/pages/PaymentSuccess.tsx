import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyPaymentQuery } from "../services/stripeApi";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentIntentId = searchParams.get("payment_intent");

  const {
    data,
  } = useVerifyPaymentQuery(paymentIntentId!, {
    skip: !paymentIntentId,
  });


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
        onClick={() => navigate(`/my-bookings`)}
      >
        View My Booking
      </Button>
    </Box>
  );
};

export default PaymentSuccess;