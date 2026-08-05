import Audit from "../../Models/Audit";
import Booking from "../../Models/Booking";
import Payment from "../../Models/Payment";
interface MonthlyAudit {
    year: number;
    month: number;
    monthName: string;

    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;

    totalAdminAmount: number;
    stripeFee: number;
    platformProfit: number;
    isPayoutEligible: boolean;
    isPayoutDone: boolean;
}
export interface CreateAuditPayload {
    year: number;
    month: number;
    monthName: string;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;

    totalAdminAmount: number;
    stripeFee: number;
    platformProfit: number;
}

export const getYearlyAuditService = async (
    year: number
): Promise<MonthlyAudit[]> => {
    // ─────────────────────────────────────────────
    // Validate Year
    // ─────────────────────────────────────────────

    if (!year || !Number.isInteger(year)) {
        throw new Error("Valid year is required");
    }

    // ─────────────────────────────────────────────
    // Full year date range
    // ─────────────────────────────────────────────

    const yearStart = new Date(Date.UTC(year, 0, 1));
    const yearEnd = new Date(Date.UTC(year + 1, 0, 1));
    console.log(`Year Start: ${yearStart.toISOString()}, Year End: ${yearEnd.toISOString()}`);

    const now = new Date();

    const currentYear = now.getUTCFullYear();

    // getUTCMonth() → 0-11
    // Our month → 1-12
    const currentMonth = now.getUTCMonth() + 1;
    console.log(`Current Year: ${currentYear}, Current Month: ${currentMonth}`);
    // ─────────────────────────────────────────────
    // Aggregate booking financial data
    // ─────────────────────────────────────────────

    const result = await Booking.aggregate([
        // ───────────────────────────────────────────
        // Get relevant bookings for selected year
        // ───────────────────────────────────────────

        {
            $match: {
                $or: [
                    // Settled bookings
                    {
                        settlementDate: {
                            $gte: yearStart,
                            $lt: yearEnd,
                        },
                    },

                    // Cancelled bookings
                    {
                        status: "cancelled",
                        cancelledAt: {
                            $gte: yearStart,
                            $lt: yearEnd,
                        },
                    },
                ],
            },
        },

        // ───────────────────────────────────────────
        // Join Payment collection
        // ───────────────────────────────────────────

        {
            $lookup: {
                from: "payments",
                localField: "paymentId",
                foreignField: "_id",
                as: "payment",
            },
        },

        {
            $unwind: {
                path: "$payment",
                preserveNullAndEmptyArrays: true,
            },
        },

        // ───────────────────────────────────────────
        // Determine which date should define month
        //
        // cancelled  → cancelledAt
        // otherwise  → settlementDate
        // ───────────────────────────────────────────

        {
            $addFields: {
                auditDate: {
                    $cond: [
                        { $eq: ["$status", "cancelled"] },
                        "$cancelledAt",
                        "$settlementDate",
                    ],
                },
            },
        },

        // ───────────────────────────────────────────
        // Group by month
        // ───────────────────────────────────────────

        {
            $group: {
                _id: {
                    $month: "$auditDate",
                },

                totalBookings: {
                    $sum: 1,
                },

                completedBookings: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "completed"] },
                            1,
                            0,
                        ],
                    },
                },

                cancelledBookings: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "cancelled"] },
                            1,
                            0,
                        ],
                    },
                },

                // Sum Payment.platformFee
                totalAdminAmount: {
                    $sum: {
                        $ifNull: ["$payment.platformFee", 0],
                    },
                },

                // Sum Booking.stripeFee
                stripeFee: {
                    $sum: {
                        $ifNull: ["$stripeFee", 0],
                    },
                },
            },
        },

        {
            $sort: {
                _id: 1,
            },
        },
    ]);
    console.log("Audit Aggregation Result:", result.length, "months found");

    // ─────────────────────────────────────────────
    // Month names
    // ─────────────────────────────────────────────
    // ─────────────────────────────────────────────
    // Get existing Audit records for selected year
    // ─────────────────────────────────────────────
    //
    // IMPORTANT:
    // Query once instead of querying 12 times.
    // ─────────────────────────────────────────────

    const auditRecords = await Audit.find({
        year,
    })
        .select("year month isPayoutDone")
        .lean();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // ─────────────────────────────────────────────
    // Money rounding helper
    // ─────────────────────────────────────────────

    const roundMoney = (amount: number): number => {
        return Math.round((amount + Number.EPSILON) * 100) / 100;
    };

    // ─────────────────────────────────────────────
    // Always generate all 12 months
    // ─────────────────────────────────────────────

    const monthlyAudit: MonthlyAudit[] = monthNames.map(
        (monthName, index) => {
            const monthNumber = index + 1;

            const monthData = result.find(
                (item) => item._id === monthNumber
            );
            let isPayoutEligible = false;

            if (year < currentYear) {
                // Entire previous year
                isPayoutEligible = true;
            } else if (
                year === currentYear &&
                monthNumber < currentMonth
            ) {
                // Previous month of current year
                isPayoutEligible = true;
            }
            const existingAudit = auditRecords.find(
                (audit) => audit.month === monthNumber
            );
            const isPayoutDone =
                existingAudit?.isPayoutDone === true;

            // No booking/financial data for this month
            if (!monthData) {
                return {
                    year,
                    month: monthNumber,
                    monthName,

                    totalBookings: 0,
                    completedBookings: 0,
                    cancelledBookings: 0,

                    totalAdminAmount: 0,
                    stripeFee: 0,
                    platformProfit: 0,
                    isPayoutEligible,
                    isPayoutDone,
                };
            }

            const totalAdminAmount = roundMoney(
                Number(monthData.totalAdminAmount || 0)
            );

            const stripeFee = roundMoney(
                Number(monthData.stripeFee || 0)
            );

            const platformProfit = roundMoney(
                totalAdminAmount - stripeFee
            );

            return {
                year,
                month: monthNumber,
                monthName,

                totalBookings: monthData.totalBookings,
                completedBookings: monthData.completedBookings,
                cancelledBookings: monthData.cancelledBookings,

                totalAdminAmount,
                stripeFee,
                platformProfit,
                isPayoutEligible,
                isPayoutDone,
            };
        }
    );

    return monthlyAudit;
};


