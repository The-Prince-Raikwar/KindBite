/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Home, Compass, Info, Zap, 
  Menu, X, ShoppingBag, LogOut, ChevronDown, 
  UtensilsCrossed 
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ setshowLogIn }) => {
  const { token, settoken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false); // Track hover state explicitly
  const cartCount = 0; 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    settoken("");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "HOME", path: "/", icon: <Home size={18} /> },
    { name: "EXPLORE", path: "/explore", icon: <Compass size={18} /> },
    { name: "SERVICES", path: "/service", icon: <Zap size={18} /> },
    { name: "ABOUT", path: "/about", icon: <Info size={18} /> },
  ];

  const imageTextStyle = {
    backgroundImage: `url('https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg')`,
    backgroundSize: 'cover',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 px-4 md:px-12 py-3 ${
          isScrolled 
          ? "bg-white/90 backdrop-blur-2xl shadow-xl border-b border-slate-100" 
          : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* 1. LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/30">
              <UtensilsCrossed className="text-white" size={20} />
            </div>
            <h1 className={`text-2xl font-black tracking-tighter transition-colors ${isScrolled ? "text-slate-900" : "text-green-600"}`}>
              Kind<span className="text-amber-500">Bite</span>
            </h1>
          </div>

          {/* 2. DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="relative group py-1">
                <span 
                  style={isScrolled ? {} : imageTextStyle}
                  className={`font-black text-sm tracking-[0.15em] transition-all duration-300 ${
                    isScrolled 
                    ? (location.pathname === link.path ? "text-amber-500" : "text-slate-600 hover:text-slate-900")
                    : (location.pathname === link.path ? "brightness-150 scale-105" : "brightness-100 hover:brightness-125")
                  }`}
                >
                  {link.name}
                </span>
                {location.pathname === link.path && (
                  <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-[2px] bg-amber-500" />
                )}
              </Link>
            ))}
          </div>

          {/* 3. ACTIONS */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/cart" className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`p-2.5 rounded-full border transition-all ${
                  isScrolled ? "bg-slate-100 border-slate-200 text-slate-900" : "bg-neutral-700/10 border-white/20 text-red-400"
                }`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {!token ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setshowLogIn(true)}
                className={`px-6 py-2.5 rounded-2xl font-black text-xs tracking-widest transition-all ${
                  isScrolled ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-900 shadow-xl shadow-black/10"
                }`}
              >
                SIGN IN
              </motion.button>
            ) : (
              /* --- REFIXED PROFILE HOVER --- */
              <div 
                className="relative"
                onMouseEnter={() => setIsProfileHovered(true)}
                onMouseLeave={() => setIsProfileHovered(false)}
              > 
                {/* Trigger Button */}
                <div className={`flex items-center gap-2 p-1 pr-3 rounded-full border cursor-pointer transition-all ${
                    isScrolled ? "bg-slate-100 border-slate-200" : "bg-white/10 border-white/20 backdrop-blur-md"
                  }`}>
                  <img
                    src="https://cdn-icons-gif.flaticon.com/18986/18986439.gif"
                    className="w-9 h-9 rounded-full border-2 border-amber-500 object-cover bg-white"
                    alt="User"
                  />
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileHovered ? 'rotate-180' : ''} ${isScrolled ? "text-slate-900" : "text-white"}`} />
                </div>

                {/* Dropdown with AnimatePresence */}
                <AnimatePresence>
                  {isProfileHovered && (
                    <>
                      {/* Invisible Hover Bridge (prevents mouse-out while moving to menu) */}
                      <div className="absolute h-4 w-full top-full bg-transparent" />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-3 border border-slate-100 overflow-hidden"
                      >
                        <div className="px-5 py-2 mb-1 border-b border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</p>
                        </div>

                        <button 
                          onClick={() => { navigate("/orders"); setIsProfileHovered(false); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-all font-bold text-sm"
                        >
                          <ShoppingBag size={18} /> My Orders
                        </button>

                        <button 
                          onClick={Logout} 
                          className="w-full flex items-center gap-3 px-5 py-3 text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button className="lg:hidden p-2 rounded-xl bg-amber-500 text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU REMAINS SAME */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190] lg:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-[80%] max-w-sm z-[200] bg-white shadow-2xl lg:hidden flex flex-col p-8">
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black italic text-slate-900 tracking-tighter">KIND BITE</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={24} /></button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === link.path ? "bg-amber-50 text-amber-600" : "text-slate-600 hover:bg-slate-50"}`}>
                    {link.icon} {link.name}
                  </Link>
                ))}
              </div>
              {token && (
                <div className="mt-auto border-t pt-6">
                  <button onClick={Logout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-500 bg-red-50"><LogOut size={20} /> LOGOUT</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;