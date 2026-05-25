import mongoose, { Schema, Document, Types } from "mongoose";

// ─── Booking Status Flow ──────────────────────────────────────────────────────
// pending → confirmed → active → completed
//         → cancelled (by renter or owner)
//         → rejected  (by owner)

export type BookingStatus =
  | "upcoming"
  | "startRequested"       // renter requested ride start
  | "inprogress"           // owner accepted start
  | "completionRequested"  // owner marked complete, waiting renter confirmation
  | "completed"            // renter confirmed → triggers payout
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


  // ── Ride Start Flow ──────────────────────────────
  startRequestedAt?: Date;        // when renter requested start
  startRequestedBy?: Types.ObjectId;
  startAcceptedAt?: Date;         // when owner accepted start
  actualStartTime?: Date;
  // ── Ride Completion Flow ─────────────────────────
  completionRequestedAt?: Date;   // when owner marked complete
  completionRequestedBy?: Types.ObjectId;
  completionConfirmedAt?: Date;   // when renter confirmed completion
  actualEndTime?: Date;
  // Ride Info (filled when ride completes)

  // ── Request Start Flags ──
  renterRequestedStart: boolean;
  ownerAcceptedStart: boolean;

  // ── Completion Flags ──
  ownerRequestedCompletion: boolean;
  renterConfirmedCompletion: boolean;

  isSettlementDone?: boolean;          // whether payout/refund has been processed for this booking

  penaltyAmount?: number;
  penaltyReason?: string;

  // Cancellation
  cancelledBy?: "renter" | "owner" | "admin";
  cancellationReason?: string;
  cancelledAt?: Date;

  // Rejection
  rejectedReason?: string;
  updatedBy?: "admin" | "lister";
  completionConfirmedBy: {
    type: String,
    enum: ["renter", "owner"],
    default: null,
  },

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
      enum: [
        "upcoming",
        "startRequested",
        "inprogress",
        "completionRequested",
        "completed",
        "cancelled",
        "rejected",
      ],
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
    // ── Ride Start Flow ──
    startRequestedAt: { type: Date },
    startRequestedBy: { type: Schema.Types.ObjectId, ref: "User" },
    startAcceptedAt: { type: Date },
    actualStartTime: { type: Date },

    // ── Ride Completion Flow ──
    completionRequestedAt: { type: Date },
    completionRequestedBy: { type: Schema.Types.ObjectId, ref: "User" },
    completionConfirmedAt: { type: Date },
    actualEndTime: { type: Date },

    // ── Request Start Flags ──
    renterRequestedStart: { type: Boolean, default: false },   // renter clicked start
    ownerAcceptedStart: { type: Boolean, default: false },   // owner accepted start

    // ── Completion Flags ──
    ownerRequestedCompletion: { type: Boolean, default: false },  // owner marked complete
    renterConfirmedCompletion: { type: Boolean, default: false },  // renter confirmed

    isSettlementDone: { type: Boolean, default: false },          // whether payout/refund has been processed for this booking
    // ── Penalty ──
    penaltyAmount: { type: Number, default: 0, min: 0 },
    penaltyReason: { type: String },
    // ── Cancellation ──
    cancelledBy: {
      type: String,
      enum: ["renter", "owner", "admin"],
    },
    completionConfirmedBy: {
      type: String,
      enum: ["renter", "owner"],
      default: null,
    },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    updatedBy: {
      type: String,
      enum: ["admin", "lister"],
    },

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


