import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Badge = ({ children, variant = 'neutral', className }) => {
  const variants = {
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
    primary: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export const StatCard = ({ title, value, subValue, icon: Icon, trend, variant = 'primary' }) => {
  const iconVariants = {
    primary: 'bg-blue-50 text-blue-500 border-blue-100',
    success: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    warning: 'bg-amber-50 text-amber-500 border-amber-100',
    danger: 'bg-red-50 text-red-500 border-red-100',
  };

  return (
    <div className="glass p-8 rounded-[32px] space-y-5 transition-all duration-500 group relative overflow-hidden">
        {/* Subtle Accent Glow */}
        <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16", 
            variant === 'primary' ? 'bg-blue-500' : 
            variant === 'success' ? 'bg-emerald-500' : 
            variant === 'warning' ? 'bg-amber-500' : 'bg-red-500'
        )}></div>

      <div className="flex items-center justify-between relative z-10">
        <div className={cn("p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg", iconVariants[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest",
            trend.type === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
          )}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="text-3xl font-display font-bold text-slate-200">{value}</h3>
          {subValue && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
    <div className="space-y-2">
      <h1 className="text-4xl font-display font-bold tracking-tight text-slate-200">{title}</h1>
      {description && <p className="text-slate-400 text-lg font-medium">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-4">{actions}</div>}
  </div>
);

export const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: 'bg-white text-slate-800 border-emerald-100 shadow-emerald-500/10',
    danger: 'bg-white text-slate-800 border-red-100 shadow-red-500/10',
    info: 'bg-white text-slate-800 border-blue-100 shadow-blue-500/10',
  };

  return (
    <div className={cn(
      "fixed bottom-10 right-10 z-[300] px-8 py-5 rounded-[24px] border shadow-2xl animate-in slide-in-from-right-20 duration-500 flex items-center gap-4",
      variants[type]
    )}>
      <div className={cn("p-2 rounded-xl", 
        type === 'success' ? 'bg-emerald-50 text-emerald-500' :
        type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
      )}>
        {type === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {type === 'danger' && <XCircle className="w-5 h-5" />}
        {type === 'info' && <Info className="w-5 h-5" />}
      </div>
      <span className="font-bold text-sm tracking-tight">{message}</span>
    </div>
  );
};

export const ApplicationTable = ({ data, columns, onRowClick }) => (
    <div className="glass rounded-[40px] overflow-hidden border-slate-800/50">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800/50">
                        {columns.map((col, i) => (
                            <th key={i} className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {data.map((row, i) => (
                        <tr key={i} onClick={() => onRowClick?.(row)} className="hover:bg-slate-900/50 transition-all cursor-pointer group">
                             {columns.map((col, j) => (
                                <td key={j} className="px-8 py-7">
                                    {col.render ? col.render(row) : <span className="text-sm font-bold text-slate-200">{row[col.key]}</span>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
