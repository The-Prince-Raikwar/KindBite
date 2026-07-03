/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { 
  FaInstagram, FaFacebook, FaTwitter, FaLinkedin, 
  FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";

const Footer = () => {
  const { token } = useContext(AuthContext);

  // ✅ Only show footer if user is logged in
  if (!token || token === "null" || token === "undefined") {
    return null;
  }

  return (
    <footer className="relative text-white pt-20 pb-10 overflow-hidden bg-slate-950">
      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* --- TOP GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-500/20">
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/3448/3448609.png" 
                  alt="Logo" 
                  className="w-8 h-8 brightness-0 invert"
                />
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                Kind<span className="text-amber-500">Bite</span>
              </h2>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Bringing the world's best flavors right to your doorstep. Fast, fresh, and handled with care. Your cravings, delivered.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: <FaInstagram />, color: "hover:bg-pink-600", link: "#" },
                { icon: <FaFacebook />, color: "hover:bg-blue-700", link: "#" },
                { icon: <FaTwitter />, color: "hover:bg-sky-500", link: "#" },
                { icon: <FaWhatsapp />, color: "hover:bg-green-600", link: "#" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  whileHover={{ y: -5 }}
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-all ${social.color}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-amber-500 w-fit">Company</h3>
            <ul className="space-y-3">
              {["Home", "Explore", "Services", "About Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors flex items-center group font-medium">
                    <span className="w-0 group-hover:w-4 transition-all h-[2px] bg-amber-500 mr-0 group-hover:mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-amber-500 w-fit">Help</h3>
            <ul className="space-y-3">
              {["Support Center", "Privacy Policy", "Terms of Use", "Refund Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors flex items-center group font-medium">
                    <span className="w-0 group-hover:w-4 transition-all h-[2px] bg-amber-500 mr-0 group-hover:mr-2"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest border-b border-amber-500 w-fit">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-slate-400">
                <FaPhoneAlt className="text-amber-500 mt-1" />
                <p className="text-sm font-bold">+91 7007149516</p>
              </div>
              <div className="flex items-start gap-4 text-slate-400">
                <FaEnvelope className="text-amber-500 mt-1" />
                <p className="text-sm font-bold">support@kindbite.com</p>
              </div>
              
              <div className="pt-4">
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-3">Newsletter</p>
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 overflow-hidden focus-within:border-amber-500 transition-all">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-transparent border-none outline-none text-sm px-3 flex-1 text-white"
                  />
                  <button className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl font-black text-xs transition-all uppercase">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
            &copy; 2026 <span className="text-white">KindBite</span>. Made with ❤️ for food lovers.
          </p>

          <div className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
            <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5" alt="Visa" />
            <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" className="h-5" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-5" alt="Paypal" />
            <img src="https://img.icons8.com/color/48/000000/google-pay.png" className="h-5" alt="GPay" />
          </div>

          <div className="flex gap-4">
            <motion.button whileHover={{ y: -2 }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-white/10">
              App Store
            </motion.button>
            <motion.button whileHover={{ y: -2 }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-tighter hover:bg-white/10">
              Play Store
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;