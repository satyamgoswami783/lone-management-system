import React from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        "relative w-full bg-slate-900 rounded-[32px] border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden max-h-[90vh]",
        maxWidth
      )}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
          <h3 className="text-xl font-display font-bold text-slate-100">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky bottom-0 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
