import stripe from "../../Utils/stripe";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";
import { Types } from "mongoose";
import Payment from "../../Models/Payment";

// ─────────────────────────────────────────────────────────────
// UNCHANGED from your original
// ─────────────────────────────────────────────────────────────

const PLATFORM_FEE_RATE = 0.18; // 18% of rental amount
const VAT_RATE = 0.25; // 25% Swedish VAT , included in the 18%



export const createBookingPaymentService = async ({
  listingId,
  renterId,
  startDate,
  endDate,
  hours,
}: {
  listingId: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
}) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new Error("Bike not found");

  const user = await User.findById(renterId);
  if (!user) throw new Error("User not found");
  const hourlyRate = listing.rates?.hourly;
  const dailyRate = listing.rates?.daily;
  let rentalAmount: number;
let pricePerDay: number;
let totalDays: number;
  //Sif (!hourlyRate) throw new Error("Listing does not have an hourly rate set");

  // ── Amount Calculations ──────────────────────────────────────
 // const rentalAmount = Math.round(hours * hourlyRate);
 //           // e.g. 100 kr
 if (hours < 24) {
  // Charge hourly
  if (!hourlyRate) throw new Error("Listing does not have an hourly rate set");
  rentalAmount = Math.round(hours * hourlyRate);
  pricePerDay = hourlyRate * 24; // informational
  totalDays = 1;
} else {
  // Charge daily — ceil so 25h = 2 days, 48h = 2 days, 49h = 3 days
  if (!dailyRate) throw new Error("Listing does not have a daily rate set");
  totalDays = Math.ceil(hours / 24);
  pricePerDay = dailyRate;
  rentalAmount = Math.round(totalDays * dailyRate);
}
  const depositAmount = Math.round(listing.depositAmount ?? 0);   // e.g. 100 kr

  // Renter pays: rental + deposit only (fee is taken from rental internally)
  const chargeAmount = rentalAmount + depositAmount;             // e.g. 200 kr

  // Platform fee: 18% of rental (VAT included, NOT added on top)
  const platformFee = Math.round(rentalAmount * PLATFORM_FEE_RATE); // e.g. 18 kr

  // VAT portion inside the platform fee (reverse VAT calculation)
  // vatAmount = platformFee - (platformFee / 1.25)
  const vatAmount = Math.round(platformFee - platformFee / (1 + VAT_RATE)); // e.g. 3.60 kr → 4 kr rounded
  const platformNet = platformFee - vatAmount;                  // e.g. 14 kr (net revenue excl. VAT)

  // Owner receives rental minus platform fee
  const ownerPayout = rentalAmount - platformFee;

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    });
    stripeCustomerId = customer.id;
    user.stripeCustomerId = customer.id;
    await user.save();
  }

  // Money stays on platform until ride ends (no transfer_data yet)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: chargeAmount * 100,       // Stripe uses smallest unit (öre)
    currency: "sek",
    customer: stripeCustomerId,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    metadata: {
      listingId,
      renterId,
      ownerId: listing.ownerId.toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      hours: hours.toString(),
      rentalAmount: rentalAmount.toString(),
      depositAmount: depositAmount.toString(),
      platformFee: platformFee.toString(),
      vatAmount: vatAmount.toString(),
      platformNet: platformNet.toString(),
      ownerPayout: ownerPayout.toString(),
    },
  });

  const booking = await Booking.create({
    bikeId: listing._id,
    renterId,
    ownerId: listing.ownerId,
    startDate,
    endDate,
    totalDays: totalDays || 1,
    pricePerDay: pricePerDay,
    totalAmount: chargeAmount,
    securityDeposit: depositAmount,
    currency: "SEK",
    status: "upcoming",
  });
  // ── Create Payment record ────────────────────────────────────
  const payment = await Payment.create({
    bookingId: booking._id,
    payerId: renterId,
    payeeId: listing.ownerId,
    type: "booking",
    method: "card",
    status: "pending",
    amount: chargeAmount,     // total charged to renter (rental + deposit)
    currency: "SEK",
    platformFee,                              // 18 kr  — kept by platform
    vatAmount,                                // 3.60 kr — VAT portion inside platformFee
    platformNet,                              // 14.40 kr — platform revenue excl. VAT
    ownerPayout,                              // 82 kr  — transferred to owner after ride
    depositAmount,                            // 100 kr — refunded to renter after ride
    stripePaymentIntentId: paymentIntent.id,
    description: `Rental payment for listing ${listingId} — ${hours}h`,
  });
  booking.paymentId = payment._id as Types.ObjectId;
  await booking.save();

  return {
    bookingId: booking._id,
    paymentId: payment._id,
    clientSecret: paymentIntent.client_secret,
    customerId: stripeCustomerId,
    breakdown: {
      rentalAmount,
      depositAmount,
      chargeAmount,   // what renter actually pays now
      platformFee,
      vatAmount,
      platformNet,
      ownerPayout,    // what owner receives after ride
    },
  };
};

