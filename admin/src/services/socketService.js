import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://kindbite-backend-bvuo.onrender.com";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.socket.on("connect", () => {
      console.log("⚡ Socket connected:", this.socket.id);
      this.isConnected = true;
      this.socket.emit("join-admin");
      this.notifyListeners("connection", { connected: true });
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      this.isConnected = false;
      this.notifyListeners("connection", { connected: false });
    });

    this.socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
      this.isConnected = false;
    });

    this.socket.on("new-order", (order) => {
      console.log("📦 New order received:", order);
      this.notifyListeners("new-order", order);
    });

    this.socket.on("order-updated", (order) => {
      console.log("📝 Order updated:", order);
      this.notifyListeners("order-updated", order);
    });

    this.socket.on("order-deleted", (orderId) => {
      console.log("🗑️ Order deleted:", orderId);
      this.notifyListeners("order-deleted", orderId);
    });

    this.socket.on("dashboard-update", (data) => {
      console.log("📊 Dashboard update:", data);
      this.notifyListeners("dashboard-update", data);
    });

    this.socket.on("notification", (notification) => {
      console.log("🔔 Notification:", notification);
      this.notifyListeners("notification", notification);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
export default socketService;
