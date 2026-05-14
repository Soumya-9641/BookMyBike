import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../Models/User";
import Booking from "../../Models/Booking";
import Payment from "../../Models/Payment";
import Listing from "../../Models/Listing";


// ─────────────────────────────────────────────────────────────
// 1. GET ALL USERS
// ─────────────────────────────────────────────────────────────
export const getAllUsersService = async () => {
  const users = await User.find({ systemRole: { $ne: "admin" } })
    .select("-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires -__v")
    .sort({ memberSince: -1 })
    .lean();
 
  return users.map((user) => ({
    userId:        user._id,
    email:         user.email,
    systemRole:    user.systemRole,
    emailVerified: user.emailVerified,
    isBlocked:     user.isBlocked,
    memberSince:   user.memberSince,
    isLister:      user.businessProfile?.isVerified === true,  // ← new field

    personalProfile: {
      firstName:  user.personalProfile?.firstName  ?? null,
      middlename: user.personalProfile?.middlename ?? null,
      lastName:   user.personalProfile?.lastName   ?? null,
      phone:      user.personalProfile?.phone      ?? null,
      city:       user.personalProfile?.city       ?? null,
      address:    user.personalProfile?.address    ?? null,
      isVerified: user.personalProfile?.isVerified ?? false,
    },
 
    businessProfile: user.businessProfile
      ? {
          businessName: user.businessProfile.businessName ?? null,
          orgNumber:    user.businessProfile.orgNumber    ?? null,
          location:     user.businessProfile.location     ?? null,
          phone:        user.businessProfile.phone        ?? null,
          isVerified:   user.businessProfile.isVerified   ?? false,
          isActive:     user.businessProfile.isActive     ?? false,
        }
      : null,
  }));
};

export const getAllBookingsService = async () => {
  const bookings = await Booking.find()
    .populate("bikeId")
    .populate("renterId", "email personalProfile.firstName personalProfile.lastName personalProfile.phone")
    .populate("ownerId", "email personalProfile.firstName personalProfile.lastName personalProfile.phone")
    .populate(
      "paymentId",
      "status amount currency depositAmount platformFee vatAmount platformNet ownerPayout stripePaymentIntentId refundAmount refundReason refundedAt paidAt"
    )
    .sort({ createdAt: -1 })
    .lean();

  return bookings.map((booking) => {
    const renter  = booking.renterId as any;
    const owner   = booking.ownerId as any;
    const bike    = booking.bikeId as any;
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
        actualStartTime:  booking.actualStartTime ?? null,
        actualEndTime:    booking.actualEndTime ?? null,
        penaltyAmount:    booking.penaltyAmount ?? 0,
        penaltyReason:    booking.penaltyReason ?? null,
      },

      // ── Flags ──
      flags: {
        renterRequestedStart:     booking.renterRequestedStart ?? false,
        ownerAcceptedStart:       booking.ownerAcceptedStart ?? false,
        ownerRequestedCompletion: booking.ownerRequestedCompletion ?? false,
        renterConfirmedCompletion: booking.renterConfirmedCompletion ?? false,
        isSettlementDone:         booking.isSettlementDone ?? false,
      },

      // ── Cancellation (only if cancelled) ──
      ...(booking.status === "cancelled" && {
        cancellation: {
          cancelledBy:        booking.cancelledBy ?? null,
          cancellationReason: booking.cancellationReason ?? null,
          cancelledAt:        booking.cancelledAt ?? null,
        },
      }),

      // ── Rejection (only if rejected) ──
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
            lastName:  renter.personalProfile?.lastName ?? null,
            phone:     renter.personalProfile?.phone ?? null,
          }
        : null,

      // ── Owner Info ──
      owner: owner
        ? {
            ownerId:   owner._id,
            email:     owner.email,
            firstName: owner.personalProfile?.firstName ?? null,
            lastName:  owner.personalProfile?.lastName ?? null,
            phone:     owner.personalProfile?.phone ?? null,
          }
        : null,

      // ── Listing (Bike) Info ──
      bike: bike
        ? {
            bikeId:        bike._id,
            title:         bike.title ?? null,
            photos:        bike.photos ?? [],
            brand:         bike.brand ?? null,
            modelbike:     bike.modelbike ?? null,
            category:      bike.category ?? null,
            size:          bike.size ?? null,
            rates:         bike.rates ?? null,
            depositAmount: bike.depositAmount ?? 0,
            location: {
              address:     bike.location?.address ?? null,
              city:        bike.location?.city ?? null,
              coordinates: bike.location?.coordinates ?? null,
            },
          }
        : null,

      // ── Payment Info ──
      payment: payment
        ? {
            paymentId:            payment._id,
            status:               payment.status,
            amount:               payment.amount,
            currency:             payment.currency,
            depositAmount:        payment.depositAmount ?? 0,
            platformFee:          payment.platformFee ?? 0,
            vatAmount:            payment.vatAmount ?? 0,
            platformNet:          payment.platformNet ?? 0,
            ownerPayout:          payment.ownerPayout ?? 0,
            stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
            refundAmount:         payment.refundAmount ?? null,
            refundReason:         payment.refundReason ?? null,
            refundedAt:           payment.refundedAt ?? null,
            paidAt:               payment.paidAt ?? null,
          }
        : null,
    };
  });
};

