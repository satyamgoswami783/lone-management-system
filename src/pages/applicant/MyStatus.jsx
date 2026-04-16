import React from 'react';
import { Clock, CheckCircle2, AlertCircle, FileText, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const MyStatus = () => {
    const { applications } = useLoans();
    const navigate = useNavigate();
    const latestApp = applications[0]; // For demo, show the latest

    const steps = [
        { key: 'SUBMITTED', label: 'Application Submitted', icon: FileText, status: STATUSES.SUBMITTED },
        { key: 'HR', label: 'Employer Verification', icon: Clock, status: STATUSES.HR_APPROVED },
        { key: 'CREDIT', label: 'Credit Assessment', icon: ShieldCheck, status: STATUSES.CREDIT_APPROVED },
        { key: 'ADMIN', label: 'Final Approval', icon: CheckCircle2, status: STATUSES.ADMIN_APPROVED },
        { key: 'PAID', label: 'Funds Disbursed', icon: CreditCard, status: STATUSES.DISBURSED },
    ];

    const getStepStatus = (stepStatus) => {
        if (!latestApp) return 'pending';
        const statusOrder = [
            STATUSES.SUBMITTED, 
            STATUSES.HR_PENDING, STATUSES.HR_APPROVED, 
            STATUSES.CREDIT_PENDING, STATUSES.CREDIT_APPROVED, 
            STATUSES.ADMIN_PENDING, STATUSES.ADMIN_APPROVED, 
            STATUSES.DISBURSED
        ];
        
        const currentIndex = statusOrder.indexOf(latestApp.status);
        const stepIndex = statusOrder.indexOf(stepStatus);

        if (latestApp.status === STATUSES.DECLINED || latestApp.status === STATUSES.HR_REJECTED) return 'failed';
        if (currentIndex >= stepIndex) return 'completed';
        if (currentIndex + 1 === stepIndex || currentIndex + 2 === stepIndex) return 'current';
        return 'pending';
    };

    if (!latestApp) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <FileText className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display font-bold">No Active Applications</h2>
                <p className="text-slate-500">You haven't applied for a loan yet.</p>
                <button className="btn-primary px-8 mt-4">Apply Now</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader 
                title="Application Status" 
                description="Track the progress of your loan application in real-time."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Timeline */}
                <div className="lg:col-span-2 glass p-8 rounded-[40px] space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold">Tracking Timeline</h2>
                        <Badge variant={latestApp.status === STATUSES.DISBURSED ? 'success' : 'primary'}>
                            {latestApp.status}
                        </Badge>
                    </div>

                    <div className="relative space-y-8">
                        {/* Vertical Line */}
                        <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

                        {steps.map((step, i) => {
                            const stepStatus = getStepStatus(step.status);
                            return (
                                <div key={i} className="relative flex items-center gap-6 group">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                                        stepStatus === 'completed' ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                                        stepStatus === 'current' ? "bg-blue-600 text-white animate-pulse" :
                                        stepStatus === 'failed' ? "bg-red-500 text-white" :
                                        "bg-slate-900 border border-slate-800 text-slate-600"
                                    )}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={cn(
                                            "font-display font-bold text-lg",
                                            stepStatus === 'completed' ? "text-slate-200" :
                                            stepStatus === 'current' ? "text-blue-400" :
                                            "text-slate-500"
                                        )}>
                                            {step.label}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {stepStatus === 'completed' ? 'Successfully processed' :
                                             stepStatus === 'current' ? 'Under review by our team' :
                                             'Awaiting previous steps'}
                                        </p>
                                    </div>
                                    {stepStatus === 'completed' && (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-[40px] bg-blue-600/5 border-blue-500/10 space-y-6">
                        <h3 className="text-lg font-display font-bold">Summary</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-500">Loan ID</span>
                                <span className="font-mono text-blue-400 font-bold">{latestApp.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-500">Requested Amount</span>
                                <span className="text-lg font-bold">R {latestApp.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/50">
                                <span className="text-slate-500">Submitted On</span>
                                <span className="text-slate-300">{new Date(latestApp.date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-4 items-start">
                            <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Our standard processing time is 2-3 business days. You will receive an email notification once your status changes.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate(`/applicant/application/${latestApp.id}`)}
                        className="w-full glass p-6 rounded-[32px] hover:bg-slate-800/50 transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-900 rounded-2xl text-slate-400 group-hover:text-blue-400 transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold">View Full Application</p>
                                <p className="text-xs text-slate-500 tracking-tight">Inspect all submitted details</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyStatus;
