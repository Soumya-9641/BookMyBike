import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  bikeId: Types.ObjectId;        // Reference to Listing
  userId: Types.ObjectId;        // Who booked
  startDate: Date;
  endDate: Date;
  status: "confirmed" | "cancelled";
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

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
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

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true
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

// 🚀 Composite index for fast availability checks
BookingSchema.index({
  bikeId: 1,
  startDate: 1,
  endDate: 1,
  status: 1
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
