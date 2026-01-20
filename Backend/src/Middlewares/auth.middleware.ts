import {  Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../types/auth-request";

import { Types } from "mongoose";
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
      systemRole: "user" | "admin";
    };

    req.user = {
      userId: new Types.ObjectId(decoded.userId),
      systemRole: decoded.systemRole
    };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};