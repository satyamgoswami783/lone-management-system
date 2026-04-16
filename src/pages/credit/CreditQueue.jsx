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
  Users
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const CreditQueue = () => {
    const { applications, assignApplication } = useLoans();
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
                
                // Show all relevant statuses in the assessment queue
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

            {/* Controls */}
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-12 py-4" 
                            placeholder="Search by Name, ID, or Company..." 
                        />
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                        <span className="px-3 text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Filter className="w-3 h-3" /> Risk</span>
                        {['All', 'Low', 'Medium', 'High'].map(r => (
                            <button 
                                key={r}
                                onClick={() => setRiskFilter(r)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    riskFilter === r ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                        <span className="px-3 text-[10px] font-black text-slate-500 uppercase">Score Range</span>
                        {['All', 'High', 'Medium', 'Low'].map(s => (
                            <button 
                                key={s}
                                onClick={() => setScoreRange(s)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    scoreRange === s ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                                }`}
                            >
                                {s === 'All' ? 'All' : `${s} Score`}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                        <span className="px-3 text-[10px] font-black text-slate-500 uppercase">Assignment</span>
                        <button 
                            onClick={() => setAssignedToMe(!assignedToMe)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                assignedToMe ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            <UserCheck className="w-3 h-3" />
                            Assigned to me
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Table */}
            <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicant & ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Company</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                    <button onClick={() => toggleSort('amount')} className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                                        Loan Amount <ArrowUpDown className="w-3 h-3" />
                                    </button>
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Salary Balance</th>
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
                                    className="hover:bg-slate-800/20 transition-all group cursor-pointer"
                                    onClick={() => navigate(`/credit/profile/${app.id}`)}
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
                                    <td className="px-8 py-6 font-mono text-slate-400 text-xs">R {app.salary?.toLocaleString() || '0'}</td>
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
                                                    Assign to Me
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => navigate(`/credit/profile/${app.id}`)}
                                                    className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-[10px] uppercase hover:bg-slate-700 transition-all flex items-center gap-2"
                                                >
                                                    Review / Start Assessment
                                                    <ChevronRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
    );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default CreditQueue;


