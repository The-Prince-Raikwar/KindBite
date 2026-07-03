import express from "express";
import { adminLogin, verifyAdminToken, adminLogout } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";

export const adminRouter = express.Router();

// Admin authentication routes
adminRouter.post("/login", adminLogin);
adminRouter.get("/verify", verifyAdminToken);
adminRouter.post("/logout", authMiddleware, adminLogout);
