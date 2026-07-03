/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { foodItems } from '../assets/assets'
import FoodDisplay from '../components/FoodDisplay'
import { motion, AnimatePresence } from "framer-motion"
import { 
  FaSearch, FaStar, FaClock, FaTruck, 
  FaLeaf, FaFire, FaHeart, FaRegHeart,
  FaChevronRight, FaPlay, FaArrowRight
} from "react-icons/fa"

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')
  const [likedItems, setLikedItems] = useState({})

  const toggleLike = (e, index) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="bg-[#fafafa] min-h-screen text-[#1a1a1a] font-sans selection:bg-orange-100">
      
      {/* --- LUXURY HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-40">
           <motion.img 
             initial={{ scale: 1.2 }}
             animate={{ scale: 1 }}
             transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
             src="https://images.pexels.com/photos/940302/pexels-photo-940302.jpeg" 
             className="w-full h-full object-cover"
           />
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 backdrop-blur-md rounded-full px-4 py-1 mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-500 text-xs font-black uppercase tracking-widest">Live Kitchens Open</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              ART OF <br /> 
              <span className="italic font-light text-zinc-400">FLAVOR.</span>
            </h1>
            
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed mb-10">
              Handcrafted culinary experiences delivered from the city's top-rated chefs directly to your sanctuary.
            </p>

           
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
          >
            <div className="aspect-square w-full max-w-lg rounded-[4rem] overflow-hidden border border-white/10 rotate-3 shadow-2xl">
               <video src="/src/assets/eat bite and keep quite.mp4" autoPlay muted loop className="w-full h-full object-cover" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 -rotate-3">
               <div className="bg-orange-100 p-3 rounded-2xl text-orange-500"><FaStar /></div>
               <div>
                  <p className="text-black font-black text-xl leading-none">4.9</p>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Community Score</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SEARCH HUB (FLOATING ISLAND) --- */}
     

      {/* --- BENTO CATEGORIES GRID --- */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
           <div>
             <span className="text-orange-500 font-black uppercase text-[10px] tracking-[0.4em]">Browse</span>
             <h2 className="text-4xl font-black tracking-tighter uppercase italic">Curated <span className="text-zinc-300">Menus</span></h2>
           </div>
           <p className="text-zinc-400 text-sm font-medium hidden md:block max-w-[200px] text-right">
             Each dish is verified for quality and freshness.
           </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {foodItems.slice(0, 6).map((item, index) => (
             <motion.div
               key={index}
               whileHover={{ y: -8 }}
               className="group relative h-64 rounded-[2rem] overflow-hidden bg-zinc-100 border border-zinc-200 cursor-pointer"
             >
               <img src={item.foodItems_image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
               
               <button 
                 onClick={(e) => toggleLike(e, index)}
                 className="absolute top-4 right-4 z-20 text-white/50 hover:text-red-500 transition-colors"
               >
                 {likedItems[index] ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
               </button>

               <div className="absolute bottom-6 left-6 text-white">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{item.category || 'Kitchen'}</p>
                 <h4 className="font-bold tracking-tight leading-tight">{item.name || 'Signature'}</h4>
               </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* --- MAIN DISPLAY SECTION --- */}
      <div className="bg-white rounded-t-[4rem] border-t border-zinc-100 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <FoodDisplay category={category} searchTerm={searchTerm} />
      </div>

    </div>
  )
}

export default Explore;