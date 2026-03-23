import {  Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../types/auth-request";

import { Types } from "mongoose";
import Bike from "../Models/Booking";
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
       email: string;
      name: string;
      systemRole: "user" | "admin";
      
    };

    req.user = {
      userId: new Types.ObjectId(decoded.userId),
      systemRole: decoded.systemRole,
       email: decoded.email,
      name: decoded.name,

    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export const isBikeOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const userId = req.user?.userId;
    const booking= await Bike.findById(bookingId).lean();
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });
      return;
    }
    const bikeId = booking.bikeId;
    if (!userId) {

      res.status(401).json({
        success: false,
        message: "Unauthorized: No user found in request",
      });
      return;
    }

    // const bike = await Bike.findById(bikeId).lean();

    // if (!bike) {
    //   res.status(404).json({
    //     success: false,
    //     message: "Bike not found",
    //   });
    //   return;
    // }

    // Compare bike owner with logged-in user
    if (booking.ownerId.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not the owner of this bike",
      });
      return;
    }

    // Attach bike to request for downstream use (optional but useful)
    (req as any).bike = booking;

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Middleware: isAdmin
 * Must be used AFTER authMiddleware
 * Checks that req.user.systemRole === "admin"
 */
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
 
  if (req.user.systemRole !== "admin") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Admin access only",
    });
    return;
  }
 
  next();
};