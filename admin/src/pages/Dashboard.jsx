/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  TrendingUp, ShoppingCart, DollarSign, Clock, CheckCircle2, 
  Zap, Users, Bell, RefreshCw, Activity, Package, 
  ArrowUpRight, ArrowDownRight, Eye,
  TrendingDown, Star, Flame, Target, ChefHat, Truck,
  ShoppingBag, CreditCard, X, Check, AlertTriangle, Info,
  Radio, Circle
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import socketService from "../services/socketService";

const Dashboard = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    orderTrend: [],
    recentOrders: [],
    statusBreakdown: [],
    topItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [liveActivities, setLiveActivities] = useState([]);
  const notificationRef = useRef(null);

  const COLORS = ["#FF6B35", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      setIsLoggedIn(!!(token && token !== "null" && token !== "undefined"));
    };
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${url}/api/order/dashboard`, {
        headers: { token: token },
      });

      if (response.data.success) {
        const prevData = dashboardData;
        const newData = response.data.data;
        
        const orderDiff = newData.totalOrders - (prevData.totalOrders || 0);
        if (orderDiff > 0 && prevData.totalOrders > 0) {
          setNewOrdersCount((prev) => prev + orderDiff);
        }
        
        setDashboardData(newData);
        setLastUpdate(new Date());
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, [url, dashboardData.totalOrders]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    socketService.connect();

    const unsubConnect = socketService.subscribe("connection", (data) => {
      setIsConnected(data.connected);
    });

    const unsubNewOrder = socketService.subscribe("new-order", (order) => {
      setNewOrdersCount((prev) => prev + 1);
      setLastUpdate(new Date());
      
      const activity = {
        id: Date.now(),
        type: "new_order",
        message: `New order #${order._id?.slice(-6)} - ₹${order.amount}`,
        time: new Date(),
        icon: <ShoppingBag size={16} />,
        color: "emerald"
      };
      setLiveActivities((prev) => [activity, ...prev.slice(0, 9)]);
      
      toast.success(`🎉 New order: #${order._id?.slice(-6)} - ₹${order.amount}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      addNotification({ 
        type: "success", 
        title: "New Order", 
        message: `#${order._id?.slice(-6)} - ₹${order.amount}`,
        icon: "📦"
      });
      
      fetchDashboardData();
    });

    const unsubOrderUpdated = socketService.subscribe("order-updated", (order) => {
      setLastUpdate(new Date());
      
      const statusColor = order.status === "Delivered" ? "emerald" : order.status === "Out for delivery" ? "blue" : "amber";
      const activity = {
        id: Date.now(),
        type: "status_update",
        message: `Order #${order._id?.slice(-6)} → ${order.status}`,
        time: new Date(),
        icon: order.status === "Delivered" ? <CheckCircle2 size={16} /> : 
              order.status === "Out for delivery" ? <Truck size={16} /> : <ChefHat size={16} />,
        color: statusColor
      };
      setLiveActivities((prev) => [activity, ...prev.slice(0, 9)]);
      
      toast.info(`📝 Order #${order._id?.slice(-6)} → ${order.status}`, {
        position: "top-right",
        autoClose: 3000,
      });
      
      fetchDashboardData();
    });

    const unsubOrderDeleted = socketService.subscribe("order-deleted", (orderId) => {
      setLastUpdate(new Date());
      toast.warn(`🗑️ Order #${orderId?.slice(-6)} was removed`);
      fetchDashboardData();
    });

    const unsubDashboard = socketService.subscribe("dashboard-update", (data) => {
      setLastUpdate(new Date());
      fetchDashboardData();
    });

    const unsubNotification = socketService.subscribe("notification", (notification) => {
      addNotification(notification);
    });

    return () => {
      unsubConnect();
      unsubNewOrder();
      unsubOrderUpdated();
      unsubOrderDeleted();
      unsubDashboard();
      unsubNotification();
    };
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => [{ 
      ...notification, 
      id: Date.now(), 
      timestamp: new Date() 
    }, ...prev.slice(0, 24)]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

  const getNotificationIcon = (type) => {
    const icons = { 
      success: <Check size={16} />, 
      warning: <AlertTriangle size={16} />, 
      error: <X size={16} />, 
      info: <Info size={16} /> 
    };
    return icons[type] || icons.info;
  };

  const getActivityColor = (color) => {
    const colors = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      amber: "bg-amber-100 text-amber-600",
      red: "bg-red-100 text-red-600",
      violet: "bg-violet-100 text-violet-600"
    };
    return colors[color] || colors.blue;
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse mb-4" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-white rounded-2xl animate-pulse" />
            <div className="h-80 bg-white rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please login to view dashboard</p>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Orders", 
      value: dashboardData.totalOrders, 
      icon: <ShoppingCart size={22} />, 
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      trend: "+12%",
      up: true
    },
    { 
      label: "Total Revenue", 
      value: `₹${(dashboardData.totalRevenue / 1000).toFixed(1)}K`, 
      icon: <DollarSign size={22} />, 
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      trend: "+8%",
      up: true
    },
    { 
      label: "Pending Orders", 
      value: dashboardData.pendingOrders, 
      icon: <Clock size={22} />, 
      color: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
      trend: "-3%",
      up: false
    },
    { 
      label: "Completed", 
      value: dashboardData.completedOrders, 
      icon: <CheckCircle2 size={22} />, 
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      trend: "+15%",
      up: true
    },
  ];

  const quickStats = [
    { label: "Avg Order Value", value: `₹${dashboardData.totalOrders > 0 ? Math.round(dashboardData.totalRevenue / dashboardData.totalOrders) : 0}`, icon: <Target size={18} />, color: "text-violet-600" },
    { label: "Success Rate", value: `${dashboardData.totalOrders > 0 ? Math.round((dashboardData.completedOrders / dashboardData.totalOrders) * 100) : 0}%`, icon: <Star size={18} />, color: "text-yellow-600" },
    { label: "Active Orders", value: dashboardData.pendingOrders, icon: <Flame size={18} />, color: "text-red-600" },
    { label: "Top Item", value: dashboardData.topItems?.[0]?.name?.slice(0, 12) || "N/A", icon: <ChefHat size={18} />, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50  mt-22">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  <Radio size={12} className="animate-pulse" />
                  <span>Live</span>
                </div>
                {newOrdersCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full"
                  >
                    <Zap size={12} />
                    <span>{newOrdersCount} new</span>
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-slate-500 text-sm">Welcome back! Here's what's happening with your store.</p>
                {lastUpdate && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Circle size={6} className="fill-emerald-500 text-emerald-500" />
                    Updated {getTimeAgo(lastUpdate)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                isConnected ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <span className={`relative flex h-2 w-2`}>
                  {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
                </span>
                {isConnected ? "Connected" : "Offline"}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Bell size={20} className="text-slate-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">Notifications</h3>
                          <span className="text-xs text-slate-400">({notifications.length})</span>
                        </div>
                        {notifications.length > 0 && (
                          <button onClick={clearAllNotifications} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Clear All</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                notif.type === "success" ? "bg-emerald-100 text-emerald-600" : 
                                notif.type === "warning" ? "bg-amber-100 text-amber-600" : 
                                notif.type === "error" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                              }`}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 text-sm">{notif.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{getTimeAgo(notif.timestamp)}</p>
                              </div>
                              <button onClick={() => removeNotification(notif.id)} className="text-slate-400 hover:text-slate-600 p-1">
                                <X size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  setLoading(true);
                  fetchDashboardData();
                  setNewOrdersCount(0);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/25 active:scale-95"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full" />
              <div className="flex items-start justify-between mb-4 relative">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-emerald-600" : "text-red-600"}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white rounded-lg shadow-sm ${stat.color}`}>{stat.icon}</div>
                    <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                Order & Revenue Trends
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-blue-500" /> Orders
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" /> Revenue
                </span>
              </div>
            </div>
            {dashboardData.orderTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dashboardData.orderTrend}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} fill="url(#colorOrders)" />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* Live Activity Feed & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Live Activity
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Real-time
              </span>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {liveActivities.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Activity size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for activity...</p>
                </div>
              ) : (
                liveActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                  >
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.color)}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{activity.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{getTimeAgo(activity.time)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package size={18} className="text-violet-500" />
              Order Status
            </h3>
            {dashboardData.statusBreakdown.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="60%" height={200}>
                  <PieChart>
                    <Pie
                      data={dashboardData.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dashboardData.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {dashboardData.statusBreakdown.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>

          {/* Top Selling Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              Top Selling Items
            </h3>
            {dashboardData.topItems?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-200 text-slate-600" : idx === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} orders</p>
                    </div>
                    <div className="flex items-center gap-1 text-orange-600">
                      <TrendingUp size={14} />
                      <span className="text-sm font-bold">{Math.round((item.quantity / dashboardData.topItems[0]?.quantity) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400">No items yet</div>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag size={18} className="text-blue-500" />
              Recent Orders
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {dashboardData.recentOrders?.length || 0} orders
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Auto-updating
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData.recentOrders?.length > 0 ? (
                  dashboardData.recentOrders.slice(0, 8).map((order, idx) => (
                    <motion.tr 
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-orange-600">#{order._id?.slice(-6)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                            {(order.userName || "U")[0].toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{order.userName || "Guest"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{order.items?.length || 0} items</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-600">₹{order.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                          order.status === "Food Processing" ? "bg-amber-100 text-amber-700" :
                          order.status === "Out for delivery" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {order.status === "Delivered" && <CheckCircle2 size={12} />}
                          {order.status === "Food Processing" && <ChefHat size={12} />}
                          {order.status === "Out for delivery" && <Truck size={12} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.payment ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}>
                          <CreditCard size={12} />
                          {order.payment ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="mt-8 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
              </span>
              {isConnected ? "Real-time connected" : "Reconnecting..."}
            </span>
            <span className="text-slate-300">|</span>
            <span>Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Never"}</span>
            <span className="text-slate-300">|</span>
            <span>Auto-refresh: 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
