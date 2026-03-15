import mongoose, { Types } from "mongoose";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";
import stripe from "../../Utils/stripe";
import Payment from "../../Models/Payment";

export interface ProfileResponse {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  isVerified: boolean;
  memberSince: Date;
  isBlocked: boolean;
  isBusinessProfile: boolean;
  businessProfile?: {
    businessName: string;
    orgNumber: string;
    location: string;
    phone: string;
    isVerified: boolean;
    isActive: boolean;
  } | null;
}


export const getRenterBookingsService = async (userId: Types.ObjectId) => {
  const bookings = await Booking.find({ renterId: userId })
    .populate("bikeId")
    .populate("ownerId", "email personalProfile.firstName personalProfile.lastName personalProfile.phone")
    .populate(
      "paymentId",
      "status amount currency depositAmount platformFee vatAmount platformNet ownerPayout stripePaymentIntentId refundAmount refundReason refundedAt paidAt"
    )
    .sort({ createdAt: -1 })
    .lean();
 
  return bookings.map((booking) => {
    const owner   = booking.ownerId   as any;
    const bike    = booking.bikeId    as any;
    const payment = booking.paymentId as any;
 
    return {
      // ── Booking Core ──
      bookingId: booking._id,
      status:    booking.status,
      startDate: booking.startDate,
      endDate:   booking.endDate,
      totalDays: booking.totalDays,
      notes:     booking.notes ?? null,
      createdAt: booking.createdAt,
 
      // ── Pricing Snapshot ──
      pricing: {
        pricePerDay:     booking.pricePerDay,
        totalAmount:     booking.totalAmount,
        securityDeposit: booking.securityDeposit ?? 0,
        currency:        booking.currency,
      },
 
      // ── Ride Info ──
      ride: {
        actualStartTime: booking.actualStartTime ?? null,
        actualEndTime:   booking.actualEndTime   ?? null,
        penaltyAmount:   booking.penaltyAmount   ?? 0,
        penaltyReason:   booking.penaltyReason   ?? null,
      },
 
      // ── Cancellation (only if cancelled) ──
      ...(booking.status === "cancelled" && {
        cancellation: {
          cancelledBy:        booking.cancelledBy        ?? null,
          cancellationReason: booking.cancellationReason ?? null,
          cancelledAt:        booking.cancelledAt        ?? null,
        },
      }),
 
      // ── Rejection (only if rejected) ──
      ...(booking.status === "rejected" && {
        rejection: {
          rejectedReason: booking.rejectedReason ?? null,
        },
      }),
 
      // ── Owner Info ──
      owner: owner
        ? {
            ownerId:   owner._id,
            email:     owner.email,
            firstName: owner.personalProfile?.firstName ?? null,
            lastName:  owner.personalProfile?.lastName  ?? null,
            phone:     owner.personalProfile?.phone     ?? null,
          }
        : null,
 
      // ── Listing (Bike) Info ──
      bike: bike
        ? {
            bikeId:        bike._id,
            title:         bike.title         ?? null,
            photos:        bike.photos        ?? [],
            brand:         bike.brand         ?? null,
            modelbike:     bike.modelbike      ?? null,
            category:      bike.category      ?? null,
            size:          bike.size          ?? null,
            rates:         bike.rates         ?? null,
            depositAmount: bike.depositAmount ?? 0,
            location: {
              address:     bike.location?.address     ?? null,
              city:        bike.location?.city        ?? null,
              coordinates: bike.location?.coordinates ?? null,
            },
          }
        : null,
 
      // ── Payment Info ──
      payment: payment
        ? {
            paymentId:             payment._id,
            status:                payment.status,
            amount:                payment.amount,
            currency:              payment.currency,
            depositAmount:         payment.depositAmount  ?? 0,
            platformFee:           payment.platformFee    ?? 0,
            vatAmount:             payment.vatAmount      ?? 0,
            platformNet:           payment.platformNet    ?? 0,
            ownerPayout:           payment.ownerPayout    ?? 0,
            stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
            refundAmount:          payment.refundAmount   ?? null,
            refundReason:          payment.refundReason   ?? null,
            refundedAt:            payment.refundedAt     ?? null,
            paidAt:                payment.paidAt         ?? null,
          }
        : null,
    };
  });
};


