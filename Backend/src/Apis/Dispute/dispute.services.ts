


import mongoose from "mongoose";
import  Booking  from "../../Models/Booking";
import  Dispute  from "../../Models/Dispute";
import Payment from "../../Models/Payment";
import User from "../../Models/User";
import { sendEmail } from "../../Utils/sendEmail";
export const createDisputeService = async (
  userId: string,
  body: {
    bookingId: string;
    disputeAmount: number;
    reason: string;
    date: Date;
    time: string;
    type: "APPLICABLE" | "NOT_APPLICABLE";      // ← new
    images: string[];  // ← new
  }
) => {
  const { bookingId, disputeAmount, reason, date, time, type, images } = body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new Error("Invalid bookingId");
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  if (booking.ownerId.toString() !== userId.toString()) {
    throw new Error("Only the bike owner can raise a dispute");
  }

  const payment =await Payment.findOne({ bookingId });
  if (!payment) throw new Error("Associated payment not found");    

  const existingDispute = await Dispute.findOne({ bookingId });
   if (existingDispute) {
    const error: any = new Error("Dispute already raised for this booking");
    error.statusCode = 409;              // ← attach status code to error
    error.dispute = existingDispute;     // ← attach existing dispute
    throw error;
  }
   const status = type === "NOT_APPLICABLE" ? "rejected" : "open";
  const dispute = await Dispute.create({
    bikeId:        booking.bikeId,
    sellerId:      booking.ownerId,
    renterId:      booking.renterId,
    bookingId:     booking._id,
    paymentId:     booking.paymentId,
    disputeAmount,
    reason,
    date,
    time,
      type,            // ← new
    images: images ?? [],  // ← new
    status,
  });

    const renter         = await User.findById(booking.renterId);
  const firstName      = renter?.personalProfile?.firstName ?? "there";
  const bookingShortId = booking._id;
   if (renter?.email && status === "open") {
    await sendEmail(
      renter.email,
      "Dispute Opened for Your Booking",
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Dispute Opened</title>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet">
      </head>
      <body style="background:#fff; margin:0; padding:0; font-family:Source Sans Pro,sans-serif;">
        <table style="width:80%; max-width:800px; border:none; background:#fff; margin:30px auto">
          <thead>
            <tr>
              <th>
                <img alt="Logo"
                  src="cid:rentmybikelogo"
                  width="140"
                  style="display:block; margin:0 auto;">
              </th>
            </tr>
          </thead>
          <tbody style="width:100%">
            <tr style="width:100%">
              <td>
                <div style="background:#F6F6F6; padding:30px; box-shadow:0px 1px 5px rgba(0,0,0,0.15); border-top:8px solid #17a34a; text-align:center; border-radius:5px">

                  <h3 style="font-size:30px; font-weight:400; margin:5px 0 10px">
                    Hi ${firstName},
                  </h3>
                  <p style="font-size:20px; font-weight:400; margin:5px 0 10px;">
                    A dispute has been opened for your booking
                  </p>
                  <h2 style="font-size:36px; font-weight:400; margin:5px 0 20px; text-transform:capitalize">
                    Dispute Opened
                  </h2>

                  <table style="width:100%; max-width:500px; margin:20px auto; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">
                    <tr style="background:#ffffff;">
                      <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                        Booking ID
                      </td>
                      <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                        #${bookingShortId}
                      </td>
                    </tr>
                    <tr style="background:#f9f9f9;">
                      <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                        Dispute Amount
                      </td>
                      <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#e53935; text-align:right; border-bottom:1px solid #eeeeee;">
                        ${Number(disputeAmount).toFixed(2)} SEK
                      </td>
                    </tr>
                    <tr style="background:#ffffff;">
                      <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left; border-bottom:1px solid #eeeeee;">
                        Reason
                      </td>
                      <td style="padding:12px 20px; font-size:15px; font-weight:600; color:#1a1a1a; text-align:right; border-bottom:1px solid #eeeeee;">
                        ${reason}
                      </td>
                    </tr>
                    <tr style="background:#f9f9f9;">
                      <td style="padding:12px 20px; font-size:15px; color:#666; text-align:left;">
                        Status
                      </td>
                      <td style="padding:12px 20px; font-size:15px; font-weight:700; color:#f59e0b; text-align:right;">
                        Under Review
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:16px; font-weight:400; color:#444; margin:20px 0 6px;">
                    We're reviewing it and may contact you.
                  </p>
                  <p style="font-size:15px; color:#999999; margin:0 0 10px;">
                    Please provide all supporting evidence to
                    <a href="mailto:support@rentmy.bike" style="color:#17a34a; text-decoration:none; font-weight:600;">
                      support@rentmy.bike
                    </a>
                  </p>

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>`
    );
  }
  return dispute;
};


export const updateDisputeService = async (
  disputeId: string,
  body: {
    status?: "open" | "resolved" | "rejected";
    reason?: string;
    disputeAmount?: number;
  }
) => {
  if (!mongoose.Types.ObjectId.isValid(disputeId)) {
    throw new Error("Invalid disputeId");
  }

  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new Error("Dispute not found");

  // Set resolvedAt if admin is resolving or rejecting
  if (body.status === "resolved" || body.status === "rejected") {
    body = { ...body, resolvedAt: new Date() } as any;
  }

  const updated = await Dispute.findByIdAndUpdate(
    disputeId,
    { $set: body },
    { new: true }
  );

  return updated;
};


export const getDisputeDetailService = async (disputeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(disputeId)) {
    throw new Error("Invalid disputeId");
  }

  const dispute = await Dispute.findById(disputeId).lean();
  if (!dispute) throw new Error("Dispute not found");

  // Fetch booking and payment in parallel
  const [booking, payment,renter, owner] = await Promise.all([
    Booking.findById(dispute.bookingId)
      .select("startDate endDate totalDays pricePerDay totalAmount status isPaid currency")
      .lean(),
    Payment.findById(dispute.paymentId)
      .select("amount platformFee ownerPayout depositAmount status method stripePaymentIntentId currency createdAt")
      .lean(),
      User.findById(dispute.renterId)
      .select(
        "email personalProfile.firstName personalProfile.lastName personalProfile.phone"
      )
      .lean(),

    User.findById(dispute.sellerId)
      .select(
        "email personalProfile.firstName personalProfile.lastName personalProfile.phone"
      )
      .lean(),
  ]);

  return {
    dispute: {
      _id:           dispute._id,
      status:        dispute.status,
      reason:        dispute.reason,
      disputeAmount: dispute.disputeAmount,
      date:          dispute.date,
      time:          dispute.time,
      resolvedAt:    dispute.resolvedAt,
      createdAt:     dispute.createdAt,
      images:        dispute.images,
       type:          dispute.type,
    },
    booking: booking ?? null,
    payment: payment ?? null,
     ownerDetails: owner
      ? {
          ownerId: owner._id,
          email: owner.email,
          firstName:
            owner.personalProfile?.firstName ?? null,
          lastName:
            owner.personalProfile?.lastName ?? null,
          phone:
            owner.personalProfile?.phone ?? null,
        }
      : null,

    // ── Renter Details ──
    renterDetails: renter
      ? {
          renterId: renter._id,
          email: renter.email,
          firstName:
            renter.personalProfile?.firstName ?? null,
          lastName:
            renter.personalProfile?.lastName ?? null,
          phone:
            renter.personalProfile?.phone ?? null,
        }
      : null,
    refs: {
      bikeId:    dispute.bikeId,
      sellerId:  dispute.sellerId,
      renterId:  dispute.renterId,
      bookingId: dispute.bookingId,
      paymentId: dispute.paymentId,
    },
  };
};

export const getAllDisputesService = async () => {
  const disputes = await Dispute.find().sort({ createdAt: -1 }).lean();
  return disputes;
};