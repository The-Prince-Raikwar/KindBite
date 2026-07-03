import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token;

    // ✅ Check token properly
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No Token",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next(); // ✅ move to controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};