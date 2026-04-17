import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Modal from './Modal';

const DocumentPreviewModal = ({ isOpen, onClose, documentTitle, documentType }) => {
  const [zoom, setZoom] = useState(0.75);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert(`Initiating production download for: ${documentTitle}.pdf`);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(0.75);

  const modalFooter = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
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

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button 
          onClick={handlePrint}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all font-bold text-xs border border-slate-700"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
        <button 
          onClick={handleDownload}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all font-bold text-xs shadow-lg shadow-blue-600/20"
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
      footer={modalFooter}
      maxWidth="max-w-5xl"
    >
      <div className="flex flex-col items-center min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
              Initializing Secure Stream...
            </span>
          </div>
        ) : (
          <div 
            className="transition-transform duration-200 origin-top shadow-2xl bg-white border border-slate-200 overflow-hidden"
            style={{ transform: `scale(${zoom})`, marginBottom: `${(zoom - 1) * 300}px` }}
          >
            <div className="w-[210mm] min-h-[297mm] p-[20mm] font-serif relative text-slate-900 bg-white">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-12">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">L</div>
                  <div className="font-sans">
                    <p className="text-xl font-black tracking-tighter text-slate-900 leading-none">CORPORATE LMS</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Verification Records</p>
                  </div>
                </div>
                <div className="text-right font-sans space-y-1">
                  <p className="text-xs font-bold">Document v4.0.2</p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-tight">Financial District, Suite 400</p>
                  <p className="text-[10px] font-bold text-blue-600">secure.lms-portal.com</p>
                </div>
              </div>

              {/* Document Metadata */}
              <div className="mt-12 flex justify-between font-sans border-b border-slate-100 pb-8">
                <div className="space-y-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Internal ID</p>
                    <p className="text-sm font-mono font-bold uppercase">LMS-SEC-X84291</p>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Timestamp</p>
                    <p className="text-sm font-bold">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Document Content */}
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
                    Any unauthorized reproduction or redistribution of this record is strictly prohibited.
                  </p>
                  <p>
                    The accuracy of the information provided is based on the data submitted by the Employee and verified by our 
                    automated risk engine and credit committee.
                  </p>
                </div>
              </div>

              {/* Signature Area */}
              <div className="mt-24 pt-12 border-t border-slate-900 flex justify-between items-end">
                <div className="space-y-6">
                  <div className="italic text-2xl font-serif text-slate-300 select-none opacity-50">Authorized Signatory</div>
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

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900/5 text-[120px] pointer-events-none select-none -rotate-45 z-0">
                LMS SECURE
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4 py-4 border-t border-slate-800/50">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Secure 256-bit Encrypted View
        </div>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