export const getOwnerBookingsService = async (userId: Types.ObjectId) => {
  const bookings = await Booking.find({ ownerId: userId })
    .populate("bikeId")
    .populate("renterId", "email personalProfile.firstName personalProfile.lastName personalProfile.phone")
    .populate(
      "paymentId",
      "status amount currency depositAmount platformFee vatAmount platformNet ownerPayout stripePaymentIntentId refundAmount refundReason refundedAt paidAt"
    )
    .sort({ createdAt: -1 })
    .lean();
 
  return bookings.map((booking) => {
    const renter = booking.renterId as any;
    const bike   = booking.bikeId   as any;
    const payment = booking.paymentId as any;
 
    return {
      // ── Booking Core ──
      bookingId:    booking._id,
      status:       booking.status,
      startDate:    booking.startDate,
      endDate:      booking.endDate,
      totalDays:    booking.totalDays,
      notes:        booking.notes ?? null,
      createdAt:    booking.createdAt,
 
      // ── Pricing Snapshot ──
      pricing: {
        pricePerDay:     booking.pricePerDay,
        totalAmount:     booking.totalAmount,
        securityDeposit: booking.securityDeposit ?? 0,
        currency:        booking.currency,
      },
 
      // ── Ride Info ──
      ride: {
        actualStartTime: booking.actualStartTime ?? null,
        actualEndTime:   booking.actualEndTime   ?? null,
        penaltyAmount:   booking.penaltyAmount   ?? 0,
        penaltyReason:   booking.penaltyReason   ?? null,
      },
 
      // ── Cancellation / Rejection ──
      ...(booking.status === "cancelled" && {
        cancellation: {
          cancelledBy:        booking.cancelledBy,
          cancellationReason: booking.cancellationReason ?? null,
          cancelledAt:        booking.cancelledAt ?? null,
        },
      }),
      ...(booking.status === "rejected" && {
        rejection: {
          rejectedReason: booking.rejectedReason ?? null,
        },
      }),
 
      // ── Renter Info ──
      renter: renter
        ? {
            renterId:  renter._id,
            email:     renter.email,
            firstName: renter.personalProfile?.firstName ?? null,
            lastName:  renter.personalProfile?.lastName  ?? null,
            phone:     renter.personalProfile?.phone     ?? null,
          }
        : null,
 
      // ── Listing (Bike) Info ──
      bike: bike
        ? {
            bikeId:        bike._id,
            title:         bike.title         ?? null,
            photos:        bike.photos        ?? [],
            brand:         bike.brand         ?? null,
            modelbike:     bike.modelbike      ?? null,
            category:      bike.category      ?? null,
            size:          bike.size          ?? null,
            rates:         bike.rates         ?? null,
            depositAmount: bike.depositAmount ?? 0,
            location:      bike.location      ?? null,
          }
        : null,
 
      // ── Payment Info ──
      payment: payment
        ? {
            paymentId:             payment._id,
            status:                payment.status,
            amount:                payment.amount,
            currency:              payment.currency,
            depositAmount:         payment.depositAmount  ?? 0,
            platformFee:           payment.platformFee    ?? 0,
            vatAmount:             payment.vatAmount      ?? 0,
            platformNet:           payment.platformNet    ?? 0,
            ownerPayout:           payment.ownerPayout    ?? 0,
            stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
            refundAmount:          payment.refundAmount   ?? null,
            refundReason:          payment.refundReason   ?? null,
            refundedAt:            payment.refundedAt     ?? null,
            paidAt:                payment.paidAt         ?? null,
          }
        : null,
    };
  });
};



export const getOwnerListingsService = async (ownerId: Types.ObjectId) => {
  const listings = await Listing.find({ ownerId })
    .sort({ createdAt: -1 })
    .lean();
 
  return listings.map((listing) => ({
    // ── Core ──
    listingId:   listing._id,
    title:       listing.title,
    description: listing.description ?? null,
    isPublished: listing.isPublished,
    createdAt:   listing.createdAt,
 
    // ── Bike Details ──
    bike: {
      brand:     listing.brand,
      modelbike: listing.modelbike,
      size:      listing.size,
      category:  listing.category,
    },
 
    // ── Media ──
    photos: listing.photos ?? [],
 
    // ── Accessories ──
    accessories: listing.accessories ?? [],
 
    // ── Pricing ──
    rates: {
      hourly:  listing.rates?.hourly  ?? null,
      daily:   listing.rates?.daily   ?? null,
      weekly:  listing.rates?.weekly  ?? null,
      monthly: listing.rates?.monthly ?? null,
    },
    depositAmount: listing.depositAmount,
 
    // ── Location ──
    location: {
      address:     listing.location?.address     ?? null,
      city:        listing.location?.city        ?? null,
      coordinates: listing.location?.coordinates ?? null,
    },
  }));
};

