import mongoose, { Schema, Document } from "mongoose";

export interface IAudit extends Document {
  year: number;
  month: number;
  monthName: string;

  completedBookings: number;
  cancelledBookings: number;
  totalBookings: number;

  totalAdminAmount: number;
  stripeFee: number;
  platformProfit: number;

  isPayoutDone: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    year: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    monthName: {
      type: String,
      required: true,
    },

    completedBookings: {
      type: Number,
      default: 0,
    },

    cancelledBookings: {
      type: Number,
      default: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },

    totalAdminAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stripeFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    platformProfit: {
      type: Number,
      default: 0,
    },

    isPayoutDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Only one audit record for a particular year + month
AuditSchema.index(
  { year: 1, month: 1 },
  { unique: true }
);

export default mongoose.model<IAudit>("Audit", AuditSchema);