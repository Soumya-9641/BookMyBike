import stripe from "../../Utils/stripe";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";
import { Types } from "mongoose";
import Payment from "../../Models/Payment";
import Dispute from "../../Models/Dispute";
import { sendEmail } from "../../Utils/sendEmail";

// ─────────────────────────────────────────────────────────────
// UNCHANGED from your original
// ─────────────────────────────────────────────────────────────

const PLATFORM_FEE_RATE = 0.18; // 18% of rental amount
const VAT_RATE = 0.25; // 25% Swedish VAT , included in the 18%

// ── 1. calculateRentalAmount ────────────────────────────────────
// Mirrors the hourly/daily branching logic from your service exactly.
// export const calculateRentalAmount = (
//   listing: {
//     rates?: {
//       hourly?:  number;
//       daily?:   number;
//       weekly?:  number;
//       monthly?: number;
//     };
//     depositAmount?: number;
//   },
//   hours: number
// ): { rentalAmount: number; pricePerDay: number; totalDays: number } => {

//   const { hourly, daily, weekly, monthly } = listing.rates ?? {};

//   // ── Thresholds ──
//   const DAILY_THRESHOLD   = 24;           // 1 day
//   const WEEKLY_THRESHOLD  = 7  * 24;      // 168 hours
//   const MONTHLY_THRESHOLD = 30 * 24;      // 720 hours

//   // ── Hourly: less than 24h ──
//   if (hours < DAILY_THRESHOLD) {
//     if (!hourly) throw new Error("Listing does not have an hourly rate set");
//     return {
//       rentalAmount: hours * hourly,
//       pricePerDay:  hourly * 24,
//       totalDays:    1,
//     };
//   }

//   // ── Monthly: 30+ days ──
//   if (hours >= MONTHLY_THRESHOLD) {
//     if (!monthly) throw new Error("Listing does not have a monthly rate set");

//     const fullMonths        = Math.floor(hours / MONTHLY_THRESHOLD);
//     const remainingAfterMonth = hours % MONTHLY_THRESHOLD;             // leftover hours after full months

//     const fullWeeks         = Math.floor(remainingAfterMonth / WEEKLY_THRESHOLD);
//     const remainingAfterWeek  = remainingAfterMonth % WEEKLY_THRESHOLD; // leftover after weeks

//     const fullDays          = Math.floor(remainingAfterWeek / DAILY_THRESHOLD);
//     const remainingHours    = remainingAfterWeek % DAILY_THRESHOLD;    // leftover hours

//     let rentalAmount = fullMonths * monthly;

//     if (fullWeeks > 0) {
//       if (!weekly) throw new Error("Listing does not have a weekly rate set");
//       rentalAmount += fullWeeks * weekly;
//     }
//     if (fullDays > 0) {
//       if (!daily) throw new Error("Listing does not have a daily rate set");
//       rentalAmount += fullDays * daily;
//     }
//     if (remainingHours > 0) {
//       if (!hourly) throw new Error("Listing does not have an hourly rate set");
//       rentalAmount += remainingHours * hourly;
//     }

//     return {
//       rentalAmount,
//       pricePerDay: monthly / 30,
//       totalDays:   Math.ceil(hours / 24),
//     };
//   }

//   // ── Weekly: 7+ days (but less than 30 days) ──
//   if (hours >= WEEKLY_THRESHOLD) {
//     if (!weekly) throw new Error("Listing does not have a weekly rate set");

//     const fullWeeks           = Math.floor(hours / WEEKLY_THRESHOLD);
//     const remainingAfterWeek  = hours % WEEKLY_THRESHOLD;              // leftover after full weeks

//     const fullDays            = Math.floor(remainingAfterWeek / DAILY_THRESHOLD);
//     const remainingHours      = remainingAfterWeek % DAILY_THRESHOLD;  // leftover hours

//     let rentalAmount = fullWeeks * weekly;

