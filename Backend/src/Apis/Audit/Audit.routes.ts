import { Router, Request, Response } from "express";
import Audit from "../../Models/Audit";
import { createMonthlyAuditService, getYearlyAuditService } from "./Audit.services";
const router = Router();

router.get("/testing", async (req: Request, res: Response) => {
    try {

        res.status(200).json({
            message: "Audit API is working fine"
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Failed to fetch bookings"
        });
    }
})

router.post("/generateAudit", async (req: Request, res: Response) => {
    try {
        const year = Number(req.query.year);

        if (!year || !Number.isInteger(year)) {
            return res.status(400).json({
                success: false,
                message: "Valid year is required",
            });
        }

        const audit = await getYearlyAuditService(year);

        return res.status(200).json({
            success: true,
            message: "Yearly audit fetched successfully",
            year,
            data: audit,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to fetch yearly audit",
        });
    }
})


router.post("/createAudit", async (req: Request, res: Response) => {
    try {
        const {
            year,
            month,
            monthName,
            totalBookings,
            completedBookings,
            cancelledBookings,
            totalAdminAmount,
            stripeFee,
            platformProfit,
        } = req.body;
        const existingAudit = await Audit.findOne({ year, month });
        if (existingAudit) {
            return res.status(400).json({
                success: false,
                message: "Audit for this year and month already exists"
            });
        }
        const audit = await createMonthlyAuditService({
            year: Number(year),
            month: Number(month),
            monthName: String(monthName),
            totalBookings: Number(totalBookings),
            completedBookings: Number(completedBookings),
            cancelledBookings: Number(cancelledBookings),

            totalAdminAmount: Number(totalAdminAmount),
            stripeFee: Number(stripeFee),
            platformProfit: Number(platformProfit),
        });
        return res.status(201).json({
            success: true,
            message: "Monthly audit created successfully",
            data: audit,
        });
    }
    catch (error: any) {
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Audit record already exists for this year and month",
            });
        }

        return res.status(400).json({
            success: false,
            message:
                error.message || "Failed to create monthly audit",
        });
    }

})


export default router;