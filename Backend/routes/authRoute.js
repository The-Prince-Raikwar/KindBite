import express from "express";
import {
  resetPassword,
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";
export const authRouter = express.Router();

authRouter.post("/sendOtp", sendOtp);
authRouter.post("/verify", verifyOtp);
authRouter.post("/reset", resetPassword);
