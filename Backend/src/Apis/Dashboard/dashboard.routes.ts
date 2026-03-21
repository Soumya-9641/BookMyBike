

import { Router, Request, Response } from "express";
import stripe from "../../Utils/stripe";
import { authMiddleware } from "../../Middlewares/auth.middleware";
import { AuthRequest } from "../../types/auth-request";
import Booking from "../../Models/Booking";
import User from "../../Models/User";
import { checkStripeOnboardingStatus, getOwnerBookingsService,getOwnerListingsService, getRefundedBookingsService, getRenterBookingsService,getUserProfile, updateUserProfile} from "./dashboard.service";
import { Types } from "mongoose";
const router = Router();


router.get(
  "/mybookings",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const bookings = await getRenterBookingsService(userId);

      res.status(200).json({
        count: bookings.length,
        bookings
      });

    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to fetch bookings"
      });
    }
  }
);

router.get(
  "/ownerbookings",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const bookings = await getOwnerBookingsService(userId);

      res.status(200).json({
        count: bookings.length,
        bookings
      });

    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to fetch owner bookings"
      });
    }
  }
);

router.get(
  "/mylistings",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const ownerId = req.user!.userId;

      const listings = await getOwnerListingsService(ownerId);

      res.status(200).json({
        count: listings.length,
        listings
      });

    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to fetch listings"
      });
    }
  }
);

router.get(
  "/myrefunds",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const bookings = await getRefundedBookingsService(userId);

      res.status(200).json({
        count: bookings.length,
        bookings
      });

    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Failed to fetch refunded bookings"
      });
    }
  }
);


router.get("/profile", authMiddleware, async (req:AuthRequest, res:Response) => {
  try {
    const userId = req.user!.userId;
    const status = await checkStripeOnboardingStatus(req.user!.userId);
    //console.log("Stripe onboarding status for user", userId, ":", status); // Debug log to check the Stripe onboarding status

    const profile = await getUserProfile(userId);
   // console.log("User profile data:", profile); // Debug log to check the user profile data
    
   // console.log("Stripe onboarding status:", status); // Debug log to check the Stripe onboarding status
    if (status.isOnboarded) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          "businessProfile.isVerified": true,
          "businessProfile.isActive": true,
        },
      });
    }
    return res.status(200).json({
      success: true,
      data: profile,
     isStripeConnected: status.isOnboarded
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

router.put("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { firstName, middleName, lastName, phone, city, address, email, ...rest } = req.body; 

    if (email) {
      return res.status(400).json({ success: false, message: "Email cannot be changed" });
    }

    const allowedFields = ["firstName", "middleName", "lastName", "phone", "city", "address"]; 
    const unknownFields = Object.keys(rest).filter((f) => !allowedFields.includes(f));
    if (unknownFields.length > 0) {
      return res.status(400).json({ success: false, message: `Fields not allowed: ${unknownFields.join(", ")}` });
    }

    if (!firstName && !middleName && !lastName && !phone && !city && !address) { 
      return res.status(400).json({ success: false, message: "At least one field is required to update" });
    }

    const updated = await updateUserProfile(userId, { firstName, middleName, lastName, phone, city, address });

    return res.status(200).json({ success: true, message: "Profile updated successfully", data: updated });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
  }
});

export default router;

