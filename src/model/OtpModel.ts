import mongoose, { Schema, Document } from 'mongoose';

interface IOtp extends Document {
  email: string;
  otp: number;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '2m' } }, // OTP expires in 2 minutes
});

export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
