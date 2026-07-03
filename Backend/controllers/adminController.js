import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Admin credentials (in production, use database)
const ADMIN_CREDENTIALS = {
  email: "admin@kindbite.com",
  password: "admin123", // Hash this in production
};

// ✅ ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Trim whitespace from inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Check credentials
    if (trimmedEmail !== ADMIN_CREDENTIALS.email.toLowerCase() || trimmedPassword !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: "admin",
        email: trimmedEmail,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        email: trimmedEmail,
        name: "Admin User",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during login",
    });
  }
};

// ✅ VERIFY ADMIN TOKEN
export const verifyAdminToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      admin: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ✅ ADMIN LOGOUT (optional - frontend handles this)
export const adminLogout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};
