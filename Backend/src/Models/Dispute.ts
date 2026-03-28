import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDispute extends Document {
  bikeId: Types.ObjectId;
  sellerId: Types.ObjectId;
  renterId: Types.ObjectId;
  bookingId: Types.ObjectId;
  paymentId: Types.ObjectId;

  disputeAmount: number;
  date: Date;
  time: string;

  reason: string;
  status: "open" | "resolved" | "rejected";
  resolvedAt?: Date;

  createdAt: Date;
}

const DisputeSchema: Schema<IDispute> = new Schema({
  bikeId: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  renterId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },

  disputeAmount: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },

  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "resolved", "rejected"],
    default: "open",
  },
  resolvedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDispute>("Dispute", DisputeSchema);