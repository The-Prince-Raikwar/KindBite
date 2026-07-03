/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { LuSearch, LuBell, LuMessageCircle, LuChevronDown, LuUser, LuSettings, LuLogOut, LuMenu, LuWifi, LuWifiOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import socketService from "../services/socketService";

const Header = ({ toggleSidebar, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("adminEmail") || "admin@kindbite.com";
    setAdminEmail(email);
  }, []);

  useEffect(() => {
    const unsubConnect = socketService.subscribe("connection", (data) => {
      setIsConnected(data.connected);
    });
    setIsConnected(socketService.getConnectionStatus());
    return () => unsubConnect();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogoutClick = () => {
    socketService.disconnect();
    toast.success("👋 Logged out successfully!");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    window.dispatchEvent(new Event("authChange"));
    onLogout();
    navigate("/login");
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 h-20">
      <div className="flex items-center justify-between px-4 lg:px-8 h-full">
        
        {/* LEFT: TOGGLE & SEARCH */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
          >
            <LuMenu size={22} />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full max-w-md focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
            <LuSearch className="text-slate-400" size={18} />
            <input type="text" placeholder="Search orders..." className="bg-transparent border-none outline-none text-sm w-full focus:ring-0" />
          </div>
        </div>

        {/* RIGHT: UTILITIES */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            {isConnected ? (
              <>
                <LuWifi size={14} className="text-green-600" />
                <span className="text-[10px] font-bold text-green-600 hidden sm:inline">Live</span>
              </>
            ) : (
              <>
                <LuWifiOff size={14} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 hidden sm:inline">Offline</span>
              </>
            )}
          </div>

          <button className="md:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl">
            <LuSearch size={20} />
          </button>

          <button className="p-2.5 text-slate-500 hover:bg-orange-50 hover:text-orange-600 rounded-xl relative group transition-all">
            <LuBell size={22} className="group-hover:scale-110" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <img src="https://ui-avatars.com/api/?name=Admin&background=FF6B35&color=fff" className="w-9 h-9 rounded-xl object-cover shadow-sm" alt="Admin" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Super Admin</p>
              </div>
              <LuChevronDown className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} size={14} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-600 font-semibold">Logged in as</p>
                    <p className="text-sm font-bold text-slate-800 mt-1">{adminEmail}</p>
                  </div>

                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all mt-2">
                    <LuUser size={18} /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all">
                    <LuSettings size={18} /> Settings
                  </button>
                  <div className="h-px bg-slate-100 my-1.5 mx-2" />
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LuLogOut size={18} /> Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
