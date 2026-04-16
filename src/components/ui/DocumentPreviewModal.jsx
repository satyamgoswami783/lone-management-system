import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DocumentPreviewModal = ({ isOpen, onClose, documentTitle, documentType }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Simulation: In a real app, this would be a blob download or a signed URL
    alert(`Downloading: ${documentTitle}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-full bg-slate-900 rounded-[40px] border border-slate-800 shadow-[0_0_100px_rgba(37,99,235,0.15)] flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-slate-800 flex-shrink-0 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <button 
               onClick={onClose}
               className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-700"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
               <h3 className="text-xl font-display font-bold text-slate-100">{documentTitle}</h3>
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{documentType || 'Official Document'}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={handlePrint}
               className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all font-bold text-sm border border-slate-700"
             >
               <Printer className="w-4 h-4" />
               Print
             </button>
             <button 
               onClick={handleDownload}
               className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold text-sm shadow-lg shadow-blue-600/20"
             >
               <Download className="w-4 h-4" />
               Download
             </button>
             <button 
               onClick={onClose}
               className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-red-500/10 transition-all"
             >
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Modal Content / Preview Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-950/50 custom-scrollbar">
          <div className="max-w-3xl mx-auto bg-white min-h-[1000px] shadow-2xl rounded-sm p-16 space-y-12 text-slate-900 font-serif relative">
             {/* Realistic Letterhead Simulation */}
             <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8">
                 <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">L</div>
                 <div className="text-right space-y-1 not-italic font-sans">
                     <p className="text-lg font-black tracking-tighter">LOAN MANAGEMENT SYSTEM</p>
                     <p className="text-xs text-slate-500">123 Financial District, Suite 400</p>
                     <p className="text-xs text-slate-500">Johannesburg, South Africa</p>
                     <p className="text-xs font-bold text-blue-600">www.antigravity-lms.co.za</p>
                 </div>
             </div>

             <div className="space-y-6 font-sans">
                 <div className="flex justify-between">
                     <div className="space-y-1">
                         <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Date Issued</p>
                         <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                     </div>
                     <div className="text-right space-y-1">
                         <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Document ID</p>
                         <p className="text-sm font-mono font-bold">LMS-DOC-{Math.floor(100000 + Math.random() * 900000)}</p>
                     </div>
                 </div>
             </div>

             <div className="space-y-12 py-10">
                 <h2 className="text-4xl font-display font-black text-slate-900 text-center uppercase tracking-tight italic">
                    {documentTitle}
                 </h2>
                 
                 <div className="space-y-6 text-lg leading-relaxed text-slate-700">
                     <p>To Whom It May Concern,</p>
                     <p>
                        This serves to confirm that the individual mentioned in our records has successfully satisfied the requirements
                        set forth by the Loan Management System (LMS) regarding the specified financial agreement.
                     </p>
                     <p>
                        All internal assessments and compliance checks have been verified, and the status of this document 
                        is considered <strong>FINAL AND BINDING</strong>.
                     </p>
                     <p className="pt-10">
                        For any further inquiries, please contact our administrative desk at +27 (0) 11 987 6543 during normal business hours.
                     </p>
                 </div>
             </div>

             <div className="pt-24 flex justify-between items-end border-t border-slate-200">
                 <div className="space-y-4">
                     <div className="w-48 h-1 bg-slate-900"></div>
                     <div className="space-y-0.5 font-sans">
                        <p className="text-sm font-bold">Head of Compliance</p>
                        <p className="text-xs text-slate-500 italic font-serif pointer-events-none select-none">Digitally Signed via Antigravity Cloud</p>
                     </div>
                 </div>
                 <div className="p-4 border-2 border-slate-900 rounded-xl font-sans font-black text-slate-900 rotate-[-15deg] opacity-20 pointer-events-none select-none">
                     CERTIFIED OFFICIAL
                 </div>
             </div>
             
             {/* Security Watermark */}
             <div className="absolute inset-0 flex items-center justify-center font-black text-slate-100/10 text-[10vw] pointer-events-none select-none -rotate-45 z-0">
                LMS OFFICIAL
             </div>
          </div>
        </div>

        {/* Modal Footer (Optional Extra Actions) */}
        <div className="h-16 px-8 border-t border-slate-800 bg-slate-900 flex items-center justify-center flex-shrink-0">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                <Share2 className="w-3 h-3" />
                This document is encrypted and digitally signed for your security
            </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
