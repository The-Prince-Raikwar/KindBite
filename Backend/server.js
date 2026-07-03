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
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  credentials: true,
};

app.use(cors(corsOptions));

// ==================== ROUTES ====================
app.use("/api/food", FoodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRouter);

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fooddelivery")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ==================== SCHEMAS ====================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "rider", "admin"], default: "user" },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: String,
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "assigned", "picked", "out_for_delivery", "delivered", "cancelled"],
    default: "pending"
  },
  deliveryAddress: {
    name: String,
    phone: String,
    address: String,
    lat: Number,
    lng: Number
  },
  otp: String,
  otpExpiry: Date,
  otpAttempts: { type: Number, default: 0 },
  riderLocation: {
    lat: Number,
    lng: Number,
    lastUpdated: Date
  },
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

// ==================== AUTH MIDDLEWARE ====================
const authMiddleware = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "kindbite_secret_key");
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// ==================== AUTH ROUTES ====================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, role: role || "user" });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "kindbite_secret_key", { expiresIn: "7d" });
    
    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.json({ success: false, message: "Registration failed", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "kindbite_secret_key", { expiresIn: "7d" });
    
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (error) {
    res.json({ success: false, message: "Login failed", error: error.message });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: "Error", error: error.message });
  }
});

// ==================== ORDER ROUTES ====================
app.post("/api/orders/create", authMiddleware, async (req, res) => {
  try {
    const { restaurantName, items, totalAmount, deliveryAddress } = req.body;
    
    const order = new Order({
      userId: req.userId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      status: "confirmed"
    });
    
    await order.save();
    
    // Get IO instance and emit event
    const io = httpServer._io || global.io;
    if (io) {
      io.to(`order:${order._id}`).emit("order:status_change", {
        orderId: order._id,
        status: order.status,
        message: "Order confirmed!",
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    res.json({ success: false, message: "Order creation failed", error: error.message });
  }
});

app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    let orders;
    if (req.userRole === "rider") {
      orders = await Order.find({ riderId: req.userId }).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    }
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching orders", error: error.message });
  }
});

app.get("/api/orders/available", authMiddleware, async (req, res) => {
  try {
    // Riders can see orders assigned to them or unassigned orders
    const orders = await Order.find({
      status: { $in: ["confirmed", "preparing", "assigned"] },
      $or: [
        { riderId: null },
        { riderId: req.userId }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: "Error", error: error.message });
  }
});

app.get("/api/orders/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("userId", "name phone").populate("riderId", "name phone");
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: "Error", error: error.message });
  }
});

app.patch("/api/orders/:orderId/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Generate OTP when going out for delivery
    if (status === "out_for_delivery") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      order.otp = otp;
      order.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      order.otpAttempts = 0;
    }
    
    order.status = status;
    order.updatedAt = new Date();
    await order.save();
    
    // Emit socket event
    const io = httpServer._io || global.io;
    if (io) {
      io.to(`order:${order._id}`).emit("order:status_change", {
        orderId: order._id,
        status: order.status,
        message: getStatusMessage(status),
        otp: status === "out_for_delivery" ? order.otp : null,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      message: "Status updated",
      order: {
        id: order._id,
        status: order.status,
        otp: order.otp,
        otpExpiry: order.otpExpiry
      }
    });
  } catch (error) {
    res.json({ success: false, message: "Error updating status", error: error.message });
  }
});

app.post("/api/orders/:orderId/assign-rider", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    order.riderId = req.userId;
    order.status = "assigned";
    order.updatedAt = new Date();
    await order.save();
    
    const io = httpServer._io || global.io;
    if (io) {
      io.to(`order:${order._id}`).emit("order:status_change", {
        orderId: order._id,
        status: order.status,
        message: "Rider assigned!",
        timestamp: new Date()
      });
    }
    
    res.json({ success: true, message: "Rider assigned", order });
  } catch (error) {
    res.json({ success: false, message: "Error", error: error.message });
  }
});

app.post("/api/orders/:orderId/verify-otp", async (req, res) => {
  try {
    const { enteredOtp } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if OTP has expired
    if (new Date() > order.otpExpiry) {
      return res.json({ success: false, message: "OTP has expired", expired: true });
    }
    
    // Check attempts
    if (order.otpAttempts >= 3) {
      return res.json({ success: false, message: "Maximum attempts exceeded" });
    }
    
    // Verify OTP
    if (order.otp !== enteredOtp) {
      order.otpAttempts += 1;
      await order.save();
      const remaining = 3 - order.otpAttempts;
      return res.json({
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining`,
        attemptsRemaining: remaining
      });
    }
    
    // Success - mark as delivered
    order.status = "delivered";
    order.otp = null;
    order.updatedAt = new Date();
    await order.save();
    
    const io = httpServer._io || global.io;
    if (io) {
      io.to(`order:${order._id}`).emit("order:delivered", {
        orderId: order._id,
        message: "Order delivered successfully!",
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      message: "Order delivered successfully!",
      order: { id: order._id, status: order.status }
    });
  } catch (error) {
    res.json({ success: false, message: "Error verifying OTP", error: error.message });
  }
});

// ==================== LOCATION ROUTES ====================
app.post("/api/orders/:orderId/update-location", authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    order.riderLocation = {
      lat,
      lng,
      lastUpdated: new Date()
    };
    await order.save();
    
    // Calculate distance and ETA
    const distance = calculateDistance(lat, lng, order.deliveryAddress.lat, order.deliveryAddress.lng);
    const eta = Math.ceil(distance * 3); // Rough estimate: 3 mins per km
    
    // Emit to socket
    const io = httpServer._io || global.io;
    if (io) {
      io.to(`order:${order._id}`).emit("order:location_update", {
        orderId: order._id,
        riderLocation: { lat, lng },
        distance: distance.toFixed(2),
        eta: eta,
        timestamp: new Date()
      });
    }
    
    res.json({
      success: true,
      distance: distance.toFixed(2),
      eta: eta
    });
  } catch (error) {
    res.json({ success: false, message: "Error updating location", error: error.message });
  }
});

// ==================== UTILITY FUNCTIONS ====================
function getStatusMessage(status) {
  const messages = {
    pending: "Order placed",
    confirmed: "Order confirmed!",
    preparing: "Preparing your order",
    assigned: "Rider assigned!",
    picked: "Order picked up!",
    out_for_delivery: "Out for delivery!",
    delivered: "Delivered!",
    cancelled: "Order cancelled"
  };
  return messages[status] || "Status updated";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ==================== STATIC FILES ====================
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("🚀 Food Delivery API is running!");
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port} with Socket.IO`);
});
