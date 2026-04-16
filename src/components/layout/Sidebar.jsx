import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  ChevronLeft, 
  ChevronRight
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
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
        isActive 
          ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]" 
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
        isActive ? "text-blue-400" : "group-hover:text-blue-400"
      )} />
      
      {(isOpen || isMobile) && (
        <span className="font-medium text-sm animate-in fade-in slide-in-from-left-2 duration-300">
          {item.title}
        </span>
      )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
      )}
      
      {/* Tooltip for collapsed state */}
      {!isOpen && !isMobile && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-800">
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
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800/50 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/30">
          L
        </div>
        {(isOpen || isMobile) && (
          <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="font-display font-bold text-lg tracking-tight">Antigravity</span>
            <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest leading-none">LMS v1.0</span>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => {
          // Determine if this is a group or a flat list wrapped in a group
          const isGrouped = group.group && (isOpen || isMobile);
          const items = group.items || (Array.isArray(group) ? group : []);
          const groupTitle = group.group;

          // If group is actually a flat item (backward compatibility or future-proofing)
          if (group.title && group.path) {
             return <SidebarItem key={group.path} item={group} isOpen={isOpen} isMobile={isMobile} handleAction={handleAction} closeMobile={closeMobile} location={location} />;
          }

          return (
            <div key={groupIdx} className={cn("space-y-2", isGrouped ? "mt-6" : "mt-0")}>
              {isGrouped && (
                <h3 className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
                  {groupTitle}
                </h3>
              )}
              
              <div className="space-y-1">
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
              
              {/* Divider between sections in collapsed mode if grouped */}
              {!isOpen && !isMobile && isGrouped && groupIdx < menuGroups.length - 1 && (
                <div className="mx-4 h-px bg-slate-800/50 my-4" />
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info (Visible only when open) */}
      {(isOpen || isMobile) && (
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/20 flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-slate-800/30 group/user relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/0 group-hover/user:bg-blue-600/5 transition-colors" />
            <div className="flex items-center gap-3 relative z-10 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-500 shadow-inner flex-shrink-0">
                {user?.name?.[0]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-slate-200">{user?.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{role}</span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all relative z-10"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-500/60 transition-colors group-hover:text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle (Desktop Only) */}
      {!isMobile && (
        <button 
          onClick={toggle}
          className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/40 hover:scale-110 transition-transform z-50 border-2 border-slate-950"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] animate-in fade-in duration-300" 
            onClick={closeMobile}
          />
        )}
        {/* Mobile Drawer */}
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
