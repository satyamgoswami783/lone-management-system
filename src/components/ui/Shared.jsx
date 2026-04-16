import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Badge = ({ children, variant = 'neutral', className }) => {
  const variants = {
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-600/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, subValue, icon: Icon, trend, variant = 'primary' }) => {
  const iconVariants = {
    primary: 'bg-blue-600/20 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-600/20 text-amber-400 border-amber-500/20',
    danger: 'bg-red-600/20 text-red-400 border-red-500/20',
  };

  return (
    <div className="glass p-6 rounded-3xl space-y-4 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-2xl border transition-transform duration-300 group-hover:scale-110", iconVariants[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg border",
            trend.type === 'up' ? "bg-emerald-400/10 text-emerald-400 border-emerald-500/10" : "bg-red-400/10 text-red-400 border-red-500/10"
          )}>
            {trend.type === 'up' ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h3 className="text-2xl font-display font-bold">{value}</h3>
          {subValue && <span className="text-xs text-slate-500 font-medium">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div className="space-y-1">
      <h1 className="text-3xl font-display font-bold tracking-tight">{title}</h1>
      {description && <p className="text-slate-400 text-lg">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

export const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: 'bg-emerald-600/90 text-white border-emerald-500 shadow-emerald-500/20',
    danger: 'bg-red-600/90 text-white border-red-500 shadow-red-500/20',
    info: 'bg-blue-600/90 text-white border-blue-500 shadow-blue-500/20',
  };

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-[200] px-6 py-3 rounded-2xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 duration-500 flex items-center gap-3",
      variants[type]
    )}>
      {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
      {type === 'danger' && <XCircle className="w-5 h-5" />}
      {type === 'info' && <Info className="w-5 h-5" />}
      <span className="font-bold text-sm tracking-wide">{message}</span>
    </div>
  );
};
