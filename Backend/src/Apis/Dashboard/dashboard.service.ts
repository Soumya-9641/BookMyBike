import { Types } from "mongoose";
import Booking from "../../Models/Booking";
import Listing from "../../Models/Listing";
import User from "../../Models/User";



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

  return {
    id: user._id,
    first_name: user.personalProfile.firstName,
    last_name: user.personalProfile.lastName,
    email: user.email,
    phone: user.personalProfile.phone,
    city: user.personalProfile.city,
    address: user.personalProfile.address,
   
  };
};


