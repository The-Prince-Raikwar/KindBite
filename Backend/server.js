import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initSocket } from "./Utils/socketSetup.js";
import { FoodRouter } from "./routes/FoodRoute.js";
import { userRouter } from "./routes/userRoute.js";
import { cartRouter } from "./routes/cartRoute.js";
import { orderRouter } from "./routes/orderRoute.js";
import { adminRouter } from "./routes/adminRoute.js";
import { authRouter } from "./routes/authRoute.js";

dotenv.config({ path: path.resolve("./.env") });

const app = express();
const port = process.env.PORT || 4000;
const httpServer = createServer(app);

initSocket(httpServer);

app.use(express.json({ limit: "10mb" }));

const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
  origin: isProduction
    ? process.env.FRONTEND_URL
    : [
        "http://localhost:5173",
        "http://localhost:5174",
      "https://kindbite-frontend-3287.onrender.com"
        
      ],
  credentials: true,
};

app.use(cors(corsOptions));

// ==================== ROUTES ====================
app.use("/api/food", FoodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// ==================== DATABASE CONNECTION ====================
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fooddelivery")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ==================== STATIC FILES ====================
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🚀 Food Delivery API is running!");
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port} with Socket.IO`);
});