//     if (fullDays > 0) {
//       if (!daily) throw new Error("Listing does not have a daily rate set");
//       rentalAmount += fullDays * daily;
//     }
//     if (remainingHours > 0) {
//       if (!hourly) throw new Error("Listing does not have an hourly rate set");
//       rentalAmount += remainingHours * hourly;
//     }

//     return {
//       rentalAmount,
//       pricePerDay: weekly / 7,
//       totalDays:   Math.ceil(hours / 24),
//     };
//   }

//   // ── Daily: 1+ days (but less than 7 days) ──
//   if (!daily) throw new Error("Listing does not have a daily rate set");

//   const fullDays       = Math.floor(hours / DAILY_THRESHOLD);
//   const remainingHours = hours % DAILY_THRESHOLD;              // leftover hours after full days

//   let rentalAmount = fullDays * daily;

//   if (remainingHours > 0) {
//     if (!hourly) throw new Error("Listing does not have an hourly rate set");
//     rentalAmount += remainingHours * hourly;
//   }

//   return {
//     rentalAmount,
//     pricePerDay: daily,
//     totalDays:   Math.ceil(hours / 24),
//   };
// };


export const calculateRentalAmount = (
  listing: {
    rates?: {
      hourly?:  number;
      daily?:   number;
      weekly?:  number;
      monthly?: number;
    };
    depositAmount?: number;
  },
  hours: number
): { rentalAmount: number; pricePerDay: number; totalDays: number } => {

  const { hourly, daily, weekly, monthly } = listing.rates ?? {};

  const HOURLY_THRESHOLD  = 24;
  const DAILY_THRESHOLD   = 7  * 24;   // 168h
  const WEEKLY_THRESHOLD  = 30 * 24;   // 720h

  const totalDays = Math.ceil(hours / 24);

  // ── Helper: calculate amount for a given combination ──
  const calcAmount = (
    months:  number,
    weeks:   number,
    days:    number,
    hrs:     number
  ): number | null => {
    let amount = 0;
    if (months > 0) {
      if (!monthly) return null;
      amount += months * monthly;
    }
    if (weeks > 0) {
      if (!weekly) return null;
      amount += weeks * weekly;
    }
    if (days > 0) {
      if (!daily) return null;
      amount += days * daily;
    }
    if (hrs > 0) {
      if (!hourly) return null;
      amount += hrs * hourly;
    }
    return amount;
  };

  // ── Helper: get lowest valid amount from candidates ──
  const lowest = (candidates: (number | null)[]): number => {
    const valid = candidates.filter((c): c is number => c !== null);
    if (!valid.length) throw new Error("No valid rate combination found for given hours");
    return Math.min(...valid);
  };

  // ── Pure hourly: less than 24h ──
  if (hours < HOURLY_THRESHOLD) {
    if (!hourly) throw new Error("Listing does not have an hourly rate set");

    const candidates: (number | null)[] = [
      // General: hours × hourly rate
      calcAmount(0, 0, 0, hours),
      // Special: check if 1 full day is cheaper
      calcAmount(0, 0, 1, 0),
    ];

    return {
      rentalAmount: lowest(candidates),
      pricePerDay:  hourly * 24,
      totalDays:    1,
    };
  }

  // ── Daily range: 24h to <168h (1 day to <7 days) ──
  if (hours < DAILY_THRESHOLD) {
    const fullDays       = Math.floor(hours / HOURLY_THRESHOLD);
    const remainingHours = hours % HOURLY_THRESHOLD;

    const candidates: (number | null)[] = [
      // General: fullDays days + remaining hours
      calcAmount(0, 0, fullDays, remainingHours),
      // Special: ceil days (round up to next full day)
      calcAmount(0, 0, fullDays + (remainingHours > 0 ? 1 : 0), 0),
    ];

    return {
      rentalAmount: lowest(candidates),
      pricePerDay:  daily ?? 0,
      totalDays,
    };
  }

  // ── Weekly range: 168h to <720h (7 days to <30 days) ──
  if (hours < WEEKLY_THRESHOLD) {
    const fullWeeks          = Math.floor(hours / DAILY_THRESHOLD);
    const remainingAfterWeek = hours % DAILY_THRESHOLD;
    const fullDays           = Math.floor(remainingAfterWeek / HOURLY_THRESHOLD);
    const remainingHours     = remainingAfterWeek % HOURLY_THRESHOLD;

    const candidates: (number | null)[] = [
      // General: fullWeeks weeks + fullDays days + remaining hours
      calcAmount(0, fullWeeks, fullDays, remainingHours),

      // Special case 1: round up to next full week
      calcAmount(0, fullWeeks + 1, 0, 0),

      // Special case 2: fullWeeks weeks + (fullDays + 1) days
      calcAmount(0, fullWeeks, fullDays + (remainingHours > 0 ? 1 : 0), 0),

      // Special case 3: pure days (no weeks)
     // calcAmount(0, 0, Math.ceil(hours / HOURLY_THRESHOLD), 0),
    ];

    return {
      rentalAmount: lowest(candidates),
      pricePerDay:  weekly ? weekly / 7 : (daily ?? 0),
      totalDays,
    };
  }

  // ── Monthly range: 720h+ (30+ days) ──
  const fullMonths          = Math.floor(hours / WEEKLY_THRESHOLD);
  const remainingAfterMonth = hours % WEEKLY_THRESHOLD;
  const fullWeeks           = Math.floor(remainingAfterMonth / DAILY_THRESHOLD);
  const remainingAfterWeek  = remainingAfterMonth % DAILY_THRESHOLD;
  const fullDays            = Math.floor(remainingAfterWeek / HOURLY_THRESHOLD);
  const remainingHours      = remainingAfterWeek % HOURLY_THRESHOLD;

  const candidates: (number | null)[] = [
    // General: fullMonths + fullWeeks + fullDays + remaining hours
    calcAmount(fullMonths, fullWeeks, fullDays, remainingHours),

    // Special case 1: round up to next full month
    calcAmount(fullMonths + 1, 0, 0, 0),

    // Special case 2: fullMonths + (fullWeeks + 1) weeks
    calcAmount(fullMonths, fullWeeks + 1, 0, 0),

    // Special case 3: fullMonths + fullWeeks + (fullDays + 1) days
    calcAmount(fullMonths, fullWeeks, fullDays + (remainingHours > 0 ? 1 : 0), 0),

    // Special case 4: pure months + weeks (no leftover days)
  //  calcAmount(fullMonths, fullWeeks, fullDays, 0),

    // Special case 5: (fullMonths + 1) months, no weeks/days
  //  calcAmount(fullMonths + 1, 0, 0, 0),
  ];

  return {
    rentalAmount: lowest(candidates),
    pricePerDay:  monthly ? monthly / 30 : (weekly ? weekly / 7 : (daily ?? 0)),
    totalDays,
  };
};
export const checkAvailability = async (
  listingId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  // Check if any active booking overlaps with the requested date range
  const conflictingBooking = await Booking.findOne({
    bikeId: listingId,
    status: { $in: ["upcoming", "active"] }, // only block on live bookings
    $or: [
      // Case 1: existing booking starts inside requested range
      { startDate: { $gte: startDate, $lt: endDate } },
      // Case 2: existing booking ends inside requested range
      { endDate: { $gt: startDate, $lte: endDate } },
      // Case 3: existing booking completely wraps the requested range
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  });

  return !conflictingBooking; // true = available, false = conflict found
};

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

export const confirmBookingService = async (
  paymentIntentId: string,
  renterId: string
) => {
  // ── Verify with Stripe ──
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
  }

  // ── Ownership guard ──
  if (paymentIntent.metadata.renterId !== renterId) {
    throw new Error("Unauthorized");
  }

  // ── Duplicate booking guard ──
  const existing = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
  if (existing) throw new Error("Booking already exists for this payment");
  const renter = await User.findById(renterId);
  if (!renter) throw new Error("Renter not found");
  // ── Pull all values from Stripe metadata (locked at payment time) ──
  const m = paymentIntent.metadata;

  // ── Create Booking ──
  const booking = await Booking.create({
    bikeId: m.listingId,
    renterId: m.renterId,
    ownerId: m.ownerId,
    startDate: new Date(m.startDate),
    endDate: new Date(m.endDate),
    totalDays: Number(m.totalDays),
    pricePerDay: Number(m.pricePerDay),
    totalAmount: Number(m.chargeAmount),
    securityDeposit: Number(m.depositAmount),
    currency: "SEK",
    status: "upcoming",
  });

  // ── Create Payment record ──
  const payment = await Payment.create({
    bookingId: booking._id,
    payerId: m.renterId,
    payeeId: m.ownerId,
    type: "booking",
    method: "card",
    status: "succeeded",                    // ← paid, not pending
    amount: Number(m.chargeAmount),
    currency: "SEK",
    platformFee: Number(m.platformFee),
    vatAmount: Number(m.vatAmount),
    platformNet: Number(m.platformNet),
    ownerPayout: Number(m.ownerPayout),
    depositAmount: Number(m.depositAmount),
    stripePaymentIntentId: paymentIntentId,
    paidAt: new Date(),
    description: `Rental payment for listing ${m.listingId} — ${m.hours}h`,
  });

  booking.paymentId = payment._id as Types.ObjectId;
  await booking.save();
  const listing = await Listing.findById(m.listingId).lean();
  const firstName = renter.personalProfile?.firstName ?? "there";
  const startDate = new Date(m.startDate);
  const endDate = new Date(m.endDate);
  const bikeName = listing?.title ?? "Your booked bike";
  const startDateFormatted = new Date(m.startDate).toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" });
  const endDateFormatted = new Date(m.endDate).toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" });
  const bookingShortId = booking._id.toString().slice(-8).toUpperCase();
  await sendEmail(
    renter.email,
    "Booking Confirmed 🎉",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
                src="${process.env.LOGO_URL}"
                width="140"
                style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${firstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  Your booking is confirmed 🎉
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  Booking Confirmation
                </h2>

                <!-- Booking Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Bike
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${bikeName}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Start Date
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${startDateFormatted}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      End Date
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${endDateFormatted}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Total Days
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${m.totalDays} day(s)
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Rental Amount
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${Number(m.rentalAmount).toFixed(2)} SEK
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Security Deposit
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${Number(m.depositAmount).toFixed(2)} SEK
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:16px; font-weight:700; color:#1a1a1a; text-align:left;">
                      Total Charged
                    </td>
                    <td style="padding:12px 20px; font-size:16px; font-weight:700; color:#17a34a; text-align:right;">
                      ${Number(m.chargeAmount).toFixed(2)} SEK
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px; color:#999999; margin:20px 0 10px;">
                  If you have any questions, please contact our support team.
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
  );
  return {
    bookingId: booking._id,
    paymentId: payment._id,
    breakdown: {
      rentalAmount: Number(m.rentalAmount),
      depositAmount: Number(m.depositAmount),
      chargeAmount: Number(m.chargeAmount),
      platformFee: Number(m.platformFee),
      vatAmount: Number(m.vatAmount),
      platformNet: Number(m.platformNet),
      ownerPayout: Number(m.ownerPayout),
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
export const completeRideService = async (bookingId: string, status: "inprogress" | "completed", userId: string) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");
  // if (booking.status === "completed") throw new Error("Ride already completed");

  // //   if (status === "inprogress") {
  // //   booking.status = "inprogress";           // marks ride as started/in-progress
  // //   booking.actualStartTime = new Date();
  // //   await booking.save();

  // //   return {
  // //     message: "Ride marked as in progress.",
  // //     bookingId: booking._id,
  // //     status: booking.status,
  // //   };
  // // }
   const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  let updatedBy: "admin" | "lister";

  if (user?.systemRole === "admin") {
    updatedBy = "admin";
  } else {
    updatedBy = "lister";
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
  const depositAmount = payment.depositAmount ?? 0;  // refunded to renter
  const ownerPayout = payment.ownerPayout ?? 0;  // transferred to owner

  const dispute = await Dispute.findOne({ bookingId: booking._id });
  let renterRefund = depositAmount;   // default: full deposit back to renter
  let adjustedOwnerPayout = ownerPayout;
  if (dispute) {
    if (dispute.status === "rejected") {
      // ── Dispute rejected → full deposit refunded to renter, normal owner payout ──
      renterRefund = depositAmount;
      adjustedOwnerPayout = ownerPayout;

    } else if (dispute.status === "resolved") {
      // ── Dispute resolved → deduct disputeAmount from deposit, add to owner payout ──
      const penaltyAmount = dispute.disputeAmount ?? 0;
      renterRefund = Math.max(0, depositAmount - penaltyAmount);
      adjustedOwnerPayout = ownerPayout + penaltyAmount;

    } else if (dispute.status === "open") {
      // ── Dispute still open → block completion until resolved ──
      throw new Error("Cannot complete ride. Dispute is still open and pending resolution.");
    }
  }
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: renterRefund * 100,        // convert to öre
    reason: "requested_by_customer",
  });
  const transfer = await stripe.transfers.create({
    amount: adjustedOwnerPayout * 100,          // convert to öre
    currency: "sek",
    destination: owner.businessProfile.stripeIdentityId,
    source_transaction: paymentIntent.latest_charge as string, // 🔑 THE FIX
    metadata: {
      bookingId: booking._id.toString(),
      paymentId: payment._id.toString(),
    },
  });


  payment.status = "succeeded";
  payment.stripeChargeId = paymentIntent.latest_charge as string;
  payment.stripeRefundId = refund.id;
  payment.refundAmount = depositAmount;
  payment.refundReason = "Deposit returned after ride completion";
  payment.refundedAt = new Date();
  payment.paidAt = new Date();
  await payment.save();

  // STEP 4: Update Booking record
  booking.status = "completed";
  booking.actualEndTime = new Date();
  booking.isSettlementDone = true;
  booking.updatedBy = updatedBy;
  await booking.save();
  const renter = await User.findById(booking.renterId);
  const firstName = renter?.personalProfile?.firstName ?? "there";
  const bookingShortId = booking._id.toString().slice(-8).toUpperCase();
  const hasDispute = dispute && dispute.status === "resolved";

  await sendEmail(
    renter?.email!,
    "Deposit Released",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Deposit Released</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${firstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  ${hasDispute
      ? "Our dispute resolution team has reviewed all evidence and made a decision based on this."
      : "Your ride has been completed successfully."}
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  ${hasDispute ? "Deposit Released (Dispute Decision)" : "Deposit Released"}
                </h2>

                <!-- Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>

                  ${hasDispute ? `
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Original Deposit
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${depositAmount.toFixed(2)} SEK
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Penalty Deducted
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#e53935; text-align:right; border-bottom:1px solid #eeeeee;">
                      - ${dispute.disputeAmount.toFixed(2)} SEK
                    </td>
                  </tr>` : ""}

                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Completed At
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${new Date().toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:16px; font-weight:700; color:#1a1a1a; text-align:left;">
                      Amount Released
                    </td>
                    <td style="padding:12px 20px; font-size:16px; font-weight:700; color:#17a34a; text-align:right;">
                      ${renterRefund.toFixed(2)} SEK
                    </td>
                  </tr>
                </table>

                <p style="font-size:16px; font-weight:400; color:#444; margin:20px 0 6px;">
                  Your deposit of <strong>${renterRefund.toFixed(2)} SEK</strong> has been released.
                </p>
                <p style="font-size:15px; color:#999999; margin:0 0 10px;">
                  Please allow <strong>5–7 working days</strong> for funds to clear.
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
  );
  const ownerFirstName =
    owner?.personalProfile?.firstName || "there";

  await sendEmail(
    owner.email,
    "Payout Processed",
    `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Payout Processed</title>
  </head>

  <body style="
    font-family: Arial, sans-serif;
    background:#f5f5f5;
    padding:30px;
  ">

    <div style="
      max-width:600px;
      margin:auto;
      background:white;
      padding:30px;
      border-radius:8px;
      border-top:6px solid #17a34a;
    ">

      <div style="text-align:center; margin-bottom:20px;">
        <img
         alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;"
        />
      </div>

      <h2 style="color:#111;">
        Hi ${ownerFirstName},
      </h2>

      <p style="
        font-size:16px;
        color:#444;
        line-height:1.7;
      ">
        Your payout of
        <strong>${adjustedOwnerPayout.toFixed(2)} SEK</strong>
        is on its way.
      </p>

      <p style="
        font-size:16px;
        color:#444;
        line-height:1.7;
      ">
        It may take 3–5 working days to appear in your account.
      </p>

      <p style="
        margin-top:30px;
        color:#888;
      ">
        — RentMyBike Team
      </p>

    </div>

  </body>
  </html>`
  );
  return {
    message: dispute?.status === "resolved"
      ? `Ride completed. ${dispute.disputeAmount} SEK penalty deducted from deposit.`
      : "Ride completed. Full deposit refunded to renter.",
    dispute: dispute
      ? { disputeId: dispute._id, status: dispute.status, disputeAmount: dispute.disputeAmount }
      : null,
    depositRefund: {
      refundId: refund.id,
      amount: renterRefund,
      currency: payment.currency,
    },
    ownerPayout: {
      transferId: transfer.id,
      amount: adjustedOwnerPayout,
      penaltyIncluded: dispute?.status === "resolved" ? dispute.disputeAmount : 0,
      currency: payment.currency,
    },
  };
};

// ─────────────────────────────────────────────────────────────
// KEPT — for cancellations only (ride never started)
// Refunds deposit only. Owner gets nothing.
// ─────────────────────────────────────────────────────────────
export const refundDepositService = async (bookingId: string) => {
  // ── Fetch Booking ──
  //const booking = await Booking.findById(bookingId);
  const [booking, dispute] = await Promise.all([
    Booking.findById(bookingId).lean(),
    Dispute.findOne({
      bookingId,
      status: "resolved",   // only apply penalty if dispute is resolved
    }).lean(),
  ]);
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
  payment.status = "refunded";
  payment.stripeRefundId = refund.id;
  payment.refundAmount = depositAmount;
  payment.refundReason = "Booking cancelled before ride started";
  payment.refundedAt = new Date();
  await payment.save();

  // STEP 3: Update Booking record
  booking.status = "cancelled";
  booking.cancelledBy = "renter";
  booking.cancellationReason = "Cancelled before ride started";
  booking.cancelledAt = new Date();
  await booking.save();

  return {
    message: "Deposit refunded successfully",
    refundId: refund.id,
    amount: depositAmount,
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


export const cancelBookingService = async (
  bookingId: string,
  userId: string,
  reason?: string
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // ── Who is cancelling ──
  const isRenter = booking.renterId.toString() === userId;
  const isOwner = booking.ownerId.toString() === userId;

  if (!isRenter && !isOwner) {
    throw new Error("Only the renter or owner can cancel this booking");
  }

  // ── Can only cancel if upcoming or startRequested ──
  if (!["upcoming", "startRequested"].includes(booking.status)) {
    throw new Error(`Cannot cancel. Current status: ${booking.status}`);
  }

  // ── Get payment record ──
  const payment = await Payment.findOne({
    bookingId: booking._id,
    type: "booking",
  });
  if (!payment) throw new Error("Payment record not found for this booking");
  if (!payment.stripePaymentIntentId) throw new Error("Stripe PaymentIntent ID missing");

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

  // ── Check owner KYC (needed for transfer) ──
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

  const depositAmount = payment.depositAmount ?? 0;   // refunded to renter
  const ownerPayout = payment.ownerPayout ?? 0;   // sent to owner
  const fullRefundAmount = payment.amount ?? 0;

  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
    amount: fullRefundAmount * 100,                      // only deposit in öre
    reason: "requested_by_customer",
  });


  // const transfer = await stripe.transfers.create({
  //   amount: ownerPayout * 100,                        // rental portion in öre
  //   currency: "sek",
  //   destination: owner.businessProfile.stripeIdentityId,
  //   source_transaction: paymentIntent.latest_charge as string,
  //   metadata: {
  //     bookingId: booking._id.toString(),
  //     paymentId: payment._id.toString(),
  //   },
  // });


  payment.status = "refunded";
  payment.stripeChargeId = paymentIntent.latest_charge as string;
  payment.stripeRefundId = refund.id;
  payment.refundAmount = depositAmount;
  payment.refundReason = `Booking cancelled by ${isRenter ? "renter" : "owner"}`;
  payment.refundedAt = new Date();
  payment.paidAt = new Date();
  await payment.save();


  booking.status = "cancelled";
  booking.cancelledBy = isRenter ? "renter" : "owner";
  booking.cancellationReason = reason ?? undefined;
  booking.cancelledAt = new Date();
  await booking.save();
  const renter = await User.findById(booking.renterId);
  const firstName = renter?.personalProfile?.firstName ?? "there";
  const bookingShortId = booking._id;
  await sendEmail(
    renter?.email!,
    "Booking Cancelled",
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Cancellation</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
    </head>
    <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
      <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
        <thead>
          <tr>
            <th>
              <img alt="Logo"
    src="cid:rentmybikelogo"
    width="140"
    style="display:block; margin:0 auto;">
            </th>
          </tr>
        </thead>
        <tbody style="width:100%">
          <tr style="width:100%">
            <td>
              <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                  Hi ${firstName},
                </h3>
                <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                  Your booking has been cancelled
                </p>
                <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                  Booking Cancellation
                </h2>

                <!-- Cancellation Details Card -->
                <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Booking ID
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      #${bookingShortId}
                    </td>
                  </tr>
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Cancelled By
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${isRenter ? "Renter" : "Owner"}
                    </td>
                  </tr>
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Cancelled At
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${new Date().toLocaleDateString("en-SE", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                  ${reason ? `
                  <tr style="background:#f9f9f9;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                      Reason
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                      ${reason}
                    </td>
                  </tr>` : ""}
                  <tr style="background:#ffffff;">
                    <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left;">
                      Refund Amount
                    </td>
                    <td style="padding:12px 20px; font-size:15px; font-weight:700; color:#17a34a; text-align:right;">
                      ${fullRefundAmount.toFixed(2)} SEK
                    </td>
                  </tr>
                </table>

                <p style="font-size:16px; font-weight:400; color:#444; margin:20px 0 6px;">
                  Eligible refunds will be processed automatically.
                </p>
                <p style="font-size:15px; color:#999999; margin:0 0 10px;">
                  Please allow <strong>2–5 business days</strong> for funds to clear.
                </p>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>`
  );
  return {
    message: "Booking cancelled. Deposit refunded to renter, rental amount sent to owner.",
    bookingId: booking._id,
    cancelledBy: booking.cancelledBy,
    depositRefund: {
      refundId: refund.id,
      amount: depositAmount,
      currency: payment.currency,
    },
    ownerPayout: {
      transferId: refund.id,
      amount: ownerPayout,
      currency: payment.currency,
    },
  };
};
