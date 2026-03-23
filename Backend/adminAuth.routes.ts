import express, { Request, Response } from "express";
import { authMiddleware } from "../../Middlewares/auth.middleware";


import { AuthRequest } from "../../types/auth-request";
import {
  adminRegisterService,
  adminLoginService,
} from "./adminAuth.service";

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// ADMIN LOGIN
// Public route — no auth required
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/admin/auth/login
 * @desc    Admin login — returns JWT with systemRole: "admin"
 * @access  Public
 * @body    { email: string, password: string }
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const result = await adminLoginService({ email, password });

    res.status(200).json({ success: true, data: result ,token: result.token});
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Login failed",
    });
  }
});

// ─────────────────────────────────────────────────────────────
// ADMIN REGISTER
// Protected — only an existing admin can create another admin
// ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/v1/admin/auth/register
 * @desc    Register a new admin (must be called by existing admin)
 * @access  Admin only
 * @body    { email: string, password: string, firstName?: string, lastName?: string }
 */
router.post(
  "/register",
  
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName,phoneNumber } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "email and password are required",
        });
      }

    //   if (password.length < 8) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Password must be at least 8 characters",
    //     });
    //   }

      const result = await adminRegisterService({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });

      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Registration failed",
      });
    }
  }
);

export default router;