import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useConfirmBookingMutation } from "../services/bookingApi";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [confirmBooking] = useConfirmBookingMutation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    /* ✅ PAYMENT SUCCESS */
    if (paymentIntent?.status === "succeeded") {
      try {
        await confirmBooking({
          paymentIntentId: paymentIntent.id,
        }).unwrap();

        navigate("/payment-success", { replace: true });
      } catch (err: any) {
        toast.error(
          err?.data?.message || "Booking confirmation failed"
        );
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 3, ml:2 }}
        disabled={!stripe || loading}
      >
        {loading ? <CircularProgress size={24} /> : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;