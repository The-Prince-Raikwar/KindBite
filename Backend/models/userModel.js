import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    cartData: {
      type: Object,
      default: {},
    },
    resetOtp: {
      type: String,
    },
    isOtpVerify: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
    },
  },

  {
    minimize: false, // keeps empty object {}
    timestamps: true, // createdAt, updatedAt
  },
);

export const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);
