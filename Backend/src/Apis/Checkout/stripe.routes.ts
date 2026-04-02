import { Router, Request, Response } from "express";
import stripe from "../../Utils/stripe";
import { authMiddleware, isBikeOwner } from "../../Middlewares/auth.middleware";
import {
  createBookingPaymentService,
  completeRideService,   // NEW
  refundDepositService,
  checkStripeOnboardingStatus,  // kept for cancellations only
} from "./stripe.service";
import { AuthRequest } from "../../types/auth-request";
import Booking from "../../Models/Booking";
import User from "../../Models/User";
import Payment from "../../Models/Payment";

const router = Router();

// ── Unchanged ──────────────────────────────────────────────
router.post("/create", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
     const renterId = req.user!.userId.toString();

    // ── Block check before creating booking ──
    const user = await User.findById(renterId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isBlocked) {
      res.status(401).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
      return;
    }
    const result = await createBookingPaymentService({
      listingId: req.body.listingId,
      renterId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      hours: req.body.hours,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// ── Unchanged ──────────────────────────────────────────────
router.post("/createcustomer", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.stripeCustomerId) {
      return res.json({
        stripeCustomerId: user.stripeCustomerId,
        message: "Stripe customer already exists",
      });
    }

    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    });

    user.stripeCustomerId = customer.id;
    await user.save();

    res.json({ stripeCustomerId: customer.id, message: "Stripe customer created successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "Could not create customer", error: err.message });
  }
});

// ── Unchanged ──────────────────────────────────────────────
router.post("/create-connect-account", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.businessProfile?.stripeIdentityId) {
      return res.json({ accountId: user.businessProfile.stripeIdentityId, message: "Stripe account already exists" });
    }

    const account = await stripe.accounts.create({
      type: "express",
      country: "SE",
      email: user.email,
      capabilities: {
        transfers: { requested: true },
        card_payments: { requested: true },
      },
    });

    user.businessProfile!.stripeIdentityId = account.id;
    user.businessProfile!.isActive = true; // Mark as active immediately for testing; in production, wait until onboarding complete
    user.businessProfile!.isVerified = false; // Will be updated after Stripe onboarding and KY
    await user.save();

    res.json({ accountId: account.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Unchanged ──────────────────────────────────────────────
router.get("/connect/onboard", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user?.businessProfile?.stripeIdentityId) {
      return res.status(400).json({ message: "Stripe account missing" });
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.businessProfile.stripeIdentityId,
      refresh_url: `${process.env.FRONTEND_URL}/onboardRefresh`,
      return_url: `${process.env.FRONTEND_URL}/onboardReturn`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (err: any) {
    return res.status(500).json({ message: "Could not create onboarding link", error: err.message });
  }
});

// ── NEW — replaces /payout-owner/:bookingId ────────────────
// Call this when the ride ends. Does BOTH:
//   - refunds deposit to renter
//   - transfers rental to owner
router.post("/:id/complete-ride", authMiddleware, isBikeOwner, async (req: AuthRequest, res: Response) => {
  try {
      const { status } = req.body;
       if (!status) {
        return res.status(400).json({ message: "status is required in request body" });
      }
 
      if (status !== "inprogress" && status !== "completed") {
        return res.status(400).json({
          message: "Invalid status. Allowed values: 'inprogress' | 'completed'",
        });
      }
    const result = await completeRideService(req.params.id,status);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// ── KEPT — for cancellations only ──────────────────────--------
// Only call this if ride is cancelled before it starts
router.post("/:id/refund-deposit", authMiddleware, isBikeOwner, async (req: AuthRequest, res: Response) => {
  try {
    const result = await refundDepositService(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// ── REMOVED: /payout-owner/:bookingId ─────────────────────
// This caused the insufficient balance error.
// Owner payout now happens inside /:id/complete-ride above.

// ── Dev only ─────────────────────────────────────────────
router.post("/dev/complete-payment", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ message: "Disabled in production" });
  }

  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) throw new Error("Payment not found");
    const user = await User.findById(booking.renterId);
    if (!user?.stripeCustomerId) throw new Error("Stripe customer missing");
    if (!payment.stripePaymentIntentId) {
      throw new Error("Stripe PaymentIntent ID missing on payment record");
    }
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId,
    });

    const intent = await stripe.paymentIntents.confirm(payment.stripePaymentIntentId, {
      payment_method: paymentMethod.id,
    });

    res.json({ message: "Payment completed", paymentIntentId: intent.id, status: intent.status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Unchanged ──────────────────────────────────────────────
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

router.get("/connect/status", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const status = await checkStripeOnboardingStatus(req.user!.userId);
    return res.status(200).json({ success: true, data: status });
  } catch (err: any) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});
router.get(
  "/verify/:paymentIntentId",
  //authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { paymentIntentId } = req.params;

      // 1. Find payment in DB using your paymentId
      // const payment = await Payment.findById(paymentId);
      // if (!payment) {
      //   res.status(404).json({ message: "Payment not found" });
      //   return;
      // }

      // // 2. Use stripePaymentIntentId from DB to check Stripe
      // if (!payment.stripePaymentIntentId) {
      //   res.status(400).json({ message: "Stripe PaymentIntent ID missing" });
      //   return;
      // }
      if (!paymentIntentId) {
        res.status(400).json({ message: "PaymentIntent ID is required" });
        return;
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntentId,
      });
      if(!payment){
        res.status(404).json({ message: "Payment record not found for this PaymentIntent ID" });
        return;
      }

      // 3. Update DB based on Stripe status
      if (paymentIntent.status === "succeeded") {
        await Payment.findByIdAndUpdate(payment._id, { status: "completed" });
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "upcoming",
          isPaid: true,
        });
      }

      if (paymentIntent.status === "canceled") {
        await Payment.findByIdAndUpdate(payment._id, { status: "failed" });
        await Booking.findByIdAndUpdate(payment.bookingId, {
          status: "cancelled",
        });
      }

      // 4. Return updated status
      res.json({
        success: true,
        paymentId: payment._id,
        stripeStatus: paymentIntent.status,       // raw stripe status
        isSuccess: paymentIntent.status === "succeeded",
        bookingId: payment.bookingId,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);
export default router;