// Seed script to create demo users and orders
// Run with: node seed.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env") });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fooddelivery")
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch((err) => console.log("MongoDB Error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "rider", "admin"], default: "user" },
  location: { lat: Number, lng: Number, address: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

async function seed() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create demo user
    const userPassword = await bcrypt.hash("password123", 10);
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      phone: "9876543210",
      password: userPassword,
      role: "user"
    });
    console.log("Created demo user:", demoUser.email);

    // Create demo rider
    const riderPassword = await bcrypt.hash("rider123", 10);
    const demoRider = await User.create({
      name: "Rider Singh",
      email: "rider@example.com",
      phone: "9876543211",
      password: riderPassword,
      role: "rider"
    });
    console.log("Created demo rider:", demoRider.email);

    // Create second rider
    const demoRider2 = await User.create({
      name: "Fast Delivery",
      email: "rider2@example.com",
      phone: "9876543212",
      password: riderPassword,
      role: "rider"
    });
    console.log("Created demo rider 2:", demoRider2.email);

    console.log("\n✅ Seeding completed!");
    console.log("\nDemo Credentials:");
    console.log("─────────────────────────────────────");
    console.log("Customer Login:");
    console.log("  Email: demo@example.com");
    console.log("  Password: password123");
    console.log("");
    console.log("Rider Login:");
    console.log("  Email: rider@example.com");
    console.log("  Password: rider123");
    console.log("─────────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
