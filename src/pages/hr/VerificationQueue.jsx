import React, { useState } from 'react';
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    FileText,
    Briefcase,
    TrendingUp,
    AlertCircle,
    AlertTriangle,
    ChevronRight,
    ArrowUpDown,
    FilterX
} from 'lucide-react';
import { useLoans, STATUSES, LIFECYCLE_STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import { StatCard, SectionHeader, Badge, Toast, Modal } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const VerificationQueue = () => {
    const { applications, transitionLoanLifecycle } = useLoans();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter logic
    const queue = (applications || []).filter(app => {
        const name = app.name || '';
        const id = app.id || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL'
            ? app.lifecycleStatus === LIFECYCLE_STATUSES.SUBMITTED
            : app.lifecycleStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getPriority = (amount) => {
        if (amount >= 15000) return { label: 'High', variant: 'danger' };
        if (amount >= 7500) return { label: 'Medium', variant: 'warning' };
        return { label: 'Low', variant: 'primary' };
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case STATUSES.SUBMITTED:
            case STATUSES.HR_PENDING: return 'warning';
            case STATUSES.HR_APPROVED:
            case STATUSES.CREDIT_APPROVED:
            case STATUSES.ADMIN_APPROVED:
            case STATUSES.DISBURSED: return 'success';
            case STATUSES.HR_REJECTED:
            case STATUSES.DECLINED: return 'danger';
            case STATUSES.CREDIT_PENDING:
            case STATUSES.FINAL_REVIEW:
            case STATUSES.ADMIN_PENDING: return 'primary';
            default: return 'neutral';
        }
    };

    const stats = [
        { title: 'Total To Verify', value: queue.length.toString(), icon: Clock, variant: 'warning' },
        { title: 'Rejected Overall', value: (applications || []).filter(a => a.status?.includes('Rejected')).length.toString(), icon: XCircle, variant: 'danger' },
        { title: 'Processing Rate', value: '92%', icon: TrendingUp, variant: 'success' },
    ];

    const handleVerify = (id) => {
        if (window.confirm('Confirm HR Verification Approval?')) {
            setIsLoading(true);
            setTimeout(() => {
                transitionLoanLifecycle(id, LIFECYCLE_ACTIONS.HR_VERIFY, 'HR Manager', 'HR verification approved');
                setIsLoading(false);
                setToast({ message: `Application ${id} approved successfully!`, type: 'success' });
            }, 800);
        }
    };

    const handleRejectClick = (id) => {
        setSelectedAppId(id);
        setShowRejectModal(true);
    };

    const confirmReject = () => {
        setIsLoading(true);
        setTimeout(() => {
            transitionLoanLifecycle(selectedAppId, LIFECYCLE_ACTIONS.HR_REJECT, 'HR Manager', 'Rejected during HR verification');
            setShowRejectModal(false);
            setSelectedAppId(null);
            setIsLoading(false);
            setToast({ message: `Application ${selectedAppId} has been rejected.`, type: 'danger' });
        }, 800);
    };

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                <SectionHeader
                    title="Application Verification"
                    description="Finalize employee eligibility and salary confirmation for pending loan requests."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>

                <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-xl">
                    <div className="p-6 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/10">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    className="input-field pl-10 py-2.5 text-sm w-full"
                                    placeholder="Search by name or APP ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-500 ml-2" />
                                <select
                                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Active</option>
                                    <option value={LIFECYCLE_STATUSES.SUBMITTED}>Submitted</option>
                                </select>
                            </div>
                        </div>
                        {(statusFilter !== 'ALL' || searchTerm) && (
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-all underline underline-offset-4"
                            >
                                <FilterX className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-20 px-6 md:p-32 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-medium animate-pulse text-[10px] font-black uppercase tracking-widest text-center">Processing update...</p>
                        </div>
                    ) : queue.length === 0 ? (
                        <div className="py-20 px-6 md:p-32 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-slate-800 border border-slate-800/50 shadow-inner">
                                <FilterX className="w-10 h-10" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-display font-bold text-slate-300">No matching applications</h3>
                                <p className="text-slate-500 max-w-[280px] mx-auto text-xs leading-relaxed">We couldn't find any results for your current search or filter. Try a different term or clear filters.</p>
                            </div>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                                className="px-8 py-3 bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                            >
                                Reset Results
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Applicant</th>
                                        <th className="px-8 py-5">Priority</th>
                                        <th className="px-8 py-5 text-center">Reference</th>
                                        <th className="px-8 py-5">Requested</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {queue.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-800/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/10 flex items-center justify-center font-bold text-blue-400 text-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {(app.name || 'U')[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200 text-base">{app.name || 'Anonymous'}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{app.company}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant={getPriority(app.amount).variant} className="px-3 py-1">
                                                    {getPriority(app.amount).label}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                                                    {app.id}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-200">R {app.amount?.toLocaleString()}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant={getStatusVariant(app.status)} className="px-4 py-1.5 shadow-lg shadow-black/20">
                                                    {app.status || 'Unknown'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={() => handleVerify(app.id)}
                                                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl lg:rounded-2xl bg-emerald-600/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg active:scale-95"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectClick(app.id)}
                                                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl lg:rounded-2xl bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/hr/verifications/${app.id}`)}
                                                        className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl lg:rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Rejection Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Priority Rejection"
                maxWidth="max-w-md"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="flex-1 py-4 bg-slate-800 rounded-2xl text-sm font-bold text-slate-400 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmReject}
                            className="flex-1 py-4 bg-red-600 rounded-2xl text-sm font-bold text-white hover:bg-red-500 transition-all font-display shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-red-400">
                        <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Application: {selectedAppId}</p>
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-inner">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            You are about to decline this verification request. This action will notify the Employee and stop further processing.
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Note: For detailed reasons, use the full verification page.</p>
                    </div>
                </div>
            </Modal>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
    );
};

export default VerificationQueue;
