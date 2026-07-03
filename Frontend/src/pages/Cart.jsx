/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Gift,
  Truck,
  ShieldCheck,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

const Cart = () => {
  const { cartItem, foodList, removeFromCart, getTotalCart, AddToCart } =
    useContext(AuthContext);
  const navigate = useNavigate();

  // --- Constants ---
  const currencyIcon = "₹"; // Updated to Rupee
  const deliveryFee = 27;
  const subtotal = getTotalCart();
  const grandTotal = subtotal === 0 ? 0 : subtotal + deliveryFee;
  const isCartEmpty = subtotal === 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans relative ">
      {/* --- Checkout Progress Header --- */}
      <div className=" py-4 px-6  top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center absolute w-full top-30">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-200">
              F
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800">
              KIND<span className="text-teal-600">BITE</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <StepNode number="1" label="Cart" active />
            <div className="w-12 h-0.5 bg-slate-200" />
            <StepNode number="2" label="Delivery" />
            <div className="w-12 h-0.5 bg-slate-200" />
            <StepNode number="3" label="Payment" />
          </div>
          <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" /> Secure
            Checkout
          </div>
        </div>
      </div>

      {/* --- Hero Visual Section --- */}
      <div className="relative h-[280px] bg-[#111827] flex items-center overflow-hidden mt-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 blur-[2px]"
            alt="background"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
            Finalize Your <br />{" "}
            <span className="text-teal-400">Selection.</span>
          </h1>
          <div className="mt-4 flex gap-4 text-slate-300 font-bold text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              {" "}
              <Clock size={14} /> 25-35 Mins{" "}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              {" "}
              <Star size={14} className="text-yellow-400 fill-yellow-400" /> Top
              Rated{" "}
            </span>
          </div>
        </div>
      </div>

      {/* --- Main Interface --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: CART ITEMS (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-4xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <ShoppingBag className="text-teal-600" /> Basket Items
                </h2>
                <button className="text-slate-400 hover:text-rose-500 text-xs font-black uppercase tracking-widest transition-colors">
                  Clear All
                </button>
              </div>

              {isCartEmpty ? (
                <EmptyCartView navigate={navigate} />
              ) : (
                <div className="space-y-8">
                  {foodList.map(
                    (item) =>
                      cartItem[item.id] > 0 && (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          qty={cartItem[item.id]}
                          currency={currencyIcon}
                          onRemove={() => removeFromCart(item.id)}
                          onAdd={() => AddToCart(item.id)}
                        />
                      ),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SUMMARY (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 p-8 sticky top-24">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                Order Summary <ArrowRight size={20} className="text-teal-500" />
              </h3>

              <div className="space-y-4 mb-8">
                <SummaryLine
                  label="Subtotal"
                  value={subtotal.toFixed(2)}
                  icon={currencyIcon}
                />
                <SummaryLine
                  label="Service Fee"
                  value="15.00" // Updated to a typical Rupee service fee
                  icon={currencyIcon}
                />
                <SummaryLine
                  label="Delivery"
                  value={isCartEmpty ? "0.00" : deliveryFee.toFixed(2)}
                  icon={currencyIcon}
                  highlight={!isCartEmpty}
                />

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                        Total Payable
                      </p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">
                        {currencyIcon}
                        {(grandTotal + 15).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                        <Gift size={14} /> Save {currencyIcon}45.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
             

              <button
                onClick={() => navigate("/order")}
                disabled={isCartEmpty}
                className={`w-full py-6 rounded-2xl font-black cursor-pointer text-sm tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 ${
                  isCartEmpty
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200 hover:shadow-teal-300"
                }`}
              >
                PROCEED TO CHECKOUT <ChevronRight size={18} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-6 opacity-30">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/196/196578.png"
                  className="h-6 grayscale"
                  alt="visa"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1611/1611645.png"
                  className="h-6 grayscale"
                  alt="mastercard"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/174/174861.png"
                  className="h-6 grayscale"
                  alt="paypal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUBCOMPONENTS ---

const StepNode = ({ number, label, active }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"}`}
    >
      {number}
    </div>
    <span
      className={`text-xs font-black uppercase tracking-widest ${active ? "text-slate-800" : "text-slate-300"}`}
    >
      {label}
    </span>
  </div>
);

const CartItemRow = ({ item, qty, currency, onRemove, onAdd }) => (
  <div className="group flex flex-col md:flex-row items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
    <div className="relative">
      <img
        src={item.image}
        alt={item.dish_name}
        className="w-24 h-24 rounded-2xl object-cover shadow-lg"
      />
      <div className="absolute -top-2 -left-2 bg-teal-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
        x{qty}
      </div>
    </div>

    <div className="flex-1 text-center md:text-left">
      <h4 className="text-lg font-black text-slate-800">{item.dish_name}</h4>
      <p className="text-slate-400 text-sm font-medium">
        Chef's Special Choice
      </p>

      <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full border cursor-pointer border-slate-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500"
        >
          <Minus size={14} />
        </button>

        <span className="font-black text-slate-700">{qty}</span>

        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full border cursor-pointer border-slate-200 flex items-center justify-center hover:bg-teal-50 hover:text-teal-500"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>

    <div className="text-right">
      <p className="text-xl font-black text-slate-900">
        {currency}
        {(item.price * qty).toFixed(2)}
      </p>

      <button
        onClick={onRemove}
        className="text-rose-500 font-black text-[10px] cursor-pointer uppercase tracking-widest mt-2 hover:underline"
      >
        Remove
      </button>
    </div>
  </div>
);

const SummaryLine = ({ label, value, icon, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
      {label}
    </span>
    <span
      className={`font-black ${highlight ? "text-orange-500" : "text-slate-700"}`}
    >
      {icon}
      {value}
    </span>
  </div>
);

const EmptyCartView = ({ navigate }) => (
  <div className="text-center py-20">
    <div className="relative inline-block mb-8">
      <ShoppingBag size={80} className="text-slate-100" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
        🥘
      </div>
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-2 italic uppercase">
      Your Bag is Empty
    </h3>
    <p className="text-slate-400 font-medium mb-10 max-w-xs mx-auto">
      The best flavors are just a click away. Don't let your stomach wait!
    </p>
    <button
      onClick={() => navigate("/explore")}
      className="px-10 py-4 bg-teal-600 text-white cursor-pointer rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all active:scale-95"
    >
      Explore Menu
    </button>
  </div>
);

export default Cart;