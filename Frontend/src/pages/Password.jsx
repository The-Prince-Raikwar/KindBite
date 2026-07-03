/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, ChevronLeft, ArrowRight, CheckCircle2,
  ShieldCheck, Loader2, KeyRound, Lock, Eye, EyeOff,
  RefreshCcw, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ForgotPassword = ({ setshowLogIn }) => {
  const navigate = useNavigate();
  const { url } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${url}/api/auth/sendOtp`, { email }, { withCredentials: true });
      if (res.data.success) {
        setStep(2);
        toast.success("Verification code sent!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${url}/api/auth/verify`, { email, otp }, { withCredentials: true });
      if (res.data.success) {
        setStep(3);
        toast.success("Identity verified!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.warning("Password too short!");
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${url}/api/auth/reset`, { email, newPassword }, { withCredentials: true });
      if (res.data.success) {
        setStep(4);
        toast.success("Security updated!");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Reset failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: { x: 20, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -20, opacity: 0, scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <ToastContainer position="top-center" />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* Back navigation */}
        <button
          onClick={() => { navigate("/"); setshowLogIn(true); }}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 font-semibold"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative">
          
          {/* Progress Indicator */}
          <div className="flex gap-2 mb-10 justify-center">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? "w-10 bg-indigo-500" : "w-3 bg-slate-200"}`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-left">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Forgot <span className="text-indigo-600">Password</span></h2>
                <p className="text-slate-500 mb-8 font-medium">Enter your registered email to receive a secure link.</p>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                      type="email" required placeholder="name@company.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-semibold outline-none text-slate-800"
                    />
                  </div>
                  <button disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Request OTP <ArrowRight size={18} /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-left">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                  <KeyRound size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Verify <span className="text-amber-500">Identity</span></h2>
                <p className="text-slate-500 mb-8 font-medium">We've sent a 6-digit code to <span className="text-slate-900">{email}</span></p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <input
                    type="text" maxLength={6} required placeholder="0 0 0 0 0 0"
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-3xl tracking-[0.4em] py-5 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-amber-500/20 outline-none font-black text-slate-800 transition-all"
                  />
                  <button disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-amber-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Verify Security Code"}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                    <RefreshCcw size={14} /> Resend Email
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-left">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Lock size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">New <span className="text-emerald-500">Password</span></h2>
                <p className="text-slate-500 mb-8 font-medium">Ensure your account is secure with a strong password.</p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      type={showPass ? "text" : "password"} required placeholder="Min. 8 characters"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-semibold transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                  <button disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-inner relative">
                  <CheckCircle2 size={48} />
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Success!</h2>
                <p className="text-slate-500 mb-10 font-medium leading-relaxed">Your password has been successfully updated. You can now use your new credentials.</p>
                <button 
                  onClick={() => { navigate("/"); setshowLogIn(true); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                >
                  Proceed to Login <Sparkles size={18} className="group-hover:scale-125 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;