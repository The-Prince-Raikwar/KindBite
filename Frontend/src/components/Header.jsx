/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, LogOut, User, ChevronDown, 
  UtensilsCrossed, Star, Clock, MapPin, Sparkles, ArrowRight
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Header = ({ setshowLogIn }) => {
  const { token, settoken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full font-sans selection:bg-amber-500 selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#050505]">
        
        {/* Cinematic Background with Zoom Effect */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://wallpaperaccess.com/full/9109186.jpg"
            className="w-full h-full object-cover opacity-60"
            alt="Hero bg"
          />
          {/* Multi-layered Gradients for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent"></div>
        </motion.div>

        {/* Dynamic Light Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/5 blur-[180px] rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Top Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center justify-center bg-amber-500 p-1 rounded-full shadow-lg">
                <Sparkles className="text-white" size={12} fill="currentColor" />
              </div>
              <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.3em]">Premium Dining Experience</p>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-white text-7xl md:text-[6rem] font-black leading-[0.9] tracking-tighter">
                Savor the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-600 drop-shadow-2xl">
                  Art of Food.
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed border-l-2 border-amber-500/30 pl-6">
                Redefining home delivery. Experience Michelin-star quality meals 
                crafted by master chefs, delivered with clinical precision.
              </p>
            </div>

            {/* Buttons & Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {!token ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setshowLogIn(true)}
                  className="group flex items-center gap-3 px-12 py-6 bg-amber-500 hover:bg-amber-400 text-white rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/explore")}
                  className="group flex items-center gap-3 px-12 py-6 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-2xl font-black text-lg transition-all"
                >
                  Explore Menu <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5, zIndex: 10 }}
                      className="w-12 h-12 rounded-full border-[3px] border-[#050505] bg-slate-800 overflow-hidden shadow-xl"
                    >
                      <img src={`https://i.pravatar.cc/150?u=kind${i}`} alt="user" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#050505] bg-amber-500 flex items-center justify-center text-[10px] text-white font-black">12k+</div>
                </div>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase ml-1">Joined our table</p>
              </div>
            </div>

            {/* Features Row */}
            <div className="flex gap-10 pt-8 border-t border-white/5">
              {[
                { icon: <Clock className="text-amber-500" />, label: "30 Min", sub: "Delivery" },
                { icon: <MapPin className="text-amber-500" />, label: "Real-time", sub: "Tracking" },
                { icon: <Star className="text-amber-500" />, label: "Chef", sub: "Curated" }
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-amber-500/50 transition-colors">
                    {feat.icon}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm">{feat.label}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">{feat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center relative perspective-1000"
          >
            {/* The "Orbit" Glow */}
            <div className="absolute w-[120%] h-[120%] bg-amber-500/10 blur-[150px] rounded-full" />
            
            <div className="relative z-10">
              {/* Main Image with Mask */}
              <div className="relative group perspective-1000 w-full max-w-[450px] aspect-[4/5] z-10">
  <motion.div
    className="relative w-full h-full"
    initial={{ rotateY: 10, x: 20 }}
    whileHover={{ rotateY: 0, rotateX: 5, scale: 1.02, x: 0 }}
    transition={{ type: "spring", stiffness: 120, damping: 20 }}
  >
    {/* 1. THE IMAGE CONTAINER (Fixed Dimensions) */}
    <div className="relative w-full h-full overflow-hidden rounded-[4rem] border border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] group-hover:shadow-amber-500/20 transition-all duration-700">
      <img
        src="/src/assets/kindBite1.jpg"
        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
        alt="Main gourmet dish"
      />
      
      {/* 2. THE DYNAMIC SHINE (Linear Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* 3. VIGNETTE OVERLAY (Adds depth to the image edges) */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none" />
    </div>

    {/* 4. RE-POSITIONED FLOATING BADGE */}
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute -top-6 -right-8 bg-amber-500 text-black px-6 py-3 rounded-2xl shadow-2xl rotate-12 z-20 hidden md:block border-4 border-[#050505]"
    >
       <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-widest leading-none">Chef's Choice</p>
          <p className="text-xs font-bold opacity-80">Highly Recommended</p>
       </div>
    </motion.div>
  </motion.div>

  {/* 5. AMBIENT GLOW (Behind the frame) */}
  <div className="absolute -inset-4 bg-amber-500/5 blur-3xl rounded-[5rem] -z-10 group-hover:bg-amber-500/10 transition-colors" />
</div>
              
              {/* Floating Review Card */}
              <motion.div 
                animate={{ 
                  y: [0, 20, 0],
                  x: [0, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-16 bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] flex items-center gap-5 border border-white z-20"
              >
                <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg shadow-amber-500/40">
                  <ShoppingBag size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Incoming Feast</p>
                  <p className="text-slate-950 text-xl font-black tracking-tight">Spicy Ramen Bowl</p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-500 text-amber-500" />)}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Header;