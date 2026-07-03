import express from "express";
import {authMiddleware} from "../middleware/auth.js";
import { deleteOrder, listOrder, placeOrder, UpdateStatus, userOrders, verifyPayment, getDashboardData } from "../controllers/orderController.js";

export const orderRouter=express.Router();
orderRouter.post("/place",authMiddleware,placeOrder)
orderRouter.post("/verify",verifyPayment)
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.post("/delete",authMiddleware,deleteOrder)
orderRouter.get("/list",listOrder)
orderRouter.post("/status",UpdateStatus)
orderRouter.get("/dashboard",authMiddleware,getDashboardData)

