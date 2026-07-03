import { userModel } from "../models/userModel.js";

/* ================= ADD TO CART ================= */
export const addTocart = async (req, res) => {
  try {
    const { itemId } = req.body; // ✅ FIXED

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "ItemId is required",
      });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = user.cartData || {};
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.status(200).json({
      success: true,
      message: "Added To Cart",
      cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= DELETE FROM CART ================= */
export const deleteFromcart = async (req, res) => {
  try {
    const { itemId } = req.body; // ✅ FIXED

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "ItemId is required",
      });
    }

    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartData = user.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId] > 1) {
        cartData[itemId] -= 1;
      } else {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.status(200).json({
      success: true,
      message: "Removed From Cart",
      cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET CART ================= */
export const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    res.status(200).json({
      success: true,
      cartData: user.cartData ||{},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
