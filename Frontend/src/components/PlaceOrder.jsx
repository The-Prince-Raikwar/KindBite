/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaWallet,
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaClock,
  FaGift,
  FaHome,
  FaCheckCircle,
  FaChevronRight,
  FaShieldAlt,
  FaUtensils,
  FaCoins,
  FaLeaf,
  FaLocationArrow,
  FaFileDownload,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCart, token, cartItem, foodList, url } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrdering, setIsOrdering] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [data, setData] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    zip: "",
    instructions: "",
    email: "",
    apartment: "",
    floor: "",
    dropType: "",
    timing: "asap",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // --- CALCULATIONS (Real Breakdown) ---
  const currencyIcon = "₹";
  const subtotal = getTotalCart();
  const deliveryFee = subtotal === 0 ? 0 : 27;
  const serviceFee = subtotal === 0 ? 0 : 15;
  
  // GST Breakdown (5% Total: 2.5% CGST + 2.5% SGST)
  const gstRate = 0.05;
  const totalTax = subtotal * gstRate;
  const cgst = totalTax / 2;
  const sgst = totalTax / 2;

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const discountAmount = (subtotal * appliedDiscount) / 100;

  const grandTotal =
    subtotal === 0 ? 0 : subtotal + deliveryFee + serviceFee + totalTax - discountAmount;
  
  const foodiePoints = Math.floor(grandTotal * 5);



  const placeOrder = async (e) => {
    e.preventDefault();
    
    // ✅ Validate token before placing order
    if (!token || token === "null" || token === "undefined") {
      toast.error("Please login to place an order");
      setIsOrdering(false);
      return;
    }

    setIsOrdering(true);
    let orderItems = [];
    foodList.map((item) => {
      if (cartItem[item.id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItem[item.id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: grandTotal,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { session_url } = response.data;
        if (session_url) {
          // Redirect to Stripe payment page
          window.location.href = session_url;
        } else {
          toast.error("Failed to generate payment session");
          setIsOrdering(false);
        }
      } else {
        toast.error(response.data.message || "Order placement failed.");
        setIsOrdering(false);
      }
    } catch (error) {
      // ✅ Better error handling
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        toast.error(error.response?.data?.message || "Server error. Please try again.");
      }
      setIsOrdering(false);
    }
  };

  const downloadInvoice = () => {
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice_${data.name || 'Order'}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
            .header { border-bottom: 4px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 28px; font-weight: 900; color: #f97316; text-transform: uppercase; }
            .invoice-title { font-size: 14px; text-align: right; color: #64748b; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; color: #94a3b8; border-bottom: 1px solid #f1f5f9; margin-bottom: 10px; }
            .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8fafc; font-size: 14px; }
            .total-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 20px; }
            .grand-total { font-size: 24px; font-weight: 900; color: #0f172a; border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 10px; }
            .tax-note { font-size: 11px; color: #64748b; margin-top: 20px; font-style: italic; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Gourmet Logistics</div>
            <div class="invoice-title">INVOICE NO: #GL-${Math.floor(Date.now() / 1000)}<br>DATE: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Delivery To</div>
            <div style="font-weight: bold;">${data.name || 'Valued Customer'}</div>
            <div>${data.address}, ${data.apartment ? 'Apt ' + data.apartment : ''}</div>
            <div>${data.city}, ${data.zip}</div>
            <div>Phone: ${data.phone}</div>
          </div>

          <div class="section">
            <div class="section-title">Order Summary</div>
            <div class="item-row"><span>Kitchen Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
            <div class="item-row" style="color: #64748b;"><span>CGST (2.5%)</span><span>₹${cgst.toFixed(2)}</span></div>
            <div class="item-row" style="color: #64748b;"><span>SGST (2.5%)</span><span>₹${sgst.toFixed(2)}</span></div>
            <div class="item-row"><span>Express Delivery</span><span>₹${deliveryFee.toFixed(2)}</span></div>
            <div class="item-row"><span>Service Fee</span><span>₹${serviceFee.toFixed(2)}</span></div>
            ${appliedDiscount > 0 ? `<div class="item-row" style="color: #10b981;"><span>Discount Applied</span><span>-₹${discountAmount.toFixed(2)}</span></div>` : ''}
            
            <div class="total-box">
               <div class="item-row grand-total"><span>Grand Total</span><span>₹${grandTotal.toFixed(2)}</span></div>
            </div>
          </div>

          <div class="tax-note">
            * This is a computer generated invoice. Total includes GST as per government norms. 
            Foodie Points Earned: ${foodiePoints}
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const locationData = await res.json();
          if (locationData.address) {
            setData((prev) => ({
              ...prev,
              address: locationData.display_name.split(",").slice(0, 2).join(","),
              city: locationData.address.city || locationData.address.town || "",
              zip: locationData.address.postcode || "",
            }));
            toast.success("Location Synced!");
          }
        } catch {
          toast.error("Location fetch failed");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Permission denied");
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] pb-24 font-sans selection:bg-orange-100">
      <ToastContainer position="top-right" theme="colored" />

      {/* --- HERO SECTION --- */}
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#FDFDFD]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-6"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md text-emerald-400 px-4 py-2 rounded-full text-xs font-black mb-6 border border-emerald-500/30">
            <FaLeaf /> 100% ECO-FRIENDLY PACKAGING
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
            Finalize <span className="text-orange-500">Logistics.</span>
          </h1>
          <p className="text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
            Review your gourmet selection and secure your delivery.
            <br />
            Almost time to dig in!
          </p>
        </motion.div>
      </div>

      <form onSubmit={placeOrder} className="placeorder-form">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 -mt-16">
          {/* --- LEFT: FORMS --- */}
          <div className="lg:col-span-7 space-y-8 relative z-20">
            <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">
                    1
                  </span>
                  Delivery Details
                </h2>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-orange-500 transition-all flex items-center gap-2"
                >
                  {isLocating ? "Syncing..." : <><FaLocationArrow /> Auto-Detect</>}
                </button>
              </div>

              <div className="space-y-10">
                <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <FaUserCircle size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModernInput label="Full Name" name="name" value={data.name} placeholder="James Beard" onChange={onChangeHandler} icon={<FaUserCircle />} />
                    <ModernInput label="Phone Number" name="phone" value={data.phone} placeholder="+91 00000 00000" onChange={onChangeHandler} icon={<FaPhoneAlt />} />
                    <div className="md:col-span-2">
                      <ModernInput label="Email Address" name="email" value={data.email} placeholder="james@gourmet.com" onChange={onChangeHandler} icon={<FaEnvelope />} />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FaMapMarkerAlt size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Destination</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8">
                        <ModernInput label="Street Address" name="address" value={data.address} placeholder="123 Flavor St." onChange={onChangeHandler} />
                      </div>
                      <div className="md:col-span-4">
                        <ModernInput label="Apt / Suite" name="apartment" value={data.apartment} placeholder="4B" onChange={onChangeHandler} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ModernInput label="City" name="city" value={data.city} placeholder="New Delhi" onChange={onChangeHandler} />
                      <ModernInput label="Floor" name="floor" value={data.floor} placeholder="2nd" onChange={onChangeHandler} />
                      <ModernInput label="Zip Code" name="zip" value={data.zip} placeholder="110001" onChange={onChangeHandler} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black flex items-center gap-3 mb-8">
                <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BentoPaymentOption active={paymentMethod === "cod"} onClick={() => setPaymentMethod("cod")} title="Cash on Delivery" icon={<FaWallet />} />
                <BentoPaymentOption active={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} title="Credit / Debit Card" icon={<FaCreditCard />} />
              </div>
            </section>
          </div>

          {/* --- RIGHT: THE TICKET --- */}
          <aside className="lg:col-span-5 relative z-20">
            <div className="sticky top-10">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 grayscale pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="receipt bg" />
                </div>

                <div className="relative z-10">
                  <p className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Order Summary</p>
                  <h3 className="text-3xl font-black mb-8 border-b border-white/10 pb-6">Final Bill</h3>

                  <div className="space-y-4 mb-10">
                    <BillRow label="Kitchen Subtotal" value={`${currencyIcon}${subtotal.toFixed(2)}`} />
                    <BillRow label="CGST (2.5%)" value={`${currencyIcon}${cgst.toFixed(2)}`} color="text-white/40" />
                    <BillRow label="SGST (2.5%)" value={`${currencyIcon}${sgst.toFixed(2)}`} color="text-white/40" />
                    <BillRow label="Express Delivery" value={`${currencyIcon}${deliveryFee.toFixed(2)}`} />
                    <BillRow label="Service Fee" value={`${currencyIcon}${serviceFee.toFixed(2)}`} />
                    
                    {appliedDiscount > 0 && (
                      <BillRow label="Promo Discount" value={`-${currencyIcon}${discountAmount.toFixed(2)}`} color="text-emerald-400" />
                    )}

                    <div className="pt-8 mt-4 border-t border-white/10">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Grand Total</p>
                      <div className="flex justify-between items-end">
                        <p className="text-5xl font-black tracking-tighter tabular-nums">{currencyIcon}{grandTotal.toFixed(2)}</p>
                        <div className="text-right pb-1">
                          <p className="text-emerald-400 font-black text-xl">+{foodiePoints}</p>
                          <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Foodie Points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isOrdering || subtotal === 0}
                    className={`w-full py-6 rounded-[2rem] text-lg font-black transition-all flex items-center justify-center gap-3
                    ${subtotal === 0 ? "bg-white/10 text-white/20" : "bg-orange-500 text-white hover:bg-orange-400 shadow-xl shadow-orange-500/30"}`}
                  >
                    {isOrdering ? <Spinner /> : <>CONFIRM ORDER <FaChevronRight size={14} /></>}
                  </motion.button>

                  <button 
                    type="button" 
                    onClick={downloadInvoice}
                    disabled={subtotal === 0}
                    className="w-full mt-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white/60"
                  >
                    <FaFileDownload /> Get PDF Receipt
                  </button>
                </div>
              </div>

             
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};

const ModernInput = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      {...props}
      required
      className="w-full p-4 bg-slate-50/80 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 transition-all text-sm outline-none font-bold text-slate-700"
    />
  </div>
);

const BentoPaymentOption = ({ active, onClick, title, icon }) => (
  <div
    onClick={onClick}
    className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col gap-4 relative overflow-hidden group ${active ? "border-slate-900 bg-slate-900 text-white shadow-2xl" : "border-slate-100 bg-white hover:border-slate-200"}`}
  >
    <div className={`text-3xl ${active ? "text-orange-500" : "text-slate-300 group-hover:text-orange-300"} transition-colors`}>{icon}</div>
    <span className="font-black text-xs uppercase tracking-widest">{title}</span>
    {active && <FaCheckCircle className="absolute top-6 right-6 text-emerald-400" />}
  </div>
);

const BillRow = ({ label, value, color = "text-white/60" }) => (
  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
    <span className="text-white/20">{label}</span>
    <span className={color}>{value}</span>
  </div>
);

const Spinner = () => (
  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
);

export default PlaceOrder;