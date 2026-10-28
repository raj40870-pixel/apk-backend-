import mongoose from 'mongoose';

const otpRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  tempData: {
    // We store the hashed password and name temporarily so we can create the user upon OTP success
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    deviceFingerprint: { type: String }
  }
});

// TTL index to automatically remove expired OTP documents after their expiration time
otpRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpRequest = mongoose.model('OtpRequest', otpRequestSchema);
