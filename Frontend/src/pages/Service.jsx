/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Leaf,
  
  MapPin,
  CreditCard,
  Heart,
  Utensils,
  Zap,
  Star,
  ArrowRight,
  Bot,
  Flame,
  MessageSquare,
  Send,
  X,
  Globe,
  CalendarCheck,
  ShieldCheck,
  Thermometer,
  Lock,
} from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const services = [
 
  
  
  {
    title: "Zero-Waste Initiative",
    description:
      "Every order uses 100% compostable packaging and carbon-neutral transit.",
    icon: <Leaf className="text-emerald-500" />,
    color: "bg-emerald-50",
    tag: "Eco",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800",
  },
  {
    title: "Secure Vault Pay",
    description:
      "One-click checkout with military-grade 256-bit encryption for all cards & UPI.",
    icon: <Lock className="text-blue-500" />,
    color: "bg-blue-50",
    tag: "Safe",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800",
  },
  {
    title: "Kindness Program",
    description:
      "Don't Waste Food.",
    icon: <Heart className="text-rose-500" />,
    color: "bg-rose-50",
    tag: "Mission",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800",
  },
  
  {
    title: "Express Delivery",
    description:
      "Proprietary routing tech ensures your food arrives in < 25 mins.",
    icon: <Heart className="text-neutral-500" />,
    color: "bg-neutral-50",
    tag: "Mission",
    img: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVsaXZlcnl8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Smart Tracking",
    description:
      "Watch your meal's journey with high-precision GPS and live heat-maps.",
    icon: <Heart className="text-teal-500" />,
    color: "bg-teal-50",
    tag: "Mission",
    img: "https://plus.unsplash.com/premium_photo-1681487829842-2aeff98f8b63?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVsaXZlcnklMjB0cmFja2luZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

const Services = () => {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
      {/* --- Floating AI Chatbot --- */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-4 w-80 h-96 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            ></motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Animated Background Decor --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px]" />
      </div>

      {/* --- Hero Section --- */}
      <section className="relative pt-24 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6">
            THE KINDBITE EXPERIENCE
          </span>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
            Delivery built with <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
              Purpose & Precision.
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We’ve evolved beyond just food. Discover a service ecosystem
            designed to be fast for you, fair to riders, and kind to the planet.
          </p>
        </motion.div>
      </section>

      {/* --- Service Bento Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* IMAGE HEADER */}
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={s.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={s.title}
                />
                <div className="absolute top-4 right-4">
                  {s.title === "Freshness Audit" && (
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 border border-emerald-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-black text-emerald-700">
                        LIVE A+
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8">
                <div
                  className={`w-16 h-16 rounded-3xl ${s.color} flex items-center justify-center mb-6 -mt-16 relative z-10 shadow-xl border-4 border-white group-hover:rotate-3 transition-transform`}
                >
                  {s.icon}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                    {s.title}
                  </h3>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 uppercase tracking-widest">
                    {s.tag}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed mb-8 text-sm font-medium">
                  {s.description}
                </p>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600 group-hover:gap-4 transition-all">
                  Access Service <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- How it Works Visual Journey --- */}
      <section className="py-24 px-6 bg-slate-900 rounded-[3rem] mx-4 md:mx-10 my-20 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>

            <p className="text-slate-400">
              Seamlessly simple from cravings to first bite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting Line (Desktop) */}

            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-slate-700 to-transparent" />

            {[
              {
                title: "Select",
                desc: "Browse curated local gems",
                icon: <Utensils />,
              },

              {
                title: "Order",
                desc: "Customized & secure checkout",
                icon: <Zap />,
              },

              {
                title: "Track",
                desc: "Watch the magic happen live",
                icon: <MapPin />,
              },

              {
                title: "Enjoy",
                desc: "Zero-contact hot delivery",
                icon: <Star />,
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-orange-500 mx-auto mb-6 relative z-10 shadow-2xl">
                  {step.icon}

                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full text-white flex items-center justify-center font-black text-sm border-4 border-slate-900">
                    {i + 1}
                  </div>
                </div>

                <h4 className="text-white font-bold text-xl mb-2">
                  {step.title}
                </h4>

                <p className="text-slate-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Premium CTA --- */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-linear-to-br from-orange-500 to-rose-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-orange-200">
          <h2 className="text-4xl font-black mb-6">Hungry yet?</h2>

          <p className="text-orange-100 mb-10 text-lg max-w-md mx-auto">
            Join 2 million+ users who choose kindness and quality every single
            day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-10 py-4 rounded-2xl font-black hover:bg-orange-50 transition-colors shadow-lg shadow-orange-900/20">
              Download the App
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="bg-transparent border-2 cursor-pointer border-white/30 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-colors"
            >
              View Menu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
