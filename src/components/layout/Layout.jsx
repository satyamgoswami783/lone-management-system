import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, role, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to individual role dashboards if at root of module
  const pathSegments = location.pathname.split('/').filter(Boolean);
  if (pathSegments.length === 1 && Object.values(ROLES).includes(pathSegments[0])) {
    return <Navigate to={`/${pathSegments[0]}/dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-200">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 text-slate-400">
                <button onClick={() => setIsSidebarOpen(true)}>
                    <User className="w-6 h-6" />
                </button>
             </div>
             <div className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-500 w-96 group focus-within:border-blue-500/50 transition-all">
                <Search className="w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="search anything..." 
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500 lowercase font-medium" 
                />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 hover:border-blue-500/30 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(47,128,237,0.4)]"></span>
            </button>
            <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-800">
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-200 lowercase leading-none">{user?.name}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1.5">{role}</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                    {user?.name?.[0]}
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
