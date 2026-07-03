/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Fixed: Check if already logged in only once on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token && token !== "null" && token !== "undefined") {
      navigate("/");
    }
  }, []); // Empty dependency array - only runs on mount

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 1) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Ensure credentials are correct
      const loginData = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await axios.post(
        `${url}/api/admin/login`,
        loginData,
        { timeout: 5000 }
      );

      if (response.data.success) {
        // Save token to localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminEmail", response.data.admin.email);

        // Notify App.jsx of auth change
        window.dispatchEvent(new Event("authChange"));

        toast.success("✅ Login successful! Welcome back!");

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("❌ Invalid email or password");
      } else if (error.response?.status === 400) {
        toast.error("❌ Email and password are required");
      } else if (error.code === "ECONNABORTED") {
        toast.error("⏱️ Request timeout. Is the server running?");
      } else if (error.code === "ECONNREFUSED") {
        toast.error("🔌 Cannot connect to server at " + url);
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Kind<span className="text-orange-400">Bite</span>
          </h1>
          <p className="text-gray-300 text-sm">Admin Panel</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-white mb-2 text-center"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-center text-sm mb-8"
          >
            Sign in to your admin account
          </motion.p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="admin@kindbite.com"
                  className={`w-full bg-white/5 border ${
                    errors.email ? "border-red-500" : "border-white/20"
                  } text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                  <AlertCircle size={16} />
                  {errors.email}
                </div>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${
                    errors.password ? "border-red-500" : "border-white/20"
                  } text-white placeholder-gray-500 rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                  <AlertCircle size={16} />
                  {errors.password}
                </div>
              )}
            </motion.div>

            {/* Demo Credentials Info */}
            <motion.div
              variants={itemVariants}
              className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-xs text-orange-200"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Demo Credentials:</p>
                  <p>Email: admin@kindbite.com</p>
                  <p>Password: admin123</p>
                </div>
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-400 text-xs mt-6"
          >
            This is a secure admin panel. Please use your admin credentials.
          </motion.p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          variants={itemVariants}
          className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-gray-300 text-xs"
        >
          <p>🔒 Your credentials are encrypted and secure</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
