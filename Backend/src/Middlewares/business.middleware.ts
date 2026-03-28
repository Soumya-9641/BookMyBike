import { Response, NextFunction } from "express";
import User from "../Models/User";
import { AuthRequest } from "../types/auth-request";

export const requireBusinessUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    if (!user.businessProfile || !user.businessProfile.isActive) {
      return res.status(403).json({
        message: "Business account not enabled"
      });
    }

    if (!user.businessProfile.isVerified) {
      return res.status(403).json({
        message: "Business account not verified"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Business validation failed" });
  }
};
