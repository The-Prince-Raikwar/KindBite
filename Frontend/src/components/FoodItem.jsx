/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, ShoppingBag } from "lucide-react";

const FoodItem = ({ id, dish_name, rating, price, description, category, image }) => {
  const { cartItem, AddToCart, removeFromCart } = useContext(AuthContext);
  const itemCount = cartItem?.[id] || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white border border-zinc-100 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt={dish_name}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Add Button / Counter */}
        <div className="absolute bottom-4 right-4 z-10">
          <AnimatePresence mode="wait">
            {itemCount === 0 ? (
              <motion.button
                key="add-btn"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => AddToCart(String(id))}
                className="bg-black text-white p-3 rounded-2xl shadow-xl hover:bg-orange-500 transition-colors"
              >
                <Plus size={20} strokeWidth={3} />
              </motion.button>
            ) : (
              <motion.div
                key="counter"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-3 bg-white border border-zinc-200 p-1.5 rounded-2xl shadow-2xl"
              >
                <button 
                  onClick={() => removeFromCart(String(id))}
                  className="p-1.5 hover:bg-zinc-100 rounded-xl transition-colors text-black"
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span className="font-black text-black text-sm w-4 text-center">{itemCount}</span>
                <button 
                  onClick={() => AddToCart(String(id))}
                  className="p-1.5 hover:bg-zinc-100 rounded-xl transition-colors text-black"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white/20">
            <p className="text-black font-black text-sm tracking-tight">₹{price}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-orange-500 mb-1">{category}</p>
            <h3 className="font-bold text-zinc-900 text-xl leading-tight group-hover:text-orange-600 transition-colors">
              {dish_name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-lg">
            <Star size={12} className="fill-orange-400 text-orange-400" />
            <span className="text-xs font-black text-zinc-700">{rating}</span>
          </div>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-4 font-medium italic">
          "{description}"
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
            <div className="flex items-center gap-2 text-zinc-400">
                <ShoppingBag size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Available Now</span>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">
                Details
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItem;