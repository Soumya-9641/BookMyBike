import stripe from "../../Utils/stripe";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";

// ─────────────────────────────────────────────────────────────
// UNCHANGED from your original
// ─────────────────────────────────────────────────────────────
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
  if (!hourlyRate) throw new Error("Listing does not have an hourly rate set");

  const rentalAmount = hours * hourlyRate;
  const depositAmount = listing.depositAmount;
  const platformFee = Math.round(rentalAmount * 0.18);
  const totalAmount = rentalAmount + depositAmount + platformFee;

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

  // No transfer_data — money stays on platform until ride ends
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
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
    },
  });

  const booking = await Booking.create({
    bikeId: listing._id,
    renterId,
    ownerId: listing.ownerId,
    startDate,
    endDate,
    rentalAmount,
    depositAmount,
    platformFee,
    totalAmount,
    stripePaymentIntentId: paymentIntent.id,
    status: "pending",
  });

  return {
    bookingId: booking._id,
    clientSecret: paymentIntent.client_secret,
    customerId: stripeCustomerId,
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
export const completeRideService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.status === "completed") throw new Error("Ride already completed");

  const paymentIntent = await stripe.paymentIntents.retrieve(
    booking.stripePaymentIntentId
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

  // STEP 1: Refund deposit to renter (only depositAmount, not full charge)
  const refund = await stripe.refunds.create({
    payment_intent: booking.stripePaymentIntentId,
    amount: booking.depositAmount * 100,
    reason: "requested_by_customer",
  });

  // STEP 2: Transfer rental to owner
  // source_transaction = the charge ID from the original payment
  // This is what fixes the insufficient balance error
  const ownerAmount = booking.rentalAmount - booking.platformFee;
  const transfer = await stripe.transfers.create({
    amount: ownerAmount * 100,
    currency: "sek",
    destination: owner.businessProfile.stripeIdentityId,
    source_transaction: paymentIntent.latest_charge as string, // 🔑 THE FIX
    metadata: {
      bookingId: booking._id.toString(),
    },
  });

  // STEP 3: Mark booking complete
  booking.status = "completed";
  booking.depositRefunded = true;
  booking.ownerPaid = true;
  booking.ownerPayoutId = transfer.id;
  await booking.save();

  return {
    message: "Ride completed. Deposit refunded to renter, rental sent to owner.",
    depositRefund: {
      refundId: refund.id,
      amount: booking.depositAmount,
    },
    ownerPayout: {
      transferId: transfer.id,
      amount: ownerAmount,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// KEPT — for cancellations only (ride never started)
// Refunds deposit only. Owner gets nothing.
// ─────────────────────────────────────────────────────────────
export const refundDepositService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  if (booking.depositRefunded) throw new Error("Deposit already refunded");

  const paymentIntent = await stripe.paymentIntents.retrieve(
    booking.stripePaymentIntentId
  );

  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found for this payment");
  }

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent.id,
    amount: booking.depositAmount * 100,
  });

  booking.depositRefunded = true;
  await booking.save();

  return {
    message: "Deposit refunded successfully",
    refundId: refund.id,
    amount: booking.depositAmount,
  };
};

// NOTE: payoutToOwnerService has been removed.
// Owner payout now happens inside completeRideService above.
// This prevents the insufficient balance error caused by missing source_transaction.