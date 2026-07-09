import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = import.meta.env.VITE_API_URL || "https://kindbite-backend-heo2.onrender.com";
  
  // ✅ Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Check authentication on mount and listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      const isAuthed = token && token !== "null" && token !== "undefined";
      setIsLoggedIn(isAuthed);
      setLoading(false);
    };

    // Initial check
    checkAuth();

    // Listen for custom auth change events (fired by Login component)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-slate-900">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 animate-spin">
            <div className="w-24 h-24 border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-full"></div>
          </div>
          <div className="absolute inset-4 animate-pulse flex items-center justify-center">
            <span className="text-white font-bold">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If not logged in, show login page
  if (!isLoggedIn) {
    return (
      <>
        <ToastContainer 
          position="top-right"
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // ✅ If logged in, show dashboard
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="flex h-screen bg-slate-50 overflow-hidden">
        
        {/* SIDEBAR: Receives state and toggle function */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* MAIN CONTENT WRAPPER */}
        {/* lg:ml-72 ensures content shifts only on desktop to make room for fixed sidebar */}
        <div className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300 lg:ml-72">
          
          {/* HEADER: Receives toggle function and logout handler */}
          <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* Dashboard Home */}
                <Route path="/" element={<Dashboard url={url} />} />
                
                {/* Pages */}
                <Route path="/add" element={<Add url={url} />} />
                <Route path="/list" element={<List url={url} />} />
                <Route path="/order" element={<Order url={url} />} />
                
                {/* 404 handler */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                    <h2 className="text-4xl font-black">404</h2>
                    <p className="font-bold">Page Not Found</p>
                  </div>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
