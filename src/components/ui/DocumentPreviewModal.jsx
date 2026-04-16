import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ArrowLeft,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DocumentPreviewModal = ({ isOpen, onClose, documentTitle, documentType }) => {
  const [zoom, setZoom] = useState(0.75);
  const [isLoading, setIsLoading] = useState(true);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      // Simulate loading
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => {
        document.body.classList.remove('no-scroll');
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would use a library like jspdf or trigger a direct file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${documentTitle || 'Document'}.pdf`;
    document.body.appendChild(link);
    alert(`Initiating production download for: ${documentTitle}.pdf`);
    document.body.removeChild(link);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative flex-1 flex flex-col h-full w-full z-10 overflow-hidden">
        
        {/* Production Toolbar */}
        <header className="no-print h-16 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-800 mx-2" />
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-100 leading-none">{documentTitle}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {documentType || 'Official Record'} • PDF Format
              </p>
            </div>
          </div>

          {/* Document Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
            <button 
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="px-3 text-[10px] font-black text-slate-500 w-12 text-center uppercase">
              {Math.round(zoom * 100)}%
            </div>
            <button 
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button 
              onClick={handleResetZoom}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all font-bold text-xs border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold text-xs shadow-lg shadow-blue-600/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <div className="h-6 w-px bg-slate-800 mx-2" />
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Document Area */}
        <main className="flex-1 overflow-auto bg-slate-900/20 p-8 md:p-12 custom-scrollbar flex flex-col items-center">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] animate-pulse">Initializing Secure Stream...</span>
            </div>
          ) : (
            <div 
              id="print-area"
              className="transition-transform duration-200 origin-top shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[20mm] font-serif relative">
                {/* Official Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">L</div>
                    <div className="font-sans">
                      <p className="text-xl font-black tracking-tighter text-slate-900 leading-none">CORPORATE LMS</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Requirement Based Verification</p>
                    </div>
                  </div>
                  <div className="text-right font-sans space-y-1">
                    <p className="text-xs font-bold">Document v4.0.2</p>
                    <p className="text-[10px] text-slate-500">123 Financial District, Suite 400</p>
                    <p className="text-[10px] text-slate-500">Johannesburg, Gauteng</p>
                    <p className="text-[10px] font-bold text-blue-600">secure.lms-portal.com</p>
                  </div>
                </div>

                {/* Sub-Header / Ref Info */}
                <div className="mt-12 flex justify-between font-sans border-b border-slate-100 pb-8">
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Employee Ref</p>
                      <p className="text-sm font-bold">Sarah Jenkins-920101</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Company Group</p>
                      <p className="text-sm font-bold text-blue-600">TechFlow SA (Pty) Ltd</p>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Internal ID</p>
                      <p className="text-sm font-mono font-bold uppercase">LMS-SEC-X84291</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Timestamp</p>
                      <p className="text-sm font-bold">{new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="mt-12 space-y-8">
                  <h1 className="text-3xl font-display font-black text-slate-950 uppercase tracking-tight text-center leading-tight">
                    {documentTitle}
                  </h1>
                  
                  <div className="space-y-6 text-base leading-[1.6] text-slate-800 text-justify">
                    <p>Dear Stakeholder,</p>
                    <p>
                      This official communication serves to confirm the status of the requested documentation within the Corporate Loan Management 
                      System. The underlying records have been vetted against our core compliance framework and meet the necessary 
                      standards for verification.
                    </p>
                    <p>
                      Please be advised that this document contains proprietary data protected by the POPIA (Protection of Personal Information Act). 
                      Any unauthorized reproduction or redistribution of this record is strictly prohibited and may result in legal action 
                      against the offending parties.
                    </p>
                    <p>
                      The accuracy of the information provided is based on the data submitted by the Employee and verified by our 
                      automated risk engine and credit committee.
                    </p>
                    <p className="pt-4">
                      For any further authentication, please scan the QR code (if applicable) or contact our 24/7 verification 
                      support line at <span className="underline">+27 11 000 0000</span>.
                    </p>
                  </div>
                </div>


                {/* Footer Signature */}
                <div className="mt-24 pt-12 border-t border-slate-900 flex justify-between items-end">
                  <div className="space-y-6">
                    <div className="italic text-2xl font-serif text-slate-400 select-none opacity-50">Authorized Signatory</div>
                    <div className="space-y-1 font-sans">
                      <p className="text-sm font-black text-slate-900 uppercase">Director of Compliance</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Digitally Signed via SecureRoot Engine</p>
                    </div>
                  </div>
                  <div className="p-6 border-4 border-slate-900/10 rounded-3xl flex flex-col items-center gap-2 -rotate-12 opacity-30 select-none">
                    <FileText className="w-8 h-8 text-slate-900" />
                    <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Official Audit Copy</span>
                  </div>
                </div>

                {/* Diagonal Watermark */}
                <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900/5 text-[120px] pointer-events-none select-none -rotate-45 z-0">
                  LMS SECURE
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Global Modal Info Footer */}
        {!isLoading && (
          <footer className="no-print h-12 w-full bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6 z-20">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Secure 256-bit Encrypted View
            </div>
            <div className="w-px h-3 bg-slate-800" />
            <div className="text-[10px] text-slate-600 font-medium">Page 1 of 1 • System Generated</div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
