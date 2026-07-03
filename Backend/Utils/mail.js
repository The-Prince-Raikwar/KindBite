import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, // App Password (NOT normal password)
  },
});

// ✅ Send OTP Mail
export const sendOtpMail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: "OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color: blue;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error; // important so controller catches error
  }
};