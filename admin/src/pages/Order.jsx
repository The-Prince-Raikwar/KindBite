/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, RefreshCw, Search, ShoppingBag, CreditCard,
  ChevronDown, Utensils, Zap, Clock, CheckCircle2,
  Truck, Package, TrendingUp, Users, Phone, Wifi, WifiOff, X
} from "lucide-react";
import socketService from "../services/socketService";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [isConnected, setIsConnected] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error("Network error: Dashboard offline");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    const unsubConnect = socketService.subscribe("connection", (data) => {
      setIsConnected(data.connected);
    });

    const unsubNewOrder = socketService.subscribe("new-order", (order) => {
      setNewOrderAlert(order);
      toast.success(`🎉 New Order #${order._id?.slice(-6)} - ₹${order.amount}`, {
        toastId: order._id,
      });
      setOrders((prev) => [order, ...prev]);
    });

    const unsubOrderUpdated = socketService.subscribe("order-updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o))
      );
    });

    const unsubOrderDeleted = socketService.subscribe("order-deleted", (orderId) => {
      setOrders((prev) => prev.filter((o) => o._id !== orderId && o._id !== orderId));
      toast.warn(`Order #${orderId?.slice(-6)} was removed`);
    });

    return () => {
      unsubConnect();
      unsubNewOrder();
      unsubOrderUpdated();
      unsubOrderDeleted();
    };
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status });
      if (res.data.success) {
        toast.success(`Marked as ${status}`, {
          style: { borderRadius: '15px', fontWeight: 'bold' }
        });
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const name = o.address?.name || o.userName || "";
      const match = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    o._id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const tab = activeTab === "All" || 
                  (activeTab === "Active" && o.status !== "Delivered") || 
                  (activeTab === "Completed" && o.status === "Delivered");
      return match && tab;
    });
  }, [orders, searchTerm, activeTab]);

  const statusMap = {
    "Food Processing": { icon: <Clock size={14} />, color: "text-amber-600", bg: "bg-amber-100", glow: "shadow-amber-200" },
    "Out for delivery": { icon: <Truck size={14} />, color: "text-blue-600", bg: "bg-blue-100", glow: "shadow-blue-200" },
    "Delivered": { icon: <CheckCircle2 size={14} />, color: "text-emerald-600", bg: "bg-emerald-100", glow: "shadow-emerald-200" },
  };

  const stats = useMemo(() => ({
    revenue: orders.reduce((a, b) => a + b.amount, 0),
    active: orders.filter(o => o.status !== "Delivered").length,
    completed: orders.filter(o => o.status === "Delivered").length,
    customers: new Set(orders.map(o => o.address?.email || o.userName)).size,
  }), [orders]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-4 lg:p-10 font-sans transition-all duration-300 mt-12">
      {/* New Order Alert Banner */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="p-3 bg-white/20 rounded-xl">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="font-black text-lg">New Order Received!</p>
              <p className="text-sm opacity-90">#{newOrderAlert._id?.slice(-6)} • ₹{newOrderAlert.amount}</p>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi size={16} className="text-green-600" />
            ) : (
              <WifiOff size={16} className="text-red-500" />
            )}
            <span className={`text-xs font-bold ${isConnected ? "text-green-600" : "text-red-500"}`}>
              {isConnected ? "Real-time connected" : "Reconnecting..."}
            </span>
          </div>
          <button
            onClick={fetchAllOrders}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        
        {/* Dynamic Stats HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Revenue", val: `₹${stats.revenue}`, icon: <TrendingUp size={20}/>, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Active", val: stats.active, icon: <Zap size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Completed", val: stats.completed, icon: <CheckCircle2 size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Customers", val: stats.customers, icon: <Users size={20}/>, color: "text-pink-600", bg: "bg-pink-50" },
          ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} 
              className={`p-5 rounded-[2rem] ${stat.bg} flex flex-col sm:flex-row items-center sm:items-start gap-4 border border-white shadow-sm`}>
              <div className={`p-3 rounded-2xl bg-white shadow-md ${stat.color}`}>{stat.icon}</div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-800">{stat.val}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Order <span className="text-indigo-600">Central</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-400 text-sm font-bold">Live order management</p>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                placeholder="Search orders..."
                className="pl-12 pr-6 py-3.5 rounded-2xl bg-white shadow-xl shadow-slate-200/40 w-full lg:w-72 outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchAllOrders} className="p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 w-fit gap-1 overflow-x-auto no-scrollbar">
          {["All", "Active", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              {tab}
              {tab === "Active" && stats.active > 0 && (
                <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {stats.active}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order Grid */}
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const currentStatus = statusMap[order.status] || statusMap["Food Processing"];
              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/30 border border-slate-50 relative group"
                >
                  {/* Live Indicator */}
                  <div className="absolute top-4 right-4">
                    <span className={`flex h-2 w-2`}>
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${currentStatus.color === "text-amber-600" ? "bg-amber-400" : currentStatus.color === "text-blue-600" ? "bg-blue-400" : "bg-emerald-400"} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${currentStatus.color === "text-amber-600" ? "bg-amber-500" : currentStatus.color === "text-blue-600" ? "bg-blue-500" : "bg-emerald-500"}`}></span>
                    </span>
                  </div>

                  {/* Header Info */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-900 rounded-2xl text-white">
                        <Package size={18} />
                      </div>
                      <div>
                        <h2 className="font-black text-slate-800 leading-tight">
                          {order.address?.name || order.userName || "Customer"}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: #{order._id.slice(-6)}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${currentStatus.bg} ${currentStatus.color} shadow-sm`}>
                      {currentStatus.icon} {order.status}
                    </div>
                  </div>

                  {/* Customer Name Section */}
                  <div className="mb-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] uppercase font-black text-indigo-600 tracking-widest mb-1">Customer</p>
                    <p className="text-sm font-bold text-slate-800">{order.address?.name || order.userName || "Guest"}</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-3xl max-h-48 overflow-y-auto">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-600 p-2 bg-white rounded-xl">
                        <span className="flex items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.dish_name} 
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                          )}
                          <span className="flex flex-col gap-0.5">
                            <span className="text-slate-800 font-semibold">{item.dish_name}</span>
                            <span className="text-slate-400 text-[10px]">₹{item.price}</span>
                          </span>
                        </span>
                        <span className="bg-indigo-100 px-3 py-1 rounded-lg text-indigo-600 shadow-sm whitespace-nowrap">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact & Address */}
                  <div className="space-y-2 mb-8 text-xs font-semibold text-slate-500 px-1">
                    {order.address && (
                      <>
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-slate-300" />
                          <span className="line-clamp-1">{order.address.street}, {order.address.city}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="text-slate-300" />
                          <span>{order.address.phone}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer: Amount & Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-slate-300">Total Bill</span>
                      <span className="text-lg font-black text-slate-900 leading-none">₹{order.amount}</span>
                      <span className={`text-[10px] font-bold ${order.payment ? "text-green-600" : "text-red-500"}`}>
                        {order.payment ? "✓ Paid" : "✗ Unpaid"}
                      </span>
                    </div>

                    <div className="relative flex-1 max-w-[160px]">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      >
                        <option value="Food Processing">Processing</option>
                        <option value="Out for delivery">Shipping</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredOrders.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 italic">"No orders found here..."</h3>
            <p className="text-slate-400 text-sm mt-1">Try switching tabs or adjusting your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Order;
