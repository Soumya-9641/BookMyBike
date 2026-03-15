import mongoose, { Schema, Document, Types } from "mongoose";
 
// ─── Booking Status Flow ──────────────────────────────────────────────────────
// pending → confirmed → active → completed
//         → cancelled (by renter or owner)
//         → rejected  (by owner)
 
export type BookingStatus =
  | "upcoming"
  | "inprogress"
  | "completed"
  | "cancelled"
  | "rejected";
 
// ─── Interface ────────────────────────────────────────────────────────────────
 
export interface IBooking extends Document {
  // Relations
  renterId: Types.ObjectId;         // ref: User (person renting the bike)
  ownerId: Types.ObjectId;          // ref: User (bike owner)
  bikeId: Types.ObjectId;           // ref: Bike
  paymentId?: Types.ObjectId;       // ref: Payment (populated after payment)
 
  // Booking Details
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  totalDays: number;
 
  // Pricing snapshot (saved at booking time, not live from bike)
  pricePerDay: number;
  totalAmount: number;
  currency: string;
  securityDeposit?: number;
 
  // Ride Info (filled when ride completes)
  actualStartTime?: Date;
  actualEndTime?: Date;
  penaltyAmount?: number;           // e.g. late return fee
  penaltyReason?: string;
 
  // Cancellation
  cancelledBy?: "renter" | "owner" | "admin";
  cancellationReason?: string;
  cancelledAt?: Date;
 
  // Rejection
  rejectedReason?: string;
 
  // Metadata
  notes?: string;                   // renter's note at booking time
  createdAt: Date;
  updatedAt: Date;
}
 
// ─── Schema ───────────────────────────────────────────────────────────────────
 
const BookingSchema = new Schema<IBooking>(
  {
    // ── Relations ──
    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
 
    // ── Booking Details ──
    status: {
      type: String,
      enum: ["upcoming", "inprogress", "completed", "cancelled", "rejected"],
      default: "upcoming",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
 
    // ── Pricing Snapshot ──
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      uppercase: true,
      default: "SEK",
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
 
    // ── Ride Info ──
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    penaltyAmount: { type: Number, default: 0, min: 0 },
    penaltyReason: { type: String },
 
    // ── Cancellation ──
    cancelledBy: {
      type: String,
      enum: ["renter", "owner", "admin"],
    },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
 
    // ── Rejection ──
    rejectedReason: { type: String },
 
    // ── Metadata ──
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);


