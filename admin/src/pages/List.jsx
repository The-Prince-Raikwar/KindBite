/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Trash2,
  Search,
  RefreshCw,
  Layers,
  AlertCircle,
  CameraOff,
  Tag,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FoodList = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId) => {
    const previousList = [...list];
    setList(list.filter((item) => item._id !== foodId));
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (!response.data.success) {
        setList(previousList);
      } else {
        toast.success("Dish deleted");
      }
    } catch (error) {
      setList(previousList);
      toast.error("Delete failed");
    }
  };

  const updateFood = async () => {
    try {
      const response = await axios.put(`${url}/api/food/update`, editItem);
      if (response.data.success) {
        setList((prev) =>
          prev.map((item) => (item._id === editItem._id ? { ...item, ...editItem } : item))
        );
        toast.success("Dish updated");
        setIsEditOpen(false);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [list, searchTerm, activeTab]);

  const categories = ["All", ...new Set(list.map((item) => item.category))];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Menu Gallery
            </h1>
            <p className="text-slate-400 font-semibold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} /> {list.length} Total Dishes
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 bg-white shadow-lg shadow-slate-200/50 rounded-2xl p-1.5 w-full lg:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={fetchList}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredList.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* CARD IMAGE */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  {item.image ? (
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <CameraOff size={32} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="px-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="text-indigo-600 font-black whitespace-nowrap">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-5 h-10 leading-relaxed">
                    {item.description}
                  </p>

                  {/* CARD ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditItem(item); setIsEditOpen(true); }}
                      className="flex-1 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-colors"
                    >
                      <Tag size={14} /> Edit
                    </button>
                    <button
                      onClick={() => removeFood(item._id)}
                      className="aspect-square bg-rose-50 text-rose-600 hover:bg-rose-100 p-2.5 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {filteredList.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <AlertCircle className="mx-auto text-slate-200 mb-4" size={64} />
            <h3 className="text-2xl font-black text-slate-300">No Dishes Found</h3>
            <p className="text-slate-400 text-sm mt-1">Try searching for something else</p>
          </motion.div>
        )}
      </div>

      {/* MODAL - Fully Responsive Overlay */}
      <AnimatePresence>
        {isEditOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-800">Update Dish</h2>
                <p className="text-slate-400 font-medium">Modify item details below</p>
              </div>

              <div className="space-y-4">
                {["name", "category", "price"].map((field) => (
                  <div key={field}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                      {field}
                    </label>
                    <input
                      type={field === 'price' ? 'number' : 'text'}
                      value={editItem?.[field] || ""}
                      onChange={(e) => setEditItem({ ...editItem, [field]: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editItem?.description || ""}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateFood}
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodList;