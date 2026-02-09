import stripe from "../../Utils/stripe";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";
export const createBookingPaymentService = async ({
  listingId,
  renterId,
  startDate,
  endDate,
  hours
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

 
  const rentalAmount = hours * 1; 
  const depositAmount = listing.depositAmount;
  const platformFee = Math.round(rentalAmount * 0.18);
  const totalAmount = rentalAmount + depositAmount + platformFee;

 
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user._id.toString()
      }
    });

    stripeCustomerId = customer.id;
    user.stripeCustomerId = customer.id;
    await user.save();
  }

  // 🔐 2. Create PaymentIntent WITH customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "eur",
    customer: stripeCustomerId,
   automatic_payment_methods: {
    enabled: true,
    allow_redirects: "never" // 🔑 KEY LINE
  },
    metadata: {
      listingId,
      renterId,
      ownerId: listing.ownerId.toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      hours: hours.toString()
    }
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
    status: "pending"
  });

  return {
    bookingId: booking._id,
    clientSecret: paymentIntent.client_secret,
    customerId: stripeCustomerId
  };
};



export const completeBookingService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "confirmed") {
    throw new Error("Booking not eligible for completion");
  }

  await stripe.refunds.create({
    payment_intent: booking.stripePaymentIntentId,
    amount: booking.depositAmount * 100
  });

  booking.status = "completed";
  await booking.save();

  return { message: "Booking completed & deposit refunded" };
};

export const refundDepositService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) throw new Error("Booking not found");

  if (booking.depositRefunded) {
    throw new Error("Deposit already refunded");
  }

  // if (booking.status !== "completed") {
  //   throw new Error("Ride not completed yet");
  // }

  // 🔑 Retrieve PaymentIntent
  const paymentIntent = await stripe.paymentIntents.retrieve(
    booking.stripePaymentIntentId
  );

  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found for this payment");
  }

  // 💰 Refund ONLY deposit amount
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntent.id,
    amount: booking.depositAmount * 100 // cents
  });

  booking.depositRefunded = true;
  await booking.save();

  return {
    message: "Deposit refunded successfully",
    refundId: refund.id,
    amount: booking.depositAmount
  };
};

export const payoutToOwnerService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.ownerPaid) {
    throw new Error("Owner already paid");
  }

  const owner = await User.findById(booking.ownerId);
  if (!owner || !owner.businessProfile?.stripeIdentityId) {
    throw new Error("Owner Stripe account missing");
  }

  const ownerAmount =
    booking.rentalAmount - booking.platformFee;

  const transfer = await stripe.transfers.create({
    amount: ownerAmount * 100,
    currency: "eur",
    destination: owner.businessProfile.stripeIdentityId,
    metadata: {
      bookingId: booking._id.toString()
    }
  });

  booking.ownerPaid = true;
  booking.ownerPayoutId = transfer.id;
  await booking.save();

  return {
    message: "Owner payout completed (dev)",
    transferId: transfer.id,
    amount: ownerAmount
  };
};