// ─────────────────────────────────────────────────────────────
// 7. GET ADMIN DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
export const getAdminStatsService = async () => {
  const [
    totalUsers,
    blockedUsers,
    totalListings,
    publishedListings,
    totalBookings,
    bookingsByStatus,
    totalPayments,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments({ systemRole: "user" }),
    User.countDocuments({ isBlocked: true }),
    Listing.countDocuments(),
    Listing.countDocuments({ isPublished: true }),
    Booking.countDocuments(),
    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Payment.countDocuments({ status: "succeeded" }),
    Payment.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$platformNet" } } },
    ]),
  ]);
 
  const statusMap = bookingsByStatus.reduce((acc: any, cur: any) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});
 
  return {
    users: {
      total:   totalUsers,
      blocked: blockedUsers,
      active:  totalUsers - blockedUsers,
    },
    listings: {
      total:     totalListings,
      published: publishedListings,
      draft:     totalListings - publishedListings,
    },
    bookings: {
      total:      totalBookings,
      upcoming:   statusMap["upcoming"]   ?? 0,
      inprogress: statusMap["inprogress"] ?? 0,
      completed:  statusMap["completed"]  ?? 0,
      cancelled:  statusMap["cancelled"]  ?? 0,
      rejected:   statusMap["rejected"]   ?? 0,
    },
    revenue: {
      totalTransactions: totalPayments,
      platformNetRevenue: totalRevenue[0]?.total ?? 0,  // excl. VAT
      currency: "SEK",
    },
  };
};

// ─────────────────────────────────────────────────────────────
// 4. DELETE USER ACCOUNT
// ─────────────────────────────────────────────────────────────
export const deleteUserService = async (
  targetUserId: string,
  adminId: Types.ObjectId
) => {
  if (targetUserId === adminId.toString()) {
    const error: any = new Error("Admin cannot delete their own account");
    error.statusCode = 400;
    throw error;
  }
 
  const user = await User.findById(targetUserId);
  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
 
  if (user.systemRole === "admin") {
    const error: any = new Error("Cannot delete another admin account");
    error.statusCode = 403;
    throw error;
  }
 
  await User.findByIdAndDelete(targetUserId);
 
  return {
    message: `User ${user.email} deleted successfully`,
    userId: targetUserId,
  };
};

// ─────────────────────────────────────────────────────────────
// 5. ADD NEW ADMIN
// ─────────────────────────────────────────────────────────────
export const addAdminService = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error: any = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }
 
   const hashedPassword = await bcrypt.hash(password, 12);

    // ── Use new User() + save() to avoid TypeScript overload error with User.create({}) ──
    const user= await User.create({
          email,
          password: hashedPassword,
          emailVerified: false,
          
          systemRole: "admin",
          emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          personalProfile: {
  
            firstName,
            lastName,
            isVerified: false
          }
        });
    await user.save();
 
  return {
    message:  "Admin created successfully",
    adminId:    user._id,
    email:    user.email,
    systemRole: user.systemRole,
  };
};

//get list of booking particular user as renter and lister
export const getUserBookingSummaryService = async (userId: string) => {
  const asRenter = await Booking.find({ renterId: userId })
    .sort({ createdAt: -1 })
    .lean();

  const asOwner = await Booking.find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .lean();

  return {
    userId,
    asRenter: {
      count: asRenter.length,
      bookings: asRenter,
    },
    asOwner: {
      count: asOwner.length,
      bookings: asOwner,
    },
  };
};

export const getAllAdminsService = async () => {
  const admins = await User.find({ 
systemRole
: "admin" })
    .sort({ createdAt: -1 })
    .lean();
  return admins;
};

export const blockUserService = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.isBlocked) throw new Error("User is already blocked");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true }
  ).select("-password -emailVerificationToken -emailVerificationExpires -resetPasswordToken -resetPasswordExpires -__v");

  
  return updatedUser;
};


export const changeAdminPasswordService = async (
  adminId: string,
  body: {
    currentPassword: string;
    newPassword: string;
  }
) => {
  const { currentPassword, newPassword } = body;

  const admin = await User.findById(adminId);
  if (!admin) throw new Error("Admin not found");

  if (admin.systemRole !== "admin") {
    throw new Error("Unauthorized");
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  if (currentPassword === newPassword) {
    throw new Error("New password must be different from current password");
  }

  // Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  admin.password = hashed;
  await admin.save();
};

export const updateListingService = async (
  listingId: string,
  ownerId: string,
  body: Partial<{
    title: string;
    description: string;
    brand: string;
    modelbike: string;
    size: string;
    category: string;
    accessories: string[];
    rates: {
      hourly?: number;
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
    depositAmount: number;
    pickupPoint: string;
    location: {
      type: "Point";
      coordinates: [number, number];
      address: string;
      city: string;
    };
    photos: string[];
  }>
) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new Error("Listing not found");

  // Only owner can edit
  // if (listing.ownerId.toString() !== ownerId) {
  //   throw new Error("You are not authorized to edit this listing");
  // }

  const updated = await Listing.findByIdAndUpdate(
    listingId,
    { $set: body },
    { new: true }
  );

  return updated;
};


export const getAllListingsService = async () => {
  const listings = await Listing.find()
    .sort({ createdAt: -1 })
    .lean();
  return listings;
};

