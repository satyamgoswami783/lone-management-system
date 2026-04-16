import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  User,
  Briefcase,
  Wallet,
  FileText,
  ShieldCheck,
  AlertCircle,
  Clock
} from 'lucide-react';

import { useLoans, STATUSES } from '../../context/LoanContext';
import { Badge, SectionHeader, Toast } from '../../components/ui/Shared';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';

const AdminApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications, updateStatus } = useLoans();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);

    const stages = [
        STATUSES.SUBMITTED,
        STATUSES.HR_PENDING,
        STATUSES.CREDIT_PENDING,
        STATUSES.ADMIN_APPROVAL,
        STATUSES.APPROVED,
        STATUSES.PAID
    ];

    const application = applications.find(app => app.id === id);

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-300">Application Not Found</h2>
                <button onClick={() => navigate('/admin/applications')} className="mt-4 text-blue-400 hover:underline">
                    Back to Pipeline
                </button>
            </div>
        );
    }

    const nextStage = stages[stages.indexOf(application.status) + 1];
    const prevStage = stages[stages.indexOf(application.status) - 1];

    const handleApprove = () => {
        if (nextStage) {
            setIsLoading(true);
            setTimeout(() => {
                updateStatus(application.id, nextStage, 'System Admin');
                setIsLoading(false);
                setToast({ message: `Successfully advanced to ${nextStage}`, type: 'success' });
            }, 800);
        }
    };

    const handleSendBack = () => {
        if (prevStage) {
            setIsLoading(true);
            setTimeout(() => {
                updateStatus(application.id, prevStage, 'System Admin');
                setIsLoading(false);
                setToast({ message: `Reverted back to ${prevStage}`, type: 'primary' });
            }, 800);
        }
    };

    const handleReject = () => {
        setIsLoading(true);
        setTimeout(() => {
            updateStatus(application.id, STATUSES.REJECTED, 'System Admin');
            setIsLoading(false);
            setToast({ message: 'Application Rejected & Archived', type: 'danger' });
            setTimeout(() => navigate('/admin/applications'), 1500);
        }, 800);
    };

    const steps = stages.map(s => ({ label: s, status: s }));
    const currentStepIndex = stages.indexOf(application.status);
    const isCompleted = application.status === STATUSES.PAID;
    const isRejected = application.status === STATUSES.REJECTED;
    const isProcessed = isCompleted || isRejected;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center gap-6 glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-10 -mt-10"></div>
                <button 
                    onClick={() => navigate('/admin/applications')}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-xl active:scale-95 relative z-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative z-10">
                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                        {application.name}'s Profile
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Ref: {application.id} • {new Date(application.date).toLocaleDateString()}
                        </p>
                        <Badge variant={isCompleted ? 'success' : isRejected ? 'danger' : 'warning'}>
                            {application.status}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left & Middle Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Lifecycle Stepper */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/20">
                        <div className="flex items-center justify-between max-w-2xl mx-auto relative px-4">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
                            {steps.map((step, i) => {
                                const isDone = currentStepIndex > i || isCompleted;
                                const isActive = application.status === step.status;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-3 bg-slate-950 p-2 rounded-2xl relative z-10">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                            isDone ? 'bg-emerald-500 border-emerald-400 text-white' : 
                                            isActive ? 'bg-blue-600 border-blue-400 text-white animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 
                                            'bg-slate-900 border-slate-800 text-slate-600'
                                        }`}>
                                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className={`text-[8px] font-black uppercase tracking-tighter text-center ${
                                                isActive || isDone ? 'text-slate-200' : 'text-slate-600'
                                            }`}>
                                                {step.label.split(' ')[0]}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase tracking-tighter text-center leading-[0.5] ${
                                                isActive || isDone ? 'text-slate-200' : 'text-slate-600'
                                            }`}>
                                                {step.label.split(' ')[1] || ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DetailSection 
                            title="Applicant Profile" 
                            icon={User}
                            items={[
                                { label: 'Full Name', value: application.name },
                                { label: 'ID Number', value: application.idNumber || '920101 5001 081' },
                                { label: 'Contact Email', value: application.email },
                                { label: 'Verified Income', value: `R ${application.salary?.toLocaleString() || '25,000'}` },
                            ]}
                        />
                        <DetailSection 
                            title="Financing Goals" 
                            icon={Wallet}
                            items={[
                                { label: 'Request Amount', value: `R ${application.amount?.toLocaleString()}`, highlight: true },
                                { label: 'Repayment Term', value: '12 Months' },
                                { label: 'Loan Objective', value: application.purpose || 'Education / Skills Development' },
                                { label: 'Employer Group', value: application.company || 'TechFlow SA' },
                            ]}
                        />
                    </div>

                    {/* Documents */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-display font-bold text-white tracking-tight">Digital Vault</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Certified ID', 'Proof of Income', 'Bank Statements'].map((doc) => (
                                <div key={doc} className="p-5 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center gap-3 group hover:border-blue-500/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc}</span>
                                    <button 
                                        onClick={() => setPreviewTarget({ title: `${doc}.pdf` })}
                                        className="w-full py-2.5 bg-slate-900 rounded-xl text-[9px] font-black uppercase hover:bg-slate-800 transition-all tracking-tighter"
                                    >
                                        Inspect File
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-950/50 space-y-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white">Decision Authority</h3>
                        </div>
                        
                        {!isProcessed ? (
                            <div className="space-y-4">
                                <button 
                                    onClick={handleApprove}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95"
                                >
                                    {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    {nextStage === STATUSES.PAID ? 'Finalize & Disburse' : `Move to ${nextStage}`}
                                </button>
                                
                                <button 
                                    onClick={handleReject}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-slate-900 border border-slate-800 hover:bg-red-600/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 disabled:opacity-50 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Reject Request
                                </button>

                                {prevStage && (
                                    <div className="pt-4 border-t border-slate-800/50 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Lifecycle Reversal</p>
                                        <button 
                                            onClick={handleSendBack}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 border-dashed"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Return to {prevStage}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`p-6 rounded-[32px] border flex flex-col items-center text-center gap-4 ${
                                isCompleted ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-red-600/10 border-red-500/30'
                            }`}>
                                {isCompleted ? (
                                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-2 shadow-xl shadow-emerald-500/20">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white mb-2 shadow-xl shadow-red-500/20">
                                        <XCircle className="w-8 h-8" />
                                    </div>
                                )}
                                <div>
                                    <h4 className={`text-xl font-bold ${isCompleted ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isCompleted ? 'Disbursement Finalized' : 'Application Rejected'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed px-4">
                                        {isCompleted 
                                            ? 'This application has successfully passed all verification gates and funds have been allocated.' 
                                            : 'The application request has been formally declined by the administrative office and archived.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Audit Log (Minimal) */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/20">
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Audit Trail</h3>
                        <div className="space-y-6">
                            {(application.auditHistory || []).slice().reverse().map((log, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i < (application.auditHistory || []).length - 1 && (
                                        <div className="absolute left-[7px] top-6 w-0.5 h-10 bg-slate-800"></div>
                                    )}
                                    <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0 mt-1"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-200">{log.status}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                            {log.user} • {new Date(log.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <DocumentPreviewModal 
                isOpen={!!previewTarget} 
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
            />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

const DetailSection = ({ title, icon: Icon, items }) => (
    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40 space-y-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-950 rounded-xl text-blue-400">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col border-l-2 border-slate-800 pl-4 py-1">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className={`text-sm font-bold ${item.highlight ? 'text-blue-400' : 'text-slate-300'}`}>{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default AdminApplicationDetail;
