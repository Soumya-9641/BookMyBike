import mongoose, { Schema, Document } from "mongoose";

export interface IWaitlist extends Document {
  email: string;
  createdAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);
