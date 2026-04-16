import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  AlertCircle, 
  Clock,
  ArrowUpDown,
  UserCheck,
  FileSearch,
  Filter,
  Users,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  MessageSquare,
  XCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const CreditQueue = () => {
    const { applications, assignApplication, updateStatus } = useLoans();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Filter & Sort States
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState(location.state?.risk || 'All');
    const [statusFilter, setStatusFilter] = useState(location.state?.status || 'All');
    const [scoreRange, setScoreRange] = useState('All');
    const [assignedToMe, setAssignedToMe] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [toast, setToast] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);

    // Filtered and Sorted Applications
    const filteredApps = useMemo(() => {
        return applications
            .filter(app => {
                const name = app.name || `No Name (ID: ${app.id})`;
                const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                                     app.id?.toLowerCase().includes(search.toLowerCase()) ||
                                     app.company?.toLowerCase().includes(search.toLowerCase());
                
                const matchesRisk = riskFilter === 'All' || app.risk === riskFilter;
                const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
                
                let matchesScore = true;
                if (scoreRange === 'High') matchesScore = (app.score || 0) >= 700;
                if (scoreRange === 'Medium') matchesScore = (app.score || 0) >= 500 && (app.score || 0) < 700;
                if (scoreRange === 'Low') matchesScore = (app.score || 0) < 500;

                const matchesAssigned = !assignedToMe || app.assignedTo === 'Credit Officer';
                
                const relevantStatuses = [
                    STATUSES.NEW,
                    STATUSES.CREDIT_PENDING, 
                    STATUSES.HR_APPROVED,
                    STATUSES.UNDER_REVIEW, 
                    STATUSES.ON_HOLD,
                    STATUSES.NEED_MORE_INFO
                ];
                
                return matchesSearch && matchesRisk && matchesStatus && matchesScore && matchesAssigned && relevantStatuses.includes(app.status);
            })
            .sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];
                
                if (sortBy === 'amount') {
                    valA = a.amount || 0;
                    valB = b.amount || 0;
                } else if (sortBy === 'score') {
                    valA = a.score || 0;
                    valB = b.score || 0;
                }
                
                if (sortOrder === 'asc') return valA > valB ? 1 : -1;
                return valA < valB ? 1 : -1;
            });
    }, [applications, search, riskFilter, statusFilter, scoreRange, assignedToMe, sortBy, sortOrder]);

    const stats = [
        { 
            title: 'In Queue', 
            value: applications.filter(a => [STATUSES.NEW, STATUSES.CREDIT_PENDING, STATUSES.HR_APPROVED].includes(a.status)).length.toString(), 
            icon: ShieldCheck, 
            variant: 'primary' 
        },
        { 
            title: 'High Risk', 
            value: applications.filter(a => a.risk === 'High' && a.status !== STATUSES.APPROVED).length.toString(), 
            icon: AlertCircle, 
            variant: 'danger' 
        },
        { 
            title: 'My Assignments', 
            value: applications.filter(a => a.assignedTo === 'Credit Officer' && a.status !== STATUSES.APPROVED).length.toString(), 
            icon: Users, 
            variant: 'success' 
        },
    ];

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleAssign = (id) => {
        assignApplication(id, 'Credit Officer');
        setToast({ message: 'Application assigned to you and moved to REVIEW', type: 'info' });
    };

    const handleApprove = (id) => {
        // Logic for recommending approval
        updateStatus(id, STATUSES.ADMIN_APPROVAL, 'Credit Officer', 'Recommended for final admin approval after credit review.');
        setToast({ message: 'Sent for Admin Approval', type: 'success' });
        setSelectedApp(null);
    };

    const handleDecline = (id) => {
        updateStatus(id, STATUSES.DECLINED, 'Credit Officer', 'Declined due to risk assessment factors.');
        setToast({ message: 'Application Declined', type: 'danger' });
        setSelectedApp(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <SectionHeader 
                title="Credit Assessment Pipeline" 
                description="Manage risk analysis and decision workflows across the verification cycle."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List/Table View */}
                <div className={selectedApp ? "xl:col-span-1" : "xl:col-span-3"}>
                    <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-xl">
                        {/* Controls Header */}
                        <div className="p-6 border-b border-slate-800/50 space-y-4 bg-slate-900/10">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1-2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input-field pl-12 py-3 text-sm" 
                                    placeholder="Search by Name, ID, or Company..." 
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2 p-1 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <span className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Filter className="w-3 h-3 inline mr-1" /> Risk</span>
                                    {['All', 'Low', 'Medium', 'High'].map(r => (
                                        <button 
                                            key={r}
                                            onClick={() => setRiskFilter(r)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                riskFilter === r ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => setAssignedToMe(!assignedToMe)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        assignedToMe ? "bg-blue-600 text-white shadow-lg" : "bg-slate-950/50 border border-slate-800 text-slate-500"
                                    }`}
                                >
                                    <UserCheck className="w-3 h-3" />
                                    Assigned
                                </button>
                            </div>
                        </div>

                        {selectedApp ? (
                            /* Condensed List View when Sidebar is open */
                            <div className="divide-y divide-slate-800/50 overflow-y-auto max-h-[600px]">
                                {filteredApps.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className={`w-full p-6 text-left hover:bg-slate-800/30 transition-all flex items-center justify-between group ${selectedApp?.id === app.id ? 'bg-blue-600/10 border-l-4 border-blue-600' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 group-hover:scale-110 transition-transform">
                                                {(app.name || 'A')[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-100">{app.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono tracking-widest">{app.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-200">R {app.amount?.toLocaleString()}</p>
                                            <Badge variant={app.risk === 'High' ? 'danger' : 'neutral'}>{app.risk}</Badge>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            /* Full Table View when Sidebar is closed */
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicant & Context</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Company</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                                <button onClick={() => toggleSort('amount')} className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                                                    Amount <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                                <button onClick={() => toggleSort('score')} className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                                                    Score <ArrowUpDown className="w-3 h-3" />
                                                </button>
                                            </th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {filteredApps.map((app) => (
                                            <tr 
                                                key={app.id} 
                                                className="hover:bg-slate-800/20 transition-all cursor-pointer group"
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400">
                                                            {(app.name || 'A')[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-100">{app.name || `No Name (ID: ${app.id})`}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Badge variant={app.status === STATUSES.UNDER_REVIEW ? 'primary' : 'neutral'}>
                                                                    {app.status || 'NEW'}
                                                                </Badge>
                                                                {app.assignedTo && <span className="text-[10px] text-blue-500 font-bold">• Assigned</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-slate-300">{app.company || 'Not Specified'}</td>
                                                <td className="px-8 py-6 font-mono font-bold text-slate-200 text-sm">R {app.amount?.toLocaleString()}</td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`font-display font-black text-base ${app.score >= 700 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                            {app.score || '612'}
                                                        </span>
                                                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: `${((app.score || 612)/850)*100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <Badge variant={app.risk === 'High' ? 'danger' : app.risk === 'Medium' ? 'warning' : 'success'}>
                                                        {app.risk || 'Medium'}
                                                    </Badge>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        {!app.assignedTo ? (
                                                            <button 
                                                                onClick={() => handleAssign(app.id)}
                                                                className="px-4 py-2 rounded-xl bg-blue-600/10 text-blue-400 font-bold text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                                                            >
                                                                Assign
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => setSelectedApp(app)}
                                                                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all shadow-lg"
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {filteredApps.length === 0 && (
                            <div className="p-20 text-center space-y-4 bg-slate-900/20">
                                <FileSearch className="w-12 h-12 text-slate-700 mx-auto" />
                                <h3 className="text-xl font-display font-bold text-slate-300">No applications matched filters</h3>
                                <p className="text-slate-500 text-sm">Try resetting your filters or searching for another ID/Company.</p>
                                <button 
                                    onClick={() => { setSearch(''); setRiskFilter('All'); setScoreRange('All'); setStatusFilter('All'); setAssignedToMe(false); }}
                                    className="text-blue-500 font-bold text-sm hover:underline"
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Sidebar View */}
                {selectedApp && (
                    <div className="xl:col-span-2 glass rounded-[32px] border border-blue-500/10 overflow-hidden shadow-2xl animate-in slide-in-from-right-10 duration-500">
                        <div className="p-8 space-y-8 bg-slate-900/30">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-3xl shadow-inner">
                                        {selectedApp.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-display font-bold text-white">{selectedApp.name}</h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="primary">{selectedApp.status}</Badge>
                                            <span className="text-slate-500 font-mono text-xs">{selectedApp.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedApp(null)}
                                    className="p-3 bg-slate-800/50 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800/50 pt-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Users className="w-3 h-3" /> Employment & Background
                                    </h3>
                                    <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
                                        <div className="flex justify-between items-center group">
                                            <span className="text-slate-500 text-xs">Company</span>
                                            <span className="text-slate-200 font-bold group-hover:text-blue-400 transition-colors">{selectedApp.company}</span>
                                        </div>
                                        <div className="flex justify-between items-center group">
                                            <span className="text-slate-500 text-xs">Email</span>
                                            <span className="text-slate-200 font-bold">{selectedApp.email}</span>
                                        </div>
                                        <div className="pt-4 border-t border-slate-800/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">HR Context Note</p>
                                            <p className="text-xs text-slate-400 italic leading-relaxed bg-slate-900 border-l-2 border-slate-700 p-3 rounded-r-xl">
                                                "Employee in good standing. Verification completed via HR portal."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Documents</h3>
                                        <div className="flex gap-3">
                                            <button className="flex-1 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 group">
                                                <FileSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Payslip
                                            </button>
                                            <button className="flex-1 p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl text-xs font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group">
                                                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Bureau Report
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <BarChart3 className="w-3 h-3" /> Financial Risk Profile
                                    </h3>
                                    <div className="glass p-8 rounded-[32px] border-blue-500/10 bg-slate-900/40 space-y-6 shadow-inner relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-400">Total Loan Amount</span>
                                            <span className="text-2xl font-display font-bold text-white tracking-tight">R {selectedApp.amount?.toLocaleString()}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">DSR Ratio</span>
                                                <span className="text-sm font-bold text-blue-400">8.2%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                <div className="h-full bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors" style={{ width: '74%' }}></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Affordability</p>
                                                <p className="text-xl font-display font-bold text-emerald-400">A+</p>
                                            </div>
                                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Risk Grade</p>
                                                <p className={`text-xl font-display font-bold ${selectedApp.risk === 'High' ? 'text-red-400' : 'text-blue-400'}`}>{selectedApp.risk[0]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                                            <MessageSquare className="w-3 h-3" /> Risk Review Notes
                                        </div>
                                        <textarea
                                            className="input-field min-h-[120px] text-sm py-4 bg-slate-950/50"
                                            placeholder="Add specific risk mitigation or affordability notes here..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-800/50">
                                <button
                                    onClick={() => handleApprove(selectedApp.id)}
                                    className="flex-1 py-5 rounded-[24px] bg-blue-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Recommend Approval
                                </button>
                                <button
                                    onClick={() => handleDecline(selectedApp.id)}
                                    className="flex-1 py-5 rounded-[24px] border border-red-500/20 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Reject Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditQueue;
