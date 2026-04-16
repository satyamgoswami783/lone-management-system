import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Wallet, 
  ShieldQuestion, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Badge, Toast } from '../ui/Shared';
import { STATUSES } from '../../context/LoanContext';
import DocumentPreviewModal from '../ui/DocumentPreviewModal';

const VerificationDetailsView = ({ application, onApprove, onReject, isLoading }) => {
  const [previewTarget, setPreviewTarget] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-[40px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 shadow-inner">
          <AlertCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-slate-300">No Active Loan Request</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            This employee does not have any pending loan applications that require HR verification at this time.
          </p>
        </div>
      </div>
    );
  }

  const isProcessed = application.status === STATUSES.HR_APPROVED || 
                     application.status === STATUSES.HR_REJECTED || 
                     application.status === STATUSES.CREDIT_PENDING;

  const handleApprove = () => {
    onApprove();
    setShowApproveModal(false);
  };

  const handleReject = () => {
    const finalReason = rejectReason === 'Other' ? otherReason : rejectReason;
    if (!finalReason) return;
    onReject(finalReason);
    setShowRejectModal(false);
  };

  const rejectionReasons = [
    'Discipline issue',
    'Absenteeism',
    'Final warning',
    'Incomplete employment history',
    'Other'
  ];

  const steps = [
    { label: 'Submitted', active: true, done: true },
    { 
        label: 'HR Verified', 
        active: application.status === STATUSES.HR_APPROVED || application.status === STATUSES.CREDIT_PENDING, 
        done: application.status === STATUSES.HR_APPROVED || application.status === STATUSES.CREDIT_PENDING 
    },
    { 
        label: 'Credit Assessment', 
        active: application.status === STATUSES.CREDIT_PENDING, 
        done: false 
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Status Flow Stepper */}
      <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/20">
        <div className="flex items-center justify-between max-w-4xl mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 bg-slate-950 p-2 rounded-2xl relative z-10 transition-all duration-500">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step.done ? 'bg-emerald-500 border-emerald-400 text-white' : 
                step.active ? 'bg-blue-600 border-blue-400 text-white animate-pulse' : 
                'bg-slate-900 border-slate-800 text-slate-600'
              }`}>
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                step.active || step.done ? 'text-slate-200' : 'text-slate-600'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Panel: Personal & Employment */}
        <div className="space-y-8">
          <DetailCard 
            title="Applicant Identity" 
            icon={User}
            items={[
              { label: 'Full Legal Name', value: application.name },
              { label: 'National ID / Passport', value: application.idNumber || '920101 5001 081' },
              { label: 'Contact Phone', value: '+27 82 123 4567' },
              { label: 'Email Address', value: application.email },
            ]}
          />
          <DetailCard 
            title="Employment Context" 
            icon={Briefcase}
            items={[
              { label: 'Current Employer', value: application.company || 'TechFlow SA' },
              { label: 'Designation', value: 'Senior Associate' },
              { label: 'Monthly Gross Salary', value: `R ${application.salary?.toLocaleString() || '0'}` },
              { label: 'Employment Status', value: 'Permanent / Full-Time', variant: 'success' },
            ]}
          />

          {/* Documents Section */}
          <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-6 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl text-blue-400 shadow-lg">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Document Repository</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Payslip', type: 'payslip' },
                { name: 'ID Document', type: 'id_copy' },
                { name: 'Bank Statement', type: 'bank_statement' }
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-200">{doc.name}</p>
                      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">PDF • Verified Integrity</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreviewTarget({ title: `${doc.name}.pdf`, type: doc.type })}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Loan & NCA */}
        <div className="space-y-8">
          <DetailCard 
            title="Loan Financials" 
            icon={Wallet}
            variant="blue"
            items={[
              { label: 'Requested Principal', value: `R ${application.amount?.toLocaleString()}`, highlight: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
              { label: 'Agreed Repayment Term', value: '12 Months' },
              { label: 'Collection Method', value: 'Payroll Deduction / Stop Order' },
            ]}
          />

          <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-8 bg-slate-900/60 transition-all border-l-4 border-l-orange-500/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-xl text-orange-400">
                  <ShieldQuestion className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-100">NCA Mandatory Check</h3>
              </div>
              <Badge variant="warning">Regulatory</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { question: 'Under Administration?', value: application.nca?.isUnderAdministration ? 'Yes' : 'No', type: application.nca?.isUnderAdministration ? 'danger' : 'success' },
                { question: 'Under Debt Review?', value: application.nca?.isUnderDebtReview ? 'Yes' : 'No', type: application.nca?.isUnderDebtReview ? 'danger' : 'success' },
                { question: 'Emergency Loan?', value: application.nca?.isEmergencyLoan ? 'Yes' : 'No', type: 'primary' },
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-[20px] hover:border-slate-700 transition-all">
                  <span className="text-sm font-bold text-slate-400 tracking-tight">{q.question}</span>
                  <Badge variant={q.type} className="px-4 py-1">{q.value}</Badge>
                </div>
              ))}
              <div className="p-6 bg-slate-950/80 border border-slate-800/50 rounded-[32px] space-y-3">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Purpose of Credit:</span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed italic border-l-2 border-slate-800 pl-4">
                  "{application.nca?.loanPurpose || application.purpose || 'Not Specified'}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading || isProcessed}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-5 bg-red-600/10 border border-red-500/20 rounded-3xl text-red-500 hover:bg-red-600 hover:text-white font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <XCircle className="w-5 h-5" />
              Reject Verification
            </button>
            <button 
              onClick={() => setShowApproveModal(true)}
              disabled={isLoading || isProcessed}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-5 bg-emerald-600 rounded-3xl text-white font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve Verification
            </button>
          </div>
          
          {isProcessed && (
              <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl text-center space-y-2 animate-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-slate-400">Application has already been processed</p>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Final Status: {application.status}</p>
              </div>
          )}
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg p-10 rounded-[48px] border-slate-800 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-5 text-emerald-500">
              <div className="w-14 h-14 rounded-3xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-display font-bold text-white">Confirm Approval</h2>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-widest font-mono">APP ID: {application.id}</p>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <p className="text-slate-300 text-sm leading-relaxed">
                    Are you sure you want to approve this verification? This action will move the application to the <strong>Credit Assessment</strong> stage.
                </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowApproveModal(false)}
                className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black text-slate-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 py-4 bg-emerald-600 rounded-2xl text-xs font-black text-white hover:bg-emerald-500 transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-emerald-600/40 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                {isLoading ? 'Processing...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass w-full max-w-xl p-10 rounded-[48px] border-slate-800 space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-5 text-red-500">
              <div className="w-14 h-14 rounded-3xl bg-red-600/10 flex items-center justify-center border border-red-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-display font-bold">Declare Rejection</h2>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-widest font-mono">APP ID: {application.id}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {rejectionReasons.map((reason) => (
                  <button 
                    key={reason}
                    onClick={() => setRejectReason(reason)}
                    className={`text-left px-6 py-4 rounded-3xl border transition-all text-sm font-bold flex items-center justify-between ${
                      rejectReason === reason 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-inner' 
                      : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {reason}
                    {rejectReason === reason && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>}
                  </button>
                ))}
              </div>

              {rejectReason === 'Other' && (
                <textarea 
                  className="input-field w-full h-32 p-6 text-sm bg-slate-950 border-slate-800 focus:border-red-500/50 transition-all rounded-[32px] placeholder:text-slate-700 mt-2"
                  placeholder="Provide audit-trail justification..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black text-slate-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest"
              >
                Back
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason || (rejectReason === 'Other' && !otherReason) || isLoading}
                className="flex-1 py-4 bg-red-600 rounded-2xl text-xs font-black text-white hover:bg-red-500 transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-red-600/40 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                {isLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DocumentPreviewModal 
        isOpen={!!previewTarget} 
        onClose={() => setPreviewTarget(null)}
        documentTitle={previewTarget?.title}
        documentType={previewTarget?.type}
      />
    </div>
  );
};

const DetailCard = ({ title, icon: Icon, items, variant = 'slate' }) => {
  const iconColors = {
    slate: 'bg-slate-950/80 text-blue-400',
    blue: 'bg-blue-600/20 text-blue-400 shadow-blue-500/20 shadow-inner'
  };

  return (
    <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-6 hover:border-slate-700/50 transition-all bg-slate-900/40 group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
      <div className="flex items-center gap-3 relative z-10">
         <div className={`p-2 rounded-xl border border-slate-800/50 ${iconColors[variant]}`}>
            <Icon className="w-5 h-5" />
         </div>
         <h3 className="text-xl font-display font-bold text-slate-100">{title}</h3>
      </div>
      <div className="space-y-5 relative z-10">
        {items.map((item, i) => (
          <div key={i} className={`space-y-1.5 border-l-2 border-slate-800 pl-6 py-1 group-hover:border-blue-500/50 transition-all ${item.highlight || ''}`}>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">{item.label}</p>
            <p className={`text-base font-bold transition-all ${item.variant === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationDetailsView;
