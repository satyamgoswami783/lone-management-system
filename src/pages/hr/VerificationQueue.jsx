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
import { useLoans, STATUSES } from '../../context/LoanContext';
import { StatCard, SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const VerificationQueue = () => {
    const { applications, updateStatus } = useLoans();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter logic
    const queue = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL'
            ? (app.status === STATUSES.HR_PENDING || app.status === STATUSES.SUBMITTED)
            : app.status === statusFilter;
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
        { title: 'Rejected Overall', value: applications.filter(a => a.status.includes('Rejected')).length.toString(), icon: XCircle, variant: 'danger' },
        { title: 'Processing Rate', value: '92%', icon: TrendingUp, variant: 'success' },
    ];

    const handleVerify = (id) => {
        if (window.confirm('Confirm HR Verification Approval?')) {
            setIsLoading(true);
            setTimeout(() => {
                updateStatus(id, STATUSES.HR_APPROVED, 'HR Manager');
                setTimeout(() => updateStatus(id, STATUSES.CREDIT_PENDING, 'System'), 500);
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
            updateStatus(selectedAppId, STATUSES.HR_REJECTED, 'HR Manager');
            setShowRejectModal(false);
            setSelectedAppId(null);
            setIsLoading(false);
            setToast({ message: `Application ${selectedAppId} has been rejected.`, type: 'danger' });
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Application Verification"
                description="Finalize employee eligibility and salary confirmation for pending loan requests."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50">
                <div className="p-6 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/20">
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
                                <option value={STATUSES.SUBMITTED}>Submitted</option>
                                <option value={STATUSES.HR_PENDING}>HR Pending</option>
                            </select>
                        </div>
                    </div>
                    {statusFilter !== 'ALL' || searchTerm && (
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-all"
                        >
                            <FilterX className="w-4 h-4" />
                            Clear Filters
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="p-32 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium animate-pulse">Processing update...</p>
                    </div>
                ) : queue.length === 0 ? (
                    <div className="p-32 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center text-slate-800 border border-slate-800/50">
                            <FilterX className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-bold text-slate-400">No results found</h3>
                            <p className="text-slate-600 max-w-xs mx-auto text-sm">We couldn't find any applications matching your criteria. Try adjusting your search or filters.</p>
                        </div>
                        <button
                            onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                            className="px-6 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
                        >
                            Reset Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 border-b border-slate-800/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Reference</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Requested</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {queue.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/10 flex items-center justify-center font-bold text-blue-400 text-lg">
                                                    {app.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200 text-base">{app.name}</p>
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
                                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{new Date(app.date).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant={getStatusVariant(app.status)} className="px-4 py-1.5 shadow-lg shadow-black/20">
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleVerify(app.id)}
                                                    className="px-4 py-2.5 rounded-2xl bg-emerald-600/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-600/5 active:scale-95"
                                                    title="Quick Approve"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectClick(app.id)}
                                                    className="px-4 py-2.5 rounded-2xl bg-red-600/10 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                                    title="Quick Reject"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/hr/verifications/${app.id}`)}
                                                    className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-2xl transition-all shadow-xl active:scale-95"
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

            {/* Quick Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="glass w-full max-w-md p-8 rounded-[40px] border-slate-800 space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 text-red-400">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold">Priority Rejection</h2>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Application: {selectedAppId}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                            <p className="text-slate-300 text-sm leading-relaxed">
                                You are about to decline this verification request. This action will notify the Employee and stop further processing.
                            </p>
                            <p className="text-xs text-slate-500 font-medium">To provide a specific reason like absenteeism or discipline, please go to the detailed verification page.</p>
                        </div>

                        <div className="flex gap-4">
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
                    </div>
                </div>
            )}

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default VerificationQueue;
