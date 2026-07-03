import { userModel } from "../models/userModel.js";
import { sendOtpMail } from "../Utils/mail.js";
import bcrypt from "bcrypt";

// ✅ SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    // ✅ Correct 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerify = false;

    await user.save();

    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await userModel.findOne({ email });

    if (
      !user ||
      user.resetOtp !== String(otp) ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    user.isOtpVerify = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP Verified",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Not Verified",
    });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user || !user.isOtpVerify) {
      return res.status(403).json({
        success: false,
        message: "OTP Verification required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isOtpVerify = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password Not Reset",
    });
  }
};