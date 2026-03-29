
import { Router, Request, Response } from "express";
import { authMiddleware,isAdmin } from "../../Middlewares/auth.middleware";
import { createDisputeService ,updateDisputeService,getDisputeDetailService,getAllDisputesService} from "./dispute.services";
import { AuthRequest } from "../../types/auth-request";

const router = Router();

router.post(
  "/createDispute",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const dispute = await createDisputeService(
        req.user!.userId.toString(),
        req.body
      );
      res.status(201).json({
        success: true,
        message: "Dispute created successfully",
        dispute,
      });
    } catch (err: any) {
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