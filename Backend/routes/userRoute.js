import express from "express";
import { loginUser, reigsterUser } from "../controllers/userController.js";

export const userRouter = express.Router();

userRouter.post("/register", reigsterUser);
userRouter.post("/login", loginUser);
