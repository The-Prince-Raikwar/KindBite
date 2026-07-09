import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174",  "https://kindbite-admin.onrender.com/",       "https://kindbite-frontend-3287.onrender.com"
],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join order room for tracking
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`📦 Client joined order room: ${orderId}`);
    });

    // Leave order room
    socket.on("leaveOrderRoom", (orderId) => {
      socket.leave(`order:${orderId}`);
      console.log(`📦 Client left order room: ${orderId}`);
    });

    // Rider location updates
    socket.on("rider:location", (data) => {
      const { orderId, lat, lng } = data;
      if (io && orderId) {
        io.to(`order:${orderId}`).emit("order:location_update", {
          orderId,
          riderLocation: { lat, lng },
          timestamp: new Date()
        });
      }
    });

    // Rider status updates
    socket.on("rider:status", (data) => {
      const { orderId, status, message } = data;
      if (io && orderId) {
        io.to(`order:${orderId}`).emit("order:status_change", {
          orderId,
          status,
          message,
          timestamp: new Date()
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  // Make io available globally
  global.io = io;
  
  return io;
};

export const getIO = () => {
  return io || global.io;
};

// Export helper functions for emitting events
export const emitNewOrder = (orderData) => {
  if (io) io.emit("new:order", orderData);
};

export const emitOrderUpdate = (orderData) => {
  if (io) io.emit("order:update", orderData);
};

export const emitOrderDeleted = (orderId) => {
  if (io) io.emit("order:deleted", orderId);
};

export const emitDashboardUpdate = (data) => {
  if (io) io.emit("dashboard:update", data);
};

export const emitLiveNotification = (data) => {
  if (io) io.emit("notification", data);
};
