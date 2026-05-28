import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListing extends Document {
  ownerId: Types.ObjectId;

  title: string;
  description?: string;
  photos: string[];

  brand: string;
  modelbike: string;
  size: string;
  category: string;
  pickupPoint?: string;
  accessories: string[];

  rates: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };

  depositAmount: number;

  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
    address: string;
    city: string;
  };


  isPublished: boolean;
  isBlocked: boolean;
  createdAt: Date;
}


const ListingSchema: Schema<IListing> = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: { type: String, required: true },
  description: String,
  photos: { type: [String], default: [] },

  brand: { type: String, required: true },
  modelbike: { type: String, required: true },
  size: { type: String, required: true },
  category: { type: String, required: true },
  pickupPoint: {
    type: String
  },
  accessories: { type: [String], default: [] },

  rates: {
    hourly: Number,
    daily: Number,
    weekly: Number,
    monthly: Number
  },

  depositAmount: { type: Number, required: true },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    },
    address: { type: String },
    city: { type: String, index: true }
  },

  isPublished: { type: Boolean, default: false },
  isBlocked: {
    type: Boolean,
    default: false,
  },

  createdAt: { type: Date, default: Date.now }
});
ListingSchema.index({ location: "2dsphere" });


export default mongoose.model<IListing>("Listing", ListingSchema);
