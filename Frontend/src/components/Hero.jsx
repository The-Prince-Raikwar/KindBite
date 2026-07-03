/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin, Bot, Clock, Star, Gift, Leaf, Sparkles, Percent,
  ArrowRight, ShieldCheck, Zap, Heart, Utensils
} from "lucide-react";

// ---------------- DATA ----------------
const lifestyleFeatures = [
  { title: "Healthy Meals", desc: "Curated nutritious food options", icon: <Leaf />, color: "text-green-500", bg: "bg-green-50" },
  { title: "Veg Mode", desc: "100% vegetarian discovery", icon: <Sparkles />, color: "text-emerald-500", bg: "bg-emerald-50" },
  { title: "Exclusive Offers", desc: "Daily deals & cashback", icon: <Percent />, color: "text-orange-500", bg: "bg-orange-50" },
  { title: "Gift Cards", desc: "Send delicious surprises", icon: <Gift />, color: "text-rose-500", bg: "bg-rose-50" },
];

const coreFeatures = [
  { title: "Schedule Orders", desc: "Plan meals with zero hassle", icon: <Clock className="text-amber-500" /> },
  { title: "Top Rated", desc: "Only the best verified spots", icon: <Star className="text-yellow-500" /> },
];

const Hero = () => {
  const [orders, setOrders] = useState(124500);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => prev + Math.floor(Math.random() * 4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const FeatureRow = ({ title, desc, icon, delay }) => (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ x: 10 }}
      className="flex items-center gap-5 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 hover:bg-white/80 hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-bold text-gray-900 leading-tight">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] overflow-x-hidden selection:bg-pink-100">
      
      {/* ---------- HERO / SERVICE SECTION ---------- */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 -left-20 w-96 h-96 bg-pink-200/50 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-200/50 rounded-full blur-[120px]" 
            />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-600">Premium Dining Experience</p>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[1.1]">
          What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Serve</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Premium quality meals, handled with care, and delivered at 
          lightning speed to your doorstep.
        </p>

        {/* Video Circle Elements */}
        <div className="relative mt-20 hidden md:block h-20">
            <motion.video
                src="/src/assets/KindBite.mp4" autoPlay muted loop
                className="w-48 h-48 absolute -top-40 left-10 rounded-[3rem] object-cover shadow-2xl border-4 border-white rotate-[-6deg]"
                initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
            />
            <motion.video
                src="/src/assets/KindBitep.mp4" autoPlay muted loop
                className="w-40 h-40 absolute -top-32 right-10 rounded-[3rem] object-cover shadow-2xl border-4 border-white rotate-[6deg]"
                initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
            />
        </div>

        {/* Service Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Easy To Order", icon: <Zap className="text-orange-500" />, desc: "Order in just 3 clicks" },
            { title: "Smooth Delivery", icon: <MapPin className="text-pink-500" />, desc: "Track every turn live" },
            { title: "Quality Food", icon: <ShieldCheck className="text-green-500" />, desc: "Verified chef partners" }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 text-center group"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
              <p className="mt-3 text-gray-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- FEATURE SECTION ---------- */}
      <section className="relative py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Live Orders", value: orders.toLocaleString(), icon: <Utensils size={14}/> },
              { label: "Cities Covered", value: "120+", icon: <MapPin size={14}/> },
              { label: "Restaurants", value: "35k+", icon: <Star size={14}/> },
              { label: "Avg Delivery", value: "24m", icon: <Clock size={14}/> },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center justify-center"
              >
                <div className="text-pink-500 mb-2">{stat.icon}</div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
            {/* Left Features */}
            <div className="space-y-4">
               <h3 className="text-4xl font-black mb-8 leading-tight">Smart features for <br/> <span className="text-pink-500">Smart Eaters.</span></h3>
              {coreFeatures.map((f, i) => (
                <FeatureRow key={f.title} {...f} delay={i * 0.1} />
              ))}
            </div>

            {/* Phone Mock - Elevated UI */}
            <div className="relative flex justify-center group">
              <div className="absolute inset-0 bg-pink-400/20 blur-[100px] rounded-full group-hover:bg-pink-400/30 transition-all" />
              <motion.div 
                whileHover={{ rotateY: -10, rotateX: 5 }}
                className="relative w-72 h-[550px] rounded-[3.5rem] bg-slate-900 p-3 shadow-2xl border-[8px] border-slate-800"
              >
                <div className="bg-white h-full rounded-[2.8rem] overflow-hidden relative">
                  <div className="h-6 w-28 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
                  <div className="p-6 pt-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="font-black text-lg">Tracking...</p>
                        <Heart className="text-pink-500" fill="currentColor" size={18}/>
                    </div>
                    <div className="h-48 rounded-3xl bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 flex items-center justify-center">
                        <motion.div 
                            animate={{ y: [0, -10, 0] }} 
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className="bg-white p-4 rounded-full shadow-lg"
                        >
                            <MapPin className="text-pink-500" size={32}/>
                        </motion.div>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} className="h-full bg-pink-500" />
                        </div>
                        <p className="text-center text-sm font-bold text-gray-400">Arriving in 8 mins</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Call to Action */}
            <div className="lg:pl-10">
              <h3 className="text-5xl font-black text-gray-900 leading-tight">
                Satisfy Every <br/>
                <span className="text-pink-500 underline decoration-pink-100 underline-offset-8">Craving.</span>
              </h3>
              <p className="mt-8 text-gray-500 text-lg font-medium leading-relaxed">
                Whether it's a 2 AM snack or a healthy breakfast bowl.
              </p>
             
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LIFESTYLE GRID ---------- */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-4xl font-black mb-20 text-gray-900 tracking-tight">Level Up Your <span className="text-pink-500">Food Game.</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {lifestyleFeatures.map((f, i) => (
                    <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white hover:border-pink-100 transition-all"
                    >
                    <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                        <span className={f.color}>{f.icon}</span>
                    </div>
                    <p className="text-xl font-black text-gray-900">{f.title}</p>
                    <p className="mt-2 text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;