import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  bikeId: Types.ObjectId;        // Listing reference
  renterId: Types.ObjectId;      // Who booked
  ownerId: Types.ObjectId;       // Bike owner

  startDate: Date;
  endDate: Date;

  rentalAmount: number;
  depositAmount: number;
  platformFee: number;
  totalAmount: number;

  stripePaymentIntentId: string;
  stripeRefundId?: string;
  ownerPaid?: boolean;
  ownerPayoutId?: string;
depositRefunded?: boolean;
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "disputed";

  createdAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true
    },

    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    startDate: {
      type: Date,
      required: true,
      index: true
    },

    endDate: {
      type: Date,
      required: true,
      index: true
    },

    rentalAmount: {
      type: Number,
      required: true
    },

    depositAmount: {
      type: Number,
      required: true
    },

    platformFee: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      index: true
    },

    stripeRefundId: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "disputed"
      ],
      default: "pending",
      index: true
    },
    depositRefunded: {
      type: Boolean,
      default: false
    },
    ownerPaid: {
      type: Boolean,
      default: false
    },
    ownerPayoutId: {
      type: String
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);


BookingSchema.index({
  bikeId: 1,
  startDate: 1,
  endDate: 1,
  status: 1
});

export default mongoose.model<IBooking>("Booking", BookingSchema);


