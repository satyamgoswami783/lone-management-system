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
  preventBackdropClick = false
}) => {
  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 bg-black/60 backdrop-blur-sm"
            onClick={preventBackdropClick ? undefined : onClose}
            aria-hidden="true"
          />

          <div className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative my-auto w-full max-h-[min(90dvh,90vh)] min-h-0 pointer-events-auto',
                'bg-slate-900 rounded-[24px] sm:rounded-[32px] border border-slate-800 shadow-2xl',
                'flex flex-col overflow-hidden',
                maxWidth
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/50 backdrop-blur-sm flex-shrink-0 min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-100 truncate">{title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-shrink-0"
                  aria-label="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 custom-scrollbar">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm flex-shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