export const getRefundedBookingsService = async (userId: Types.ObjectId) => {
  // ── Step 1: Find all refunded Payment records for this renter ──
  // Refund happens in two cases:
  //   - status: "refunded"   → cancelled before ride (full deposit back)
  //   - status: "succeeded"  → ride completed (deposit returned + owner paid)
  const refundedPayments = await Payment.find({
    payerId: userId,
    status: { $in: ["refunded", "succeeded"] },
    stripeRefundId: { $exists: true, $ne: null },  // refund actually happened
  })
    .select("bookingId status amount depositAmount refundAmount refundReason refundedAt paidAt stripeRefundId")
    .lean();
 
  if (!refundedPayments.length) return [];
 
  // ── Step 2: Extract bookingIds ──
  const bookingIds = refundedPayments.map((p) => p.bookingId);
 
  // ── Step 3: Fetch matching Bookings ──
  const bookings = await Booking.find({ _id: { $in: bookingIds } })
    .populate("bikeId")
    .populate("ownerId", "email personalProfile.firstName personalProfile.lastName personalProfile.phone")
    .sort({ createdAt: -1 })
    .lean();
 
  // ── Step 4: Map payment data onto each booking ──
  const paymentMap = new Map(
    refundedPayments.map((p) => [p.bookingId.toString(), p])
  );
 
  return bookings.map((booking) => {
    const owner   = booking.ownerId as any;
    const bike    = booking.bikeId  as any;
    const payment = paymentMap.get(booking._id.toString());
 
    return {
      // ── Booking Core ──
      bookingId: booking._id,
      status:    booking.status,
      startDate: booking.startDate,
      endDate:   booking.endDate,
      totalDays: booking.totalDays,
      createdAt: booking.createdAt,
 
      // ── Pricing Snapshot ──
      pricing: {
        pricePerDay:     booking.pricePerDay,
        totalAmount:     booking.totalAmount,
        securityDeposit: booking.securityDeposit ?? 0,
        currency:        booking.currency,
      },
 
      // ── Ride Info ──
      ride: {
        actualStartTime: booking.actualStartTime ?? null,
        actualEndTime:   booking.actualEndTime   ?? null,
      },
 
      // ── Cancellation (if cancelled) ──
      ...(booking.status === "cancelled" && {
        cancellation: {
          cancelledBy:        booking.cancelledBy        ?? null,
          cancellationReason: booking.cancellationReason ?? null,
          cancelledAt:        booking.cancelledAt        ?? null,
        },
      }),
 
      // ── Owner Info ──
      owner: owner
        ? {
            ownerId:   owner._id,
            email:     owner.email,
            firstName: owner.personalProfile?.firstName ?? null,
            lastName:  owner.personalProfile?.lastName  ?? null,
            phone:     owner.personalProfile?.phone     ?? null,
          }
        : null,
 
      // ── Listing (Bike) Info ──
      bike: bike
        ? {
            bikeId:        bike._id,
            title:         bike.title         ?? null,
            photos:        bike.photos        ?? [],
            brand:         bike.brand         ?? null,
            modelbike:     bike.modelbike      ?? null,
            category:      bike.category      ?? null,
            location: {
              address:     bike.location?.address     ?? null,
              city:        bike.location?.city        ?? null,
            },
          }
        : null,
 
      // ── Refund Info (from Payment record) ──
      refund: payment
        ? {
            paymentStatus:  payment.status,
            amountCharged:  payment.amount,
            depositAmount:  payment.depositAmount  ?? 0,
            refundAmount:   payment.refundAmount   ?? 0,
            refundReason:   payment.refundReason   ?? null,
            refundedAt:     payment.refundedAt     ?? null,
            stripeRefundId: payment.stripeRefundId ?? null,
            paidAt:         payment.paidAt         ?? null,
          }
        : null,
    };
  });
};
export const getUserProfile = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId).select("-password -__v").lean();

  if (!user) {
    const error = new Error("User not found");
  
    throw error;
  }
  console.log("User profile data:", user); // Debug log to check the user data

  return {
    id: user._id,
    first_name: user.personalProfile.firstName,
    last_name: user.personalProfile.lastName,
    email: user.email,
    phone: user.personalProfile.phone,
    city: user.personalProfile.city,
    address: user.personalProfile.address,
    mobile: user.personalProfile.phone,
    isVerified: user.businessProfile?.isVerified || false
    
  };
};
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


export const updateUserProfile = async (
  userId: Types.ObjectId,
  updates: {
    firstName?: string;
    middleName?: string;  // ✅ added
    lastName?: string;
    phone?: string;
    city?: string;
    address?: string;
  }
) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.firstName  !== undefined) user.personalProfile.firstName  = updates.firstName;
  if (updates.middleName !== undefined) user.personalProfile.middlename = updates.middleName; // ✅ added
  if (updates.lastName   !== undefined) user.personalProfile.lastName   = updates.lastName;
  if (updates.phone      !== undefined) user.personalProfile.phone      = updates.phone;
  if (updates.city       !== undefined) user.personalProfile.city       = updates.city;
  if (updates.address    !== undefined) user.personalProfile.address    = updates.address;
//const objectId = new mongoose.Types.ObjectId(userId);
  await user.save();
  return getUserProfile(userId);
};

