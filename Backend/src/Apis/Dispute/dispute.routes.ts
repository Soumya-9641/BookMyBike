
import { Router, Request, Response } from "express";
import { authMiddleware,isAdmin } from "../../Middlewares/auth.middleware";
import { createDisputeService ,updateDisputeService,getDisputeDetailService,getAllDisputesService} from "./dispute.services";
import { AuthRequest } from "../../types/auth-request";
import multer from "multer";
import path from "path";
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