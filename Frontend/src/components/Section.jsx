/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  LogOut, 
  ChevronRight, 
  MapPin, 
  Sparkles 
} from "lucide-react";

const Section = ({ setshowLogIn }) => {
  const { token, settoken } = useContext(AuthContext);
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("token");
    settoken("");
    navigate("/");
  };

  return (
    <div className="relative w-full h-[850px] overflow-hidden bg-black">
      {/* Cinematic Background Video */}
      <video
        src="/src/assets/2894881-uhd_3840_2160_24fps.mp4"
        className="absolute inset-0 w-full h-full object-cover rounded-bl-[100px] rounded-br-[100px] opacity-70"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
        >
          <Sparkles className="text-amber-400 w-4 h-4" />
          <span className="text-white text-sm font-bold tracking-widest uppercase">
            World's Largest Food Chain
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-black text-white leading-tight"
        >
          Order Food From Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Nearby Restaurants
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mt-6 text-lg max-w-2xl font-medium"
        >
          Satisfy your cravings with lightning-fast delivery from the best-rated spots in your city.
        </motion.p>

        {/* --- ACTION BUTTONS --- */}
        <div className="mt-12">
          {!token ? (
            /* Shown only when NOT logged in */
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setshowLogIn(true)}
              className="group bg-white text-black px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-2xl"
            >
              Get Started <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          ) : (
            /* Shown only when LOGGED in */
           <div className="flex flex-col sm:flex-row items-center gap-6">
  {/* Added pb-6 and -mb-6 to create a "bridge" so the hover doesn't break in the gap */}
  <div className="relative group pb-6 -mb-6">
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-1 bg-gradient-to-tr from-emerald-500 to-green-300 rounded-full cursor-pointer shadow-lg relative z-10"
    >
      <img
        src="https://cdn-icons-gif.flaticon.com/18986/18986439.gif"
        alt="User"
        className="w-14 h-14 rounded-full border-2 border-white bg-white object-cover"
      />
    </motion.div>

    {/* DROPDOWN MENU */}
    <ul className="absolute right-1/2 translate-x-1/2 top-[80%] w-48 bg-white rounded-3xl shadow-2xl py-3 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
      <li
        onClick={() => navigate("/orders")}
        className="flex items-center px-6 py-3 cursor-pointer text-slate-700 font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
      >
        <ShoppingBag size={18} className="mr-3" />My Orders
      </li>
      <div className="h-[1px] bg-gray-100 mx-4 my-1" />
      <li
        onClick={(e) => {
          e.stopPropagation();
          Logout();
        }}
        className="flex items-center px-6 py-3 cursor-pointer text-red-500 font-bold hover:bg-red-50 transition-colors"
      >
        <LogOut size={18} className="mr-3" /> Logout
      </li>
    </ul>
  </div>

  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
    onClick={() => navigate("/explore")}
    className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 text-lg"
  >
    Explore Menu <MapPin size={20} />
  </motion.button>
</div>
          )}
        </div>

        {/* Bottom Floating Badge */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>
            ))}
          </div>
          <p className="text-white text-sm font-semibold tracking-wide">500+ Local Restaurants Live</p>
        </motion.div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
    </div>
  );
};

export default Section;