/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Mail, Lock, User, ArrowRight, 
  ChevronRight, Sparkles, ShieldCheck, 
  Pizza, Flame, Star 
} from "lucide-react";

const Login = ({ setshowLogIn }) => {
  const { url, settoken } = useContext(AuthContext);
  const [currentState, setcurrentState] = useState("Sign Up");
  const navigate = useNavigate();

  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handlerChange = (e) => {
    const { name, value } = e.target;
    setdata((prev) => ({ ...prev, [name]: value }));
  };

  const onLoginIn = async (e) => {
    e.preventDefault();
    let newUrl = url + (currentState === "Login" ? "/api/user/login" : "/api/user/register");

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setshowLogIn(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("System busy. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/90 backdrop-blur-xl p-4 overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -45, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600/20 blur-[120px] rounded-full" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-6xl h-[min(850px,90vh)] bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row shadow-black"
      >
        {/* --- CLOSE BUTTON --- */}
        <button
          onClick={() => setshowLogIn(false)}
          className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group active:scale-90"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* --- LEFT SIDE: THE EXPERIENCE --- */}
        <div className="hidden lg:flex flex-1 relative bg-black items-center justify-center p-16 overflow-hidden border-r border-white/10">
          <div className="absolute inset-0 z-0">
            <video
              src="/src/assets/Brown Simple Cute Catering Logo.mp4"
              autoPlay muted loop
              className="w-full h-full object-cover opacity-30 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          </div>

          <div className="relative z-10 space-y-10">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-orange-600 px-4 py-1.5 rounded-full"
            >
              <Sparkles size={14} className="text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Join the Elite</span>
            </motion.div>

            <h2 className="text-6xl font-black text-white leading-none tracking-tighter uppercase italic">
              Taste <br /> <span className="text-orange-500">Beyond</span> <br /> Borders.
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl space-y-2">
                <Flame className="text-orange-500" size={24} />
                <p className="text-white font-bold text-sm italic">Wood-Fired</p>
                <p className="text-white/40 text-[10px] leading-tight">Authentic techniques for modern cravings.</p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl space-y-2">
                <Star className="text-yellow-500" size={24} />
                <p className="text-white font-bold text-sm italic">5-Star Prep</p>
                <p className="text-white/40 text-[10px] leading-tight">Curated by top chefs around the globe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="flex-1 bg-neutral-950 p-8 lg:p-20 flex flex-col justify-center relative">
          <div className="max-w-md w-full mx-auto space-y-10">
            <header className="space-y-3">
              <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px]">
                <ShieldCheck size={14} /> Secure Access
              </div>
              <motion.h1 
                key={currentState}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-black text-white tracking-tighter italic uppercase"
              >
                {currentState === "Sign Up" ? "Get Started" : "Welcome Back"}
              </motion.h1>
            </header>

            {/* Form Fields */}
            <form onSubmit={onLoginIn} className="space-y-5">
              <AnimatePresence mode="wait">
                {currentState === "Sign Up" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative"
                  >
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Display Name"
                      value={data.name}
                      onChange={handlerChange}
                      required
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={data.email}
                  onChange={handlerChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={handlerChange}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" required className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all" />
                  </div>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest group-hover:text-white transition-colors">Accept Terms</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setshowLogIn(false); navigate("/forgot"); }}
                  className="text-[10px] text-orange-500 font-black uppercase tracking-widest hover:text-orange-400 transition-colors"
                >
                  Forgot?
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-4"
              >
                {currentState === "Sign Up" ? "Initialize Account" : "Access Vault"}
                <ChevronRight size={18} />
              </motion.button>
            </form>

            <footer className="pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-white/40 font-medium">
                {currentState === "Login" ? "Seeking entry?" : "Already verified?"}{" "}
                <button
                  onClick={() => setcurrentState(currentState === "Login" ? "Sign Up" : "Login")}
                  className="text-white font-black hover:text-orange-500 hover:underline underline-offset-8 transition-all"
                >
                  {currentState === "Login" ? "Create Profile" : "Login Instead"}
                </button>
              </p>
            </footer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;