import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOtp extends Document {
  userId: Types.ObjectId;
  email: string;
  otp: string; // OTP as string
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // ✅ fix here
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '2m' } },
});


export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
