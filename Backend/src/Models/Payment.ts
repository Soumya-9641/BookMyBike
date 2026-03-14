import mongoose, { Schema, Document, Types } from "mongoose";

// ─── Payment Status Flow ───────────────────────────────────────────────────────
// pending → processing → succeeded / failed / cancelled
// succeeded → refund_requested → refunded / refund_failed

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refund_requested"
  | "refunded"
  | "refund_failed";

export type PaymentMethod = "card" | "bank_transfer" | "wallet";

export type PaymentType = "booking" | "security_deposit" | "penalty" | "extra_charge";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IPayment extends Document {
  // Relations
  bookingId: Types.ObjectId;        // ref: Booking
  payerId: Types.ObjectId;          // ref: User (renter)
  payeeId: Types.ObjectId;          // ref: User (bike owner)

  // Payment Info
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentStatus;

  // Amount
  amount: number;                   // total charged to renter (rental + deposit)
  currency: string;                 // ISO 4217 e.g. "USD", "SEK"
  depositAmount?: number;           // refundable deposit portion (returned to renter after ride)
  platformFee?: number;             // 18% of rentalAmount — kept by platform (VAT incl.)
  vatAmount?: number;               // VAT portion inside platformFee = fee - (fee / 1.25)
  platformNet?: number;             // platform revenue excl. VAT = platformFee / 1.25
  ownerPayout?: number;             // rentalAmount - platformFee → transferred to owner

  // Stripe
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeRefundId?: string;

  // Refund
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;

  // Metadata
  description?: string;
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const PaymentSchema = new Schema<IPayment>(
  {
    // ── Relations ──
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    payerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    payeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Payment Info ──
    type: {
      type: String,
      enum: ["booking", "security_deposit", "penalty", "extra_charge"],
      required: true,
    },
    method: {
      type: String,
      enum: ["card", "bank_transfer", "wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
        "refund_requested",
        "refunded",
        "refund_failed",
      ],
      default: "pending",
    },

    // ── Amount ──
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "SEK",
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    vatAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    platformNet: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownerPayout: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ── Stripe ──
    stripePaymentIntentId: {
      type: String,
      sparse: true,
      unique: true,
    },
    stripeChargeId: {
      type: String,
      sparse: true,
    },
    stripeRefundId: {
      type: String,
      sparse: true,
    },

    // ── Refund ──
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },

    // ── Metadata ──
    description: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto-managed
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

PaymentSchema.index({ bookingId: 1, type: 1 });
PaymentSchema.index({ payerId: 1, status: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });

// ─── Export ───────────────────────────────────────────────────────────────────

export default mongoose.model<IPayment>("Payment", PaymentSchema);