import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuX } from "react-icons/lu"; // To close the menu on mobile
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Handle logout
  const handleLogout = () => {
    toast.success("👋 Logged out successfully!");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    // Notify App.jsx of auth change
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
    if (window.innerWidth < 1024) toggleSidebar();
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* MOBILE OVERLAY: Dims the background when sidebar is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 shadow-xl z-50 
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}>
        
        {/* BRANDING SECTION */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF6B35] rounded-xl shadow-lg shadow-orange-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">
              Kind<span className="text-[#FF6B35]">Bite</span> Admin
            </h1>
          </div>

          {/* Close button - Only visible on mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* NAVIGATION BODY */}
        <div className="flex-1 overflow-y-auto pt-6 px-4 space-y-1 custom-scrollbar">
          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Main Panel
          </div>

          <SidebarLink 
            to="/" 
            label="Dashboard" 
            active={isActive("/")} 
            onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          </SidebarLink>

          <SidebarLink 
            to="/order" 
            label="Orders" 
            active={isActive("/order")} 
            onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </SidebarLink>

          <SidebarLink 
            to="/add" 
            label="Add Items" 
            active={isActive("/add")}
            onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </SidebarLink>

          <SidebarLink 
            to="/list" 
            label="List Items" 
            active={isActive("/list")}
            onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </SidebarLink>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-slate-50 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all group active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="group-hover:translate-x-1 transition-transform">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const SidebarLink = ({ to, label, children, active, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 
      ${active
        ? "bg-orange-50 text-[#FF6B35] shadow-sm shadow-orange-50 border-r-4 border-[#FF6B35]"
        : "text-slate-500 hover:bg-slate-50 hover:text-[#FF6B35]"
      }`}
  >
    <div className="flex items-center gap-3">
      <span className={`transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`}>
        {children}
      </span>
      <span>{label}</span>
    </div>

    {badge && (
      <span className={`px-2 py-0.5 text-[10px] rounded-full font-black ${active ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-orange-200 group-hover:text-orange-700"}`}>
        {badge}
      </span>
    )}
  </Link>
);

export default Sidebar;