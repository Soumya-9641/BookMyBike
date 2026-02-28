import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { VITE_STRIPE_PUBLISHABLE_KEY } from "../constant/bikecategories";

const stripePromise = loadStripe(
  VITE_STRIPE_PUBLISHABLE_KEY
);

const Checkout = () => {
  const { state } = useLocation();
  const clientSecret = state?.clientSecret;

  if (!clientSecret) return <p>Invalid checkout</p>;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
