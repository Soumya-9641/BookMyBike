import mongoose, { Schema, Document, Types } from "mongoose";

export interface IListing extends Document {
  ownerId: Types.ObjectId;   // Reference to User (_id)

  title: string;
  description?: string;

  photos: string[];

  brand: string;
  modelbike: string;
  size: string;
  category: string;

  accessories: string[];
 
  rates: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };

  depositAmount: number;

  location: {
    address: string;
    lat: number;
    lng: number;
     city: string; 
  };

  isPublished: boolean;
  createdAt: Date;
}

const ListingSchema: Schema<IListing> = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    photos: {
      type: [String],
      default: []
    },

    brand: {
      type: String,
      required: true
    },

    modelbike: {
      type: String,
      required: true
    },

    size: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    accessories: {
      type: [String],
      default: []
    },

    rates: {
      hourly: { type: Number },
      daily: { type: Number },
      weekly: { type: Number },
      monthly: { type: Number }
    },

    depositAmount: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      address: {
        type: String,
        required: true
      },
      lat: {
        type: Number,
        required: true
      },
      city: { type: String, required: true, index: true },
      lng: {
        type: Number,
        required: true
      }
    },

    isPublished: {
      type: Boolean,
      default: false
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

export default mongoose.model<IListing>("Listing", ListingSchema);
