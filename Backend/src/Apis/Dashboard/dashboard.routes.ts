

import { Router, Request, Response } from "express";
import stripe from "../../Utils/stripe";
import { authMiddleware } from "../../Middlewares/auth.middleware";
import { AuthRequest } from "../../types/auth-request";
import Booking from "../../Models/Booking";
import User from "../../Models/User";
import { getOwnerBookingsService,getOwnerListingsService, getRefundedBookingsService, getRenterBookingsService} from "./dashboard.service";
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
    const profile = await getUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});
export default router;

function getUserProfile(userId: Types.ObjectId) {
  throw new Error("Function not implemented.");
}
