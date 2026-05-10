
import { Router, Request, Response } from "express";
import { authMiddleware,isAdmin } from "../../Middlewares/auth.middleware";
import { createDisputeService ,updateDisputeService,getDisputeDetailService,getAllDisputesService} from "./dispute.services";
import { AuthRequest } from "../../types/auth-request";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import Dispute from "../../Models/Dispute";
const router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/disputes/"),
  filename:    (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const uploadDisputeImages = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Only image files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
});

router.post(
  "/createDispute",
  authMiddleware,
   uploadDisputeImages.array("images", 1),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
       const files = req.files as Express.Multer.File[];
      const imagePaths = files?.length
        ? files.map((file) => `/uploads/disputes/${file.filename}`)
        : [];
      
      const dispute = await createDisputeService(
        req.user!.userId.toString(),
        { ...req.body, images: imagePaths }
      );
      res.status(201).json({
        success: true,
        message: "Dispute created successfully",
        dispute,
      });
    } catch (err: any) {
        if (err.statusCode === 409) {
        res.status(409).json({
          success: false,
          message: err.message,
          existingDispute: err.dispute,
        });
        return;
      }
      res.status(500).json({ message: err.message || "Failed to create dispute" });
    }
  }
);

router.patch(
  "/updateDispute/:disputeId",
authMiddleware,
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const dispute = await updateDisputeService(req.params.disputeId, req.body);
      res.status(200).json({
        success: true,
        message: "Dispute updated successfully",
        dispute,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to update dispute" });
    }
  }
);

router.patch(
  "/updateDispute",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { disputeId, status } = req.body;

      if (!disputeId) {
        res.status(400).json({ success: false, message: "disputeId is required" });
        return;
      }

      if (!status) {
        res.status(400).json({ success: false, message: "status is required" });
        return;
      }

      // ── Only allow resolved or rejected ──
      const allowedStatuses = ["resolved", "rejected"];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: "Invalid status. Only 'resolved' or 'rejected' are allowed",
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(disputeId)) {
        res.status(400).json({ success: false, message: "Invalid disputeId" });
        return;
      }

      const dispute = await Dispute.findByIdAndUpdate(
        disputeId,
        {
          status,
          ...(status === "resolved" && { resolvedAt: new Date() }),
        },
        { new: true, runValidators: true }
      );

      if (!dispute) {
        res.status(404).json({ success: false, message: "Dispute not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Dispute ${status} successfully`,
        dispute,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || "Failed to update dispute" });
    }
  }
);

router.get(
  "/dispute/:disputeId",
  authMiddleware,
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await getDisputeDetailService(req.params.disputeId);
      res.status(200).json({
        success: true,
        ...data,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch dispute" });
    }
  }
);

router.get(
  "/getall",
  authMiddleware,
  isAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const disputes = await getAllDisputesService();
      res.status(200).json({
        success: true,
        count: disputes.length,
        disputes,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Failed to fetch disputes" });
    }
  }
);
export default router;