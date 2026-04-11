import express, { Response } from "express";
import { authMiddleware, isAdmin } from "../../Middlewares/auth.middleware";
import { addAdminService, deleteUserService, getAdminStatsService, getAllUsersService,
   getUserBookingSummaryService,getAllAdminsService,blockUserService,
   getAllBookingsService, 
   changeAdminPasswordService,
   getAllListingsService} from "./admin.service";
import { AuthRequest } from "../../types/auth-request";
import mongoose from "mongoose";


const router = express.Router();
 
// All admin routes require auth + admin role
router.use(authMiddleware, isAdmin);
 
/**
 * @route   GET /api/v1/admin/users
 * @desc    Get list of all users
 * @access  Admin
 */
router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});


/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get platform-wide stats (users, listings, bookings, revenue)
 * @access  Admin
 */
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const stats = await getAdminStatsService();
    res.status(200).json({ success: true, data: stats });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});


/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete a user account
 * @access  Admin
 */
router.delete("/users/:id", async (req: AuthRequest, res: Response) => {
  try {
    const result = await deleteUserService(req.params.id, req.user!.userId);
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

/**
 * @route   POST /api/v1/admin/add
 * @desc    Create a new admin account (from Add Admin form popup)
 * @access  Admin
 * @body    { email, password, firstName?, lastName? }
 */
router.post("/addAdmin", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }
 
    const result = await addAdminService({ email, password, firstName, lastName });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
});

router.get("/:userId/bookings", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    const data = await getUserBookingSummaryService(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user bookings",
    });
  }
});

router.get(
  "/allbookings",
  
  async (req: AuthRequest, res: Response)=> {
    try {
      const bookings = await getAllBookingsService();
      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch bookings",
      });
    }
  }
);

router.get(
  "/all",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const admins = await getAllAdminsService();
      res.status(200).json({
        success: true,
        count: admins.length,
        admins,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch admins" });
    }
  }
);

router.patch(
  "/block/:userId",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await blockUserService(req.params.userId);
      res.status(200).json({
        success: true,
        message: "User blocked successfully",
        user,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to block user" });
    }
  }
);
router.patch(
  "/changePassword",
  
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: "currentPassword and newPassword are required",
        });
        return;
      }

      await changeAdminPasswordService(
        req.user!.userId.toString(),
        { currentPassword, newPassword }
      );

      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);
 
router.get(
  "/alllistings",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const listings = await getAllListingsService();
      res.status(200).json({
        success: true,
        count: listings.length,
        listings,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch listings" });
    }
  }
);


export default router;