export const createMonthlyAuditService = async (
    payload: CreateAuditPayload
) => {
    const {
        year,
        month,
        monthName,
        totalBookings,
        completedBookings,
        cancelledBookings,
        totalAdminAmount,
        stripeFee,
        platformProfit
    } = payload;

    // ─────────────────────────────────────────────
    // Validate year
    // ─────────────────────────────────────────────

    if (!year || !Number.isInteger(year)) {
        throw new Error("Valid year is required");
    }

    // ─────────────────────────────────────────────
    // Validate month
    // ─────────────────────────────────────────────

    if (
        !month ||
        !Number.isInteger(month) ||
        month < 1 ||
        month > 12
    ) {
        throw new Error("Month must be between 1 and 12");
    }

    // ─────────────────────────────────────────────
    // Month Name
    // ─────────────────────────────────────────────

   

    // ─────────────────────────────────────────────
    // Check existing audit
    // ─────────────────────────────────────────────

    const existingAudit = await Audit.findOne({
        year,
        month,
    });

    if (existingAudit) {
        throw new Error(
            `Audit already exists for ${monthName} ${year}`
        );
    }

    // ─────────────────────────────────────────────
    // Validate counts
    // ─────────────────────────────────────────────

    if (
        totalBookings < 0 ||
        completedBookings < 0 ||
        cancelledBookings < 0
    ) {
        throw new Error("Booking counts cannot be negative");
    }

    // ─────────────────────────────────────────────
    // Validate amounts
    // ─────────────────────────────────────────────

    if (totalAdminAmount < 0 || stripeFee < 0) {
        throw new Error("Amounts cannot be negative");
    }

    // ─────────────────────────────────────────────
    // Calculate platform profit
    // ─────────────────────────────────────────────

    //   const platformProfit =
    //     Math.round(
    //       (totalAdminAmount - stripeFee + Number.EPSILON) * 100
    //     ) / 100;

    // ─────────────────────────────────────────────
    // Create Audit
    // ─────────────────────────────────────────────

    const audit = await Audit.create({
        year,
        month,
        monthName,

        totalBookings,
        completedBookings,
        cancelledBookings,

        totalAdminAmount,
        stripeFee,
        platformProfit,

        isPayoutDone: true,
    });

    return audit;
};