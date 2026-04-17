import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  Mail,
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Loader2,
} from 'lucide-react';
import Modal from './Modal';

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  htmlContent,
  borrowerEmail = '',
  bankEmail: initialBankEmail = '',
  defaultFilename,
  onDownloadPdf,
  onSendEmail,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bankEmail, setBankEmail] = useState(initialBankEmail);
  const documentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setBankEmail(initialBankEmail);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialBankEmail]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (onDownloadPdf && documentRef.current) {
      onDownloadPdf(documentRef.current, defaultFilename || `${documentTitle || 'Document'}.pdf`);
      return;
    }
    alert(`Initiating production download for: ${documentTitle}.pdf`);
  };

  const handleSendEmail = () => {
    if (!onSendEmail) return;
    onSendEmail({
      borrowerEmail,
      bankEmail,
      documentTitle,
      documentType,
    });
  };

  const modalFooter = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] bg-slate-950/50 px-4 py-2 rounded-2xl border border-slate-800/50">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        Verified Audit Stream
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white transition-all font-bold text-xs border border-slate-700 active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        <button 
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold text-xs shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={documentTitle || 'Document Preview'}
      maxWidth="max-w-4xl"
      bodyClassName="bg-slate-950/20 p-4 sm:p-10 no-scrollbar"
    >
      <div className="flex flex-col items-center min-h-0 pb-20">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32 w-full">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin" />
              <FileText className="absolute inset-0 m-auto w-6 h-6 text-blue-500/50" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
              Syncing Secure Node...
            </span>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            {/* The Paper Container */}
            <div 
              ref={documentRef}
              className="bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden w-full relative min-h-0 sm:min-h-[1000px] flex flex-col"
            >
              {/* Decorative Document Edge */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
              
              <div className="p-6 sm:p-16 flex-1 flex flex-col">
                {/* Document Header */}
                <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start border-b-2 border-slate-900 pb-10 sm:pb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-xl">L</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-slate-950 leading-none">CORPORATE LMS</h2>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest mt-1.5 font-sans">Verification Hub</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right font-sans space-y-1.5">
                    <p className="text-xs font-black text-slate-950 uppercase tracking-tighter">System Document v4.1</p>
                    <p className="text-[10px] text-slate-500 font-medium">Financial District, Central 400</p>
                    <p className="text-[10px] font-bold text-blue-700 tracking-tight">secure-verify.lms.io</p>
                  </div>
                </div>

                {/* Audit Meta */}
                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:justify-between font-sans border-b border-slate-100 pb-8 text-[10px]">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="font-black text-slate-400 uppercase tracking-widest">Global Artifact ID</p>
                      <p className="text-xs font-mono font-bold text-slate-950 uppercase tracking-tighter">LMS-SHA256-V84291-ZX</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right space-y-4 sm:ml-auto">
                    <div className="space-y-1">
                      <p className="font-black text-slate-400 uppercase tracking-widest">Generation Timestamp</p>
                      <p className="text-xs font-bold text-slate-950">{new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="mt-12 sm:mt-16 flex-1 flex flex-col">
                  {htmlContent ? (
                    <div
                      className="text-slate-800 leading-relaxed text-sm sm:text-base prose prose-sm sm:prose-base max-w-none"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <div className="space-y-10 flex-1">
                      <div className="space-y-4">
                        <h1 className="text-2xl sm:text-4xl font-display font-black text-slate-950 uppercase tracking-tight leading-tight">
                          {documentTitle}
                        </h1>
                        <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
                      </div>

                      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 text-justify font-serif italic">
                        <p>To Whom It May Concern,</p>
                        <p>
                          This formal communication serves to confirm and authenticate the status of the requested 
                          artifact within the Global Loan Management Ecosystem. The records contained herein have 
                          undergone multi-tier verification and meet the high-fidelity standards for corporate vetting.
                        </p>
                        <p>
                          This document is generated dynamically from the secure database and is electronically signed. 
                          The validity of the information is tied to the state of the core ledger at the exact 
                          timestamp recorded in the document metadata.
                        </p>
                        <p>
                          All data is handled under strict security protocols and remains proprietary information.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Block */}
                <div className="mt-20 sm:mt-32 pt-10 border-t border-slate-950 flex flex-col gap-10 sm:flex-row sm:justify-between sm:items-end">
                  <div className="space-y-8">
                    <div className="font-serif italic text-3xl sm:text-5xl text-slate-200/50 select-none tracking-tight">Authorized Verify</div>
                    <div className="space-y-1.5 font-sans">
                      <p className="text-xs sm:text-sm font-black text-slate-950 uppercase tracking-tight">Executive Compliance Hub</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Digitally Verified Token: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="p-6 border-[6px] border-slate-950/5 rounded-[40px] flex flex-col items-center gap-3 -rotate-12 opacity-40 select-none">
                    <FileText className="w-10 h-10 text-slate-950" />
                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.3em] whitespace-nowrap">Official Archive Copy</span>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-slate-950/[0.03] text-6xl sm:text-[140px] pointer-events-none select-none -rotate-45 z-0 whitespace-nowrap uppercase tracking-tighter">
                  LMS SECURE COPY
                </div>
              </div>
            </div>

            {/* Post-Letter Content (Email Actions) */}
            {htmlContent && onSendEmail && (
              <div className="mt-6 bg-slate-900/50 p-6 sm:p-8 rounded-[32px] border border-slate-800 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Electronic Distribution</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Send a secure copy directly</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2">Borrower Email</p>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-slate-400 font-bold"
                      value={borrowerEmail}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2">Compliance Email</p>
                    <input
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-slate-100 font-bold focus:border-blue-500 transition-all outline-none"
                      value={bankEmail}
                      onChange={(e) => setBankEmail(e.target.value)}
                      placeholder="Enter destination email..."
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={handleSendEmail}
                      className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Sign & Transmit
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Main Action Buttons (scrolled into view) */}
            <div className="mt-12 w-full">
              {modalFooter}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
