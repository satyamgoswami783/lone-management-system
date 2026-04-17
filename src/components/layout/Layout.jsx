import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Bell, Search, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to individual role dashboards if at root of module
  const pathSegments = location.pathname.split('/').filter(Boolean);
  if (pathSegments.length === 1 && Object.values(ROLES).includes(pathSegments[0])) {
    return <Navigate to={`/${pathSegments[0]}/dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen min-h-dvh bg-white text-slate-200 overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobile={isMobile}
        closeMobile={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-800 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
             {/* Mobile Hamburger Menu */}
             <div className="lg:hidden flex-shrink-0">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-all shadow-lg active:scale-95"
                >
                    <Menu className="w-6 h-6" />
                </button>
             </div>
             <div className="hidden md:flex items-center gap-2 px-4 lg:px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-500 flex-1 max-w-md min-w-0 group focus-within:border-blue-500/50 transition-all">
                <Search className="w-4 h-4 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="search anything..." 
                  className="bg-transparent border-none outline-none text-sm w-full min-w-0 placeholder:text-slate-500 lowercase font-medium" 
                />
             </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0 ml-auto">
            <button className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 hover:border-blue-500/30 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(47,128,237,0.4)]"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 sm:gap-4 pl-4 sm:pl-6 border-l border-slate-800 min-w-0">
                <div className="text-right min-w-0 max-w-[10rem] lg:max-w-none">
                    <p className="text-sm font-bold text-slate-200 lowercase leading-none truncate">{user?.name}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1.5 truncate">{role}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                    {user?.name?.[0]}
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 min-h-0 p-4 sm:p-6 lg:p-10 xl:p-12 overflow-y-auto overflow-x-hidden no-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full min-w-0">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