// ─────────────────────────────────────────────────────────────
// NEW — call this single function when ride ends.
//
// Replaces your separate refundDepositService + payoutToOwnerService.
//
// Does two things atomically:
//   1. Refunds deposit → renter
//   2. Transfers rental (minus platform fee) → owner
//
// THE KEY FIX: source_transaction on the transfer
//   Your old code:  stripe.transfers.create({ amount, destination })
//                   → Stripe pulls from platform available balance
//                   → balance is "pending" not "available" → INSUFFICIENT BALANCE ERROR
//
//   New code:       stripe.transfers.create({ ..., source_transaction: chargeId })
//                   → Stripe pulls from THAT specific charge directly
//                   → no dependency on available balance → WORKS ✅
// ─────────────────────────────────────────────────────────────
export const completeRideService = async (bookingId: string,  status: "inprogress" | "completed") => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status === "completed") throw new Error("Ride already completed");

    if (status === "inprogress") {
    booking.status = "inprogress";           // marks ride as started/in-progress
    booking.actualStartTime = new Date();
    await booking.save();
 
    return {
      message: "Ride marked as in progress.",
      bookingId: booking._id,
      status: booking.status,
    };
  }
  const payment = await Payment.findOne({
    bookingId: booking._id,
    type: "booking",
  });

   if (!payment) throw new Error("Payment record not found for this booking");
  if (!payment.stripePaymentIntentId) throw new Error("Stripe PaymentIntent ID missing on payment record");
 
  // ── Verify Stripe PaymentIntent ──
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment.stripePaymentIntentId
  );

  if (paymentIntent.status !== "succeeded") {
    throw new Error("Payment has not been confirmed yet");
  }
 
  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found on this payment");
  }


  const owner = await User.findById(booking.ownerId);
  if (!owner?.businessProfile?.stripeIdentityId) {
    throw new Error("Owner Stripe account missing");
  }
   const ownerAccount = await stripe.accounts.retrieve(
    owner.businessProfile.stripeIdentityId
  );
  if (!ownerAccount.payouts_enabled) {
    throw new Error("Owner has not completed KYC verification");
  }
   const depositAmount  = payment.depositAmount  ?? 0;  // refunded to renter
  const ownerPayout    = payment.ownerPayout    ?? 0;  // transferred to owner
 
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: depositAmount * 100,        // convert to öre
    reason: "requested_by_customer",
  });
 const transfer = await stripe.transfers.create({
    amount: ownerPayout * 100,          // convert to öre
    currency: "sek",
    destination: owner.businessProfile.stripeIdentityId,
    source_transaction: paymentIntent.latest_charge as string, // 🔑 THE FIX
    metadata: {
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString(),
    },
  });


 payment.status           = "succeeded";
  payment.stripeChargeId   = paymentIntent.latest_charge as string;
  payment.stripeRefundId   = refund.id;
  payment.refundAmount     = depositAmount;
  payment.refundReason     = "Deposit returned after ride completion";
  payment.refundedAt       = new Date();
  payment.paidAt           = new Date();
  await payment.save();
 
  // STEP 4: Update Booking record
  booking.status          = "completed";
  booking.actualEndTime   = new Date();
  await booking.save();
   return {
    message: "Ride completed. Deposit refunded to renter, rental sent to owner.",
    depositRefund: {
      refundId: refund.id,
      amount:   depositAmount,
    },
    ownerPayout: {
      transferId: transfer.id,
      amount:     ownerPayout,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// KEPT — for cancellations only (ride never started)
// Refunds deposit only. Owner gets nothing.
// ─────────────────────────────────────────────────────────────
export const refundDepositService = async (bookingId: string) => {
  // ── Fetch Booking ──
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
 
  // ── Fetch linked Payment record ──
  const payment = await Payment.findOne({
    bookingId: booking._id,
    type: "booking",
  });
  if (!payment) throw new Error("Payment record not found for this booking");
  if (!payment.stripePaymentIntentId) throw new Error("Stripe PaymentIntent ID missing on payment record");
 
  // ── Guard: already refunded ──
  if (payment.stripeRefundId) throw new Error("Deposit already refunded");
 
  // ── Verify charge exists ──
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payment.stripePaymentIntentId
  );
 
  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found for this payment");
  }
 
  const depositAmount = payment.depositAmount ?? 0;
 
  // STEP 1: Refund deposit → renter
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: depositAmount * 100,        // convert to öre
  });
 
  // STEP 2: Update Payment record
  payment.status       = "refunded";
  payment.stripeRefundId = refund.id;
  payment.refundAmount = depositAmount;
  payment.refundReason = "Booking cancelled before ride started";
  payment.refundedAt   = new Date();
  await payment.save();
 
  // STEP 3: Update Booking record
  booking.status             = "cancelled";
  booking.cancelledBy        = "renter";
  booking.cancellationReason = "Cancelled before ride started";
  booking.cancelledAt        = new Date();
  await booking.save();
 
  return {
    message: "Deposit refunded successfully",
    refundId: refund.id,
    amount:   depositAmount,
  };
};

// NOTE: payoutToOwnerService has been removed.
// Owner payout now happens inside completeRideService above.
// This prevents the insufficient balance error caused by missing source_transaction.

export const checkStripeOnboardingStatus = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw { statusCode: 404, message: "User not found" };

  const stripeAccountId = user.businessProfile?.stripeIdentityId;
  if (!stripeAccountId) {
    return {
      isOnboarded: false,
      message: "No Stripe account found",
    };
  }

  // 🔍 Fetch account details from Stripe using stripeIdentityId
  const account = await stripe.accounts.retrieve(stripeAccountId);

  const isOnboarded =
    account.charges_enabled &&
    account.payouts_enabled &&
    account.details_submitted;
console.log(isOnboarded);
  // Sync DB if status changed
  if (isOnboarded && !user.businessProfile!.isVerified) {
    user.businessProfile!.isVerified = true;
    user.businessProfile!.isActive = true;
    await user.save();
  }

  return {
    isOnboarded: !!isOnboarded,
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    details_submitted: account.details_submitted,
    // Stripe tells you exactly what's still missing
    currently_due: account.requirements?.currently_due ?? [],
    eventually_due: account.requirements?.eventually_due ?? [],
    disabled_reason: account.requirements?.disabled_reason ?? null,
  };
};

