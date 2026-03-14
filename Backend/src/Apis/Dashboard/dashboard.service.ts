import mongoose, { Types } from "mongoose";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";
import stripe from "../../Utils/stripe";

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

export const getRenterBookingsService = async ( userId: Types.ObjectId) => {
  const bookings = await Booking.find({
    renterId: userId
  })
    .populate("bikeId")
    .populate("ownerId", "email personalProfile.firstName personalProfile.lastName")
    .sort({ createdAt: -1 });

  return bookings;
};

export const getOwnerBookingsService = async (userId: Types.ObjectId) => {
  const bookings = await Booking.find({
    ownerId: userId
  })
    .populate("bikeId")
    .populate("renterId", "email personalProfile.firstName personalProfile.lastName")
    .sort({ createdAt: -1 });

  return bookings;
};



export const getOwnerListingsService = async (
  ownerId: Types.ObjectId
) => {
  const listings = await Listing.find({
    ownerId: ownerId
  }).sort({ createdAt: -1 });

  return listings;
};

export const getRefundedBookingsService = async (
  userId: Types.ObjectId
) => {
  const bookings = await Booking.find({
    renterId: userId,
    depositRefunded: { $exists: true, $ne: null }
  })
    .populate("bikeId")
    .populate("ownerId", "email personalProfile.firstName personalProfile.lastName")
    .sort({ createdAt: -1 });

  return bookings;
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

