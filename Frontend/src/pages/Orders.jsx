/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Truck, Trash2, RefreshCw, 
  Search, Star, UtensilsCrossed, ArrowRight
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const { url, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setOrders([...res.data.data].reverse());
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id, status) => {
    if (status !== "Food Processing") {
      toast.error("Cannot cancel: Order is already on the way!");
      return;
    }

    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.post(url + "/api/order/delete", { orderId: id }, { headers: { token } });
        if (response.data.success) {
          setOrders(prev => prev.filter(o => o._id !== id));
          toast.success("Order cancelled successfully");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Server error while deleting");
      }
    }
  };

  const handleReorder = (orderItems) => {
    toast.info("Redirecting to cart...");
    navigate("/cart");
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const search = searchTerm.toLowerCase();
      return (
        o._id?.toLowerCase().includes(search) ||
        o.items?.some(i => (i.name || i.dish_name || "").toLowerCase().includes(search))
      );
    });
  }, [orders, searchTerm]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-24 font-sans">
      <ToastContainer />
      <div className="bg-slate-900 text-white pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-4xl font-black tracking-tight">
              My Gourmet <span className="text-emerald-400">Vault</span>
            </motion.h1>
            <p className="text-slate-400 mt-2">Manage your recent cravings and track deliveries.</p>
          </div>
          <div className="flex gap-4">
             <StatBox label="Active" value={orders.filter(o => o.status !== "Delivered").length} />
             <StatBox label="Total Spent" value={`₹${orders.reduce((acc, curr) => acc + curr.amount, 0)}`} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {/* Search Bar only shows if there are orders or if user is currently searching */}
        {(orders.length > 0 || searchTerm) && (
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white flex flex-wrap gap-4 items-center mb-12">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Dish or Order ID..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* --- LOGIC FOR EMPTY LISTS --- */}
        {filteredOrders.length === 0 ? (
          <EmptyState isSearch={!!searchTerm} resetSearch={() => setSearchTerm("")} navigate={navigate} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <OrderCard 
                  key={order._id} 
                  order={order} 
                  onCancel={handleCancelOrder}
                  onReorder={handleReorder}
                  refreshOrder={fetchOrders}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- REFACTORED SUBCOMPONENTS --- */

const EmptyState = ({ isSearch, resetSearch, navigate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[3rem] border border-dashed border-slate-300 shadow-sm"
  >
    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
      <UtensilsCrossed size={48} strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl font-black text-slate-800 mb-2">
      {isSearch ? "No matching cravings found" : "Your vault is empty"}
    </h2>
    <p className="text-slate-500 max-w-xs mb-8">
      {isSearch 
        ? "We couldn't find any orders matching your search term. Try a different keyword." 
        : "Looks like you haven't ordered anything yet. Let's find you something delicious!"}
    </p>
    {isSearch ? (
      <button 
        onClick={resetSearch}
        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
      >
        Clear Search
      </button>
    ) : (
      <button 
        onClick={() => navigate("/explore")}
        className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
      >
        Explore Menu <ArrowRight size={18} />
      </button>
    )}
  </motion.div>
);

const OrderCard = ({ order, onCancel, onReorder, refreshOrder }) => {
  const isDelivered = order.status === "Delivered";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all group"
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
              <h3 className="text-lg font-bold text-slate-800 font-mono">#{order._id.slice(-6).toUpperCase()}</h3>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${isDelivered ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
            {order.status}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl">
              <div className="flex items-center gap-4">
                <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" />
                <div>
                  <p className="text-sm font-black text-slate-800">{item.dish_name}</p>
                  <p className="text-xs text-slate-500">{item.quantity} x ₹{item.price}</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
            <p className="text-3xl font-black text-slate-900 leading-none">₹{order.amount}</p>
          </div>
          <div className="flex gap-2">
            {!isDelivered ? (
              <>
                <button onClick={() => onCancel(order._id, order.status)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all">
                  <Trash2 size={20} />
                </button>
                <button onClick={refreshOrder} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg">
                  Refresh <RefreshCw size={18} />
                </button>
              </>
            ) : (
              <button onClick={() => onReorder(order.items)} className="flex items-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg">
                Reorder <RefreshCw size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl min-w-[120px]">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-white">{value}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full" />
      <p className="text-emerald-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing your feasts...</p>
    </div>
  </div>
);

export default Orders;