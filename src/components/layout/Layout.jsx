import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, role, logout } = useAuth();

  // Handle window resize for mobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isMobile={false}
        />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          isMobile={true} 
          closeMobile={() => setIsMobileMenuOpen(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Modern Header / Navbar */}
        <header className="h-20 glass-bg border-b border-slate-800/50 flex items-center justify-between px-6 lg:px-10 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800 group focus-within:border-blue-600/50 transition-all">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all group">
              <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-slate-900 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative pl-4 border-l border-slate-800/50">
              <div 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black leading-none mt-0.5">{role}</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                    {user?.name?.[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg"></div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-all", isUserDropdownOpen && "rotate-180")} />
              </div>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-4 w-56 glass-bg border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-800/50 mb-1">
                      <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Support Ticket</button>
                    <div className="h-px bg-slate-800 my-1" />
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Pane with Smooth Transitions */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/50">
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
