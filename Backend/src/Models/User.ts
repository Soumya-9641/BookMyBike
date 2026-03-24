import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  systemRole: "user" | "admin";

  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  personalProfile: {
    firstName?: string;
    middlename?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    isVerified: boolean;
    city?: string;
    stripeIdentityId?: string;
  };

  businessProfile?: {
    businessName?: string;
    orgNumber?: string;
    location?: string;
    phone?: string;
    isVerified: boolean;
    stripeIdentityId?: string;
    isActive: boolean;

  };

  isBlocked: boolean;
  memberSince: Date;
  stripeCustomerId?: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  stripeCustomerId: { type: String },
  password: {
    type: String,
    required: true
  },

  systemRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  emailVerified: {
    type: Boolean,
    default: false
  }, 
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  personalProfile: {
    firstName: String,
    middlename: String,
    lastName: String,

    address: String,
    phone: {
      type: String
    },
    isVerified: { type: Boolean, default: false },
    stripeIdentityId: String,
    city: String
  },

  businessProfile: {
    businessName: String,
    orgNumber: String,
    location: String,
    phone: String,
    isVerified: { type: Boolean, default: false },
    stripeIdentityId: String,
    isActive: { type: Boolean, default: false }


  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  memberSince: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IUser>("User", UserSchema);
