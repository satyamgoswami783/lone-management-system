import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth = 'max-w-xl',
  preventBackdropClick = false,
  bodyClassName = ""
}) => {
  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent layout shift if possible
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Handle Escape Key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden overscroll-contain pointer-events-none"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto"
            onClick={preventBackdropClick ? undefined : onClose}
            aria-hidden="true"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative z-10 w-full max-h-[85dvh] sm:max-h-[90vh] flex flex-col pointer-events-auto',
              'bg-slate-900 rounded-[32px] sm:rounded-[40px] border border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]',
              maxWidth
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/50 backdrop-blur-sm rounded-t-[32px] sm:rounded-t-[40px] flex-shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-100 truncate tracking-tight">{title}</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-shrink-0"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className={cn(
              "flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain",
              "p-6 sm:p-8",
              bodyClassName
            )}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 sm:px-8 sm:py-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm rounded-b-[32px] sm:rounded-b-[40px] flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
