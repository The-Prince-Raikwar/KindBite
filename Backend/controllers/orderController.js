import { orderModel } from "../models/orderModel.js";
import { userModel } from "../models/userModel.js";
import Stripe from "stripe";
import { emitNewOrder, emitOrderUpdate, emitOrderDeleted, emitDashboardUpdate, emitLiveNotification } from "../Utils/socketSetup.js";

export const placeOrder = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const frontend_url = "http://localhost:5173";

    const { items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId: req.userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal === 0 ? 0 : 27;
    const serviceFee = subtotal === 0 ? 0 : 15;
    const gstRate = 0.05;
    const totalTax = subtotal * gstRate;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.dish_name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity || 1,
    }));

    if (items.length > 0) {
      if (deliveryFee > 0) {
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: { name: "Delivery Charges" },
            unit_amount: deliveryFee * 100,
          },
          quantity: 1,
        });
      }
      if (serviceFee > 0) {
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: { name: "Service Fee" },
            unit_amount: serviceFee * 100,
          },
          quantity: 1,
        });
      }
      if (totalTax > 0) {
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: { name: "GST (5%)" },
            unit_amount: Math.round(totalTax * 100),
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed To Place Order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true" || success === true) {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId, 
        { payment: true },
        { new: true }
      );
      
      const fullOrder = await orderModel.findById(orderId).populate("userId", "name email");
      
      emitNewOrder({
        ...fullOrder.toObject(),
        userName: fullOrder.userId?.name || "Customer"
      });
      
      emitLiveNotification({
        type: "success",
        title: "New Order!",
        message: `Order #${orderId.slice(-6)} received - ₹${updatedOrder.amount}`,
        timestamp: new Date(),
      });

      res.json({ success: true, message: "Payment Verified Successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    res.json({ success: false, message: "Failed to Verify Payment" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId });
    res.json({
      success: true,
      message: "User orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to retrieve user orders" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Food Processing") {
      return res.json({
        success: false,
        message: "Cannot delete order once it's out for delivery",
      });
    }

    await orderModel.findByIdAndDelete(orderId);
    
    emitOrderDeleted(orderId);
    emitDashboardUpdate({ type: "order-deleted", orderId });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting order" });
  }
};

export const listOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export const UpdateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    const statusMessages = {
      "Food Processing": { message: "Order is being prepared", type: "info" },
      "Out for delivery": { message: "Your order is on the way!", type: "warning" },
      "Delivered": { message: "Order delivered successfully", type: "success" },
    };

    const statusInfo = statusMessages[status] || { message: "Status updated", type: "info" };

    emitOrderUpdate({
      ...updatedOrder.toObject(),
      userName: updatedOrder.userId?.name || "Customer"
    });
    
    emitDashboardUpdate({ 
      type: "status-update", 
      orderId, 
      status,
      order: updatedOrder.toObject()
    });

    emitLiveNotification({
      type: statusInfo.type,
      title: `Order ${status}`,
      message: `Order #${orderId.slice(-6)}: ${statusInfo.message}`,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Status Updated",
      data: updatedOrder,
    });
  } catch (error) {
    res.json({ success: false, message: "Error updating status" });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const allOrders = await orderModel.find({});

    const allUsers = await userModel.find({}, "name email phone");
    const userMap = {};
    allUsers.forEach((user) => {
      userMap[user._id.toString()] = user.name || "Unknown User";
    });

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.amount, 0);

    const pendingOrders = allOrders.filter((o) => 
      o.status === "Food Processing" || o.status === "Out for delivery"
    ).length;
    const completedOrders = allOrders.filter((o) => o.status === "Delivered").length;

    const orderTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        return orderDate === dateStr;
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
      orderTrend.push({
        date: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        orders: dayOrders.length,
        revenue: dayRevenue,
      });
    }

    const statusBreakdown = [];
    const statusCounts = allOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(statusCounts).forEach(([status, count]) => {
      statusBreakdown.push({
        name: status,
        value: count,
      });
    });

    const itemCounts = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const itemName = item.dish_name || "Unknown";
        itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
      });
    });

    const topItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({
        name,
        quantity,
      }));

    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((order) => ({
        _id: order._id,
        userName: userMap[order.userId] || "Unknown User",
        items: order.items,
        amount: order.amount,
        status: order.status,
        payment: order.payment,
        createdAt: order.createdAt,
      }));

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        orderTrend,
        statusBreakdown,
        topItems,
        recentOrders,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};
