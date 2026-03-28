


import mongoose from "mongoose";
import  Booking  from "../../Models/Booking";
import  Dispute  from "../../Models/Dispute";
import Payment from "../../Models/Payment";
export const createDisputeService = async (
  userId: string,
  body: {
    bookingId: string;
    disputeAmount: number;
    reason: string;
    date: Date;
    time: string;
  }
) => {
  const { bookingId, disputeAmount, reason, date, time } = body;

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
  if (existingDispute) throw new Error("Dispute already raised for this booking");

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
    status: "open",
  });

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
  const [booking, payment] = await Promise.all([
    Booking.findById(dispute.bookingId)
      .select("startDate endDate totalDays pricePerDay totalAmount status isPaid currency")
      .lean(),
    Payment.findById(dispute.paymentId)
      .select("amount platformFee ownerPayout depositAmount status method stripePaymentIntentId currency createdAt")
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
    },
    booking: booking ?? null,
    payment: payment ?? null,
    refs: {
      bikeId:    dispute.bikeId,
      sellerId:  dispute.sellerId,
      renterId:  dispute.renterId,
      bookingId: dispute.bookingId,
      paymentId: dispute.paymentId,
    },
  };
};