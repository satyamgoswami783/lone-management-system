import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { menuConfig } from '../../config/menuConfig';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ item, isOpen, isMobile, handleAction, closeMobile, location }) => {
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <Link
      to={item.action === 'logout' ? '#' : item.path}
      onClick={(e) => {
        if (item.action) {
          e.preventDefault();
          handleAction(item.action);
        }
        if (isMobile) closeMobile();
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-400 hover:text-slate-300 hover:bg-slate-900"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-blue-600" : "group-hover:text-blue-600"
      )} />

      {(isOpen || isMobile) && (
        <span className="font-bold text-sm lowercase animate-in fade-in slide-in-from-left-2 duration-300">
          {item.title}
        </span>
      )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 w-1.5 h-6 bg-blue-600 rounded-r-full shadow-[0_0_15px_rgba(47,128,237,0.4)]" />
      )}

      {/* Tooltip for collapsed state */}
      {!isOpen && !isMobile && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-200 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
          {item.title}
        </div>
      )}
    </Link>
  );
};

const Sidebar = ({ isOpen, toggle, isMobile, closeMobile }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const menuGroups = menuConfig[role] || [];

  const handleAction = (action) => {
    if (action === 'logout') {
      logout();
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-800 shadow-sm relative z-20">
      {/* Logo Area - "lenni" branding */}
      <div className="h-24 flex items-center px-8 gap-3 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-blue-500/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        {(isOpen || isMobile) && (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="font-display font-black text-2xl tracking-tighter text-slate-200 lowercase">lenni.</span>
            <span className="text-[9px] text-blue-500 uppercase font-black tracking-[0.2em] leading-none mt-1">enterprise</span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto no-scrollbar">
        {menuGroups.map((group, groupIdx) => {
          const isGrouped = group.group && (isOpen || isMobile);
          const items = group.items || (Array.isArray(group) ? group : []);
          const groupTitle = group.group;

          if (group.title && group.path) {
            return <SidebarItem key={group.path} item={group} isOpen={isOpen} isMobile={isMobile} handleAction={handleAction} closeMobile={closeMobile} location={location} />;
          }

          return (
            <div key={groupIdx} className={cn("space-y-4", isGrouped ? "mt-4" : "mt-0")}>
              {isGrouped && (
                <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                  {groupTitle}
                </h3>
              )}

              <div className="space-y-1.5">
                {(group.items || group).map((item, itemIdx) => (
                  <SidebarItem
                    key={item.path || itemIdx}
                    item={item}
                    isOpen={isOpen}
                    isMobile={isMobile}
                    handleAction={handleAction}
                    closeMobile={closeMobile}
                    location={location}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      {(isOpen || isMobile) && (
        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between p-4 rounded-[24px] bg-white border border-slate-800 group/user relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-4 relative z-10 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-500 flex-shrink-0">
                {user?.name?.[0]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-slate-200 lowercase">{user?.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{role}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all relative z-10"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      {!isMobile && (
        <button
          onClick={toggle}
          className="absolute -right-3 top-28 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform z-50 border-2 border-white"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-slate-200/40 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
            onClick={closeMobile}
          />
        )}
        <div className={cn(
          "fixed inset-y-0 left-0 w-72 z-[70] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {SidebarContent}
        </div>
      </>
    );
  }

  return (
    <aside className={cn(
      "h-screen sticky top-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50 flex-shrink-0",
      isOpen ? "w-72" : "w-24"
    )}>
      {SidebarContent}
    </aside>
  );
};

export default Sidebar;
