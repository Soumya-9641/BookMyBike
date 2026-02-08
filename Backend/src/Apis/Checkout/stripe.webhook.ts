import { Router } from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import stripe from "../../Utils/stripe";
import Booking from "../../Models/Booking";

const router = Router();

router.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 Stripe webhook received");
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
  console.log("✅ PaymentIntent ID from webhook:", intent.id);
      await Booking.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: "confirmed" }
      );
    }

    res.json({ received: true });
  }
);

export default router;
