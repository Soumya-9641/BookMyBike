import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { VITE_STRIPE_PUBLISHABLE_KEY } from "../constant/bikecategories";
import { Box, Paper } from "@mui/material";

const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { state } = useLocation();
  const clientSecret = state?.clientSecret;

  if (!clientSecret) return <p>Invalid checkout</p>;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </Paper>
    </Box>
  );
};

export default Checkout;