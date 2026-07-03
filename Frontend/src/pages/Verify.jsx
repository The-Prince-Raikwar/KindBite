import React, { useContext, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const { url, token } = useContext(AuthContext);

  const hasRun = useRef(false); // ✅ FIX: Prevent multiple calls

  const checkPayment = async () => {
    try {
      if (!orderId) {
        toast.error("Invalid payment verification link");
        navigate("/cart");
        return;
      }

      const response = await axios.post(url + "/api/order/verify", {
        orderId,
        success,
      });

      if (response.data.success) {
        toast.success("Payment Verified! Navigating to your orders...");
        setTimeout(() => {
          navigate("/orders");
        }, 500);
      } else {
        toast.error(response.data.message || "Payment verification failed");
        setTimeout(() => {
          navigate("/cart");
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to verify payment. Please contact support.");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    }
  };

  useEffect(() => {
    if (hasRun.current) return; // ✅ prevents second call in React 18 strict mode
    hasRun.current = true;

    checkPayment();
  }, [orderId, success]);

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-emerald-400 font-bold text-lg animate-pulse">
              Verifying Payment
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Please wait while we confirm your payment...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;