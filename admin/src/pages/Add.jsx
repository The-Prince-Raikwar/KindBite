/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  Plus, Trash2, Image as ImageIcon, Sparkles, 
  DollarSign, CheckCircle2, X, Info, Upload
} from "lucide-react";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [data, setdata] = useState({
    name: "",
    description: "",
    price: "",
    category: "North Indian",
    isAvailable: true
  });

  const [modifierGroups, setModifierGroups] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) return toast.error("File too large. Max 5MB.");
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('img-up');
    if (fileInput) fileInput.value = "";
  };

  const addModifierGroup = () => {
    setModifierGroups([...modifierGroups, { 
      id: Date.now(), 
      name: "", 
      options: [{ name: "", price: "" }] 
    }]);
  };

  const updateModifierGroupName = (id, name) => {
    setModifierGroups(modifierGroups.map(g => g.id === id ? { ...g, name } : g));
  };

  const addOptionToGroup = (groupId) => {
    setModifierGroups(modifierGroups.map(g => 
      g.id === groupId ? { ...g, options: [...g.options, { name: "", price: "" }] } : g
    ));
  };

  const updateOption = (groupId, optIndex, field, value) => {
    setModifierGroups(modifierGroups.map(g => {
      if (g.id === groupId) {
        const newOptions = [...g.options];
        newOptions[optIndex][field] = value;
        return { ...g, options: newOptions };
      }
      return g;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload a product image.");
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);
    formData.append("isAvailable", data.isAvailable);
    formData.append("modifiers", JSON.stringify(modifierGroups));

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        toast.success("Dish published successfully!");
        resetForm();
      } else {
        toast.error(response.data.message || "Failed to add item.");
      }
    } catch (err) {
      toast.error("Network error. Failed to publish.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setdata({ name: "", description: "", price: "", category: "North Indian", isAvailable: true });
    setModifierGroups([]);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans pb-24 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create <span className="text-indigo-600">New Dish</span>
            </h1>
            <p className="text-slate-500 font-medium">Add a new item to your digital storefront</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
             <div className={`w-2.5 h-2.5 rounded-full ${imagePreview ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
             <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
               {imagePreview ? "Ready to Sync" : "Draft Mode"}
             </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CONFIGURATION */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CARD 1: PRIMARY INFO */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Info size={20} />
                </div>
                <h3 className="font-bold text-slate-800">Essential Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Dish Name</label>
                  <input 
                    required value={data.name} onChange={(e) => setdata({...data, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-xl font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                    placeholder="Signature Pasta..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required type="number" step="0.01" value={data.price} onChange={(e) => setdata({...data, price: e.target.value})}
                      className="w-full p-4 pl-10 bg-slate-50 border border-transparent rounded-xl font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Description</label>
                <textarea 
                  required value={data.description} rows="3" onChange={(e) => setdata({...data, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-transparent rounded-xl font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="Tell customers about your dish..."
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Category</label>
                  <select 
                    value={data.category} onChange={(e) => setdata({...data, category: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-xl font-bold text-indigo-600 outline-none appearance-none cursor-pointer"
                  >
                     <option value="North Indian">North Indian</option>
                      <option value="South Indian">South Indian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                      <option value="Continental">Continental</option>
                      <option value="Western Salad">Western Salad</option>
                      <option value="Complete Meal">Complete Meal</option>
                      <option value="Western Soup">Western Soup</option>
                      <option value="Rice Dish">Rice Dish</option>
                      <option value="Bread">Bread</option>
                      <option value="Main Course">Main Course</option>
                      <option value="BreakFast">BreakFast</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                    <button 
                        type="button" 
                        onClick={() => setdata({...data, isAvailable: !data.isAvailable})}
                        className={`w-full p-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${data.isAvailable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}
                    >
                        {data.isAvailable ? <CheckCircle2 size={18}/> : <X size={18}/>}
                        {data.isAvailable ? 'Available for Orders' : 'Mark as Out of Stock'}
                    </button>
                </div>
              </div>
            </section>

            {/* CARD 2: MODIFIERS */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-bold text-slate-800">Add-ons & Modifiers</h3>
                </div>
                <button type="button" onClick={addModifierGroup} className="text-xs font-black uppercase text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
                  + Add Group
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {modifierGroups.map((group) => (
                    <motion.div 
                      key={group.id} 
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                    >
                      <button type="button" onClick={() => setModifierGroups(modifierGroups.filter(g => g.id !== group.id))} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500">
                        <Trash2 size={16}/>
                      </button>

                      <input 
                        placeholder="Modifier Group (e.g. Choose Crust)" 
                        value={group.name} onChange={(e) => updateModifierGroupName(group.id, e.target.value)}
                        className="bg-transparent border-b border-slate-200 text-sm font-bold text-slate-800 mb-4 focus:border-indigo-500 outline-none pb-1 w-2/3"
                      />

                      <div className="space-y-3">
                        {group.options.map((opt, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <input 
                              placeholder="Option name" value={opt.name} onChange={(e) => updateOption(group.id, idx, 'name', e.target.value)}
                              className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                            <div className="relative w-28">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">$</span>
                              <input 
                                type="number" placeholder="Price" value={opt.price} onChange={(e) => updateOption(group.id, idx, 'price', e.target.value)}
                                className="w-full p-2.5 pl-6 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 outline-none"
                              />
                            </div>
                            <button type="button" onClick={() => removeOption(group.id, idx)} className="text-slate-300 hover:text-rose-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addOptionToGroup(group.id)} className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-1 mt-2">
                          <Plus size={12}/> Add Option
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {modifierGroups.length === 0 && (
                  <div className="py-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                    <p className="text-xs font-bold text-slate-400">No modifiers. Click "Add Group" to include toppings or sizes.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: PREVIEW STICKY */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-white">
                <div className="h-56 bg-slate-100 relative group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button onClick={removeImage} className="absolute top-4 right-4 bg-rose-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <label htmlFor="img-up" className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-slate-200 transition-colors">
                        <Upload className="text-slate-400 mb-2" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Upload Dish Image</span>
                    </label>
                  )}
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase">
                    {data.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h2 className="text-lg font-black text-slate-800 leading-tight">{data.name || "Dish Name"}</h2>
                    <span className="text-lg font-black text-indigo-600">${data.price || "0.00"}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium italic">
                    {data.description || "The description you write will appear here for customers..."}
                  </p>
                  <div className="flex gap-2">
                    {modifierGroups.length > 0 && (
                       <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-md border border-amber-100">CUSTOMIZABLE</span>
                    )}
                    <span className={`px-2 py-1 text-[9px] font-black rounded-md ${data.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {data.isAvailable ? 'INSTOCK' : 'UNAVAILABLE'}
                    </span>
                  </div>
                </div>
              </div>

              <input type="file" id="img-up" hidden onChange={handleImageChange} accept="image/*" />
              <label htmlFor="img-up" className="block w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                <span className="text-xs font-black uppercase text-slate-400">Replace High-Res Asset</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center justify-between z-50 border border-white/10">
          <div className="hidden md:flex flex-col ml-4">
            <span className="text-white text-xs font-bold">{data.name || 'Unnamed Item'}</span>
            <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{isLoading ? 'Processing...' : 'Ready to push'}</span>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || !image}
            className="w-full md:w-auto px-10 py-3.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? 'Uploading...' : 'Deploy to Menu'}
            <CheckCircle2 size={18} />
          </button>
      </div>
    </div>
  );
};

export default Add;