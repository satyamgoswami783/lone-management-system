import React, { useMemo, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  PhoneCall, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter,
  MessageCircle,
  Clock,
  ChevronRight,
  User,
  ExternalLink,
  FilterX,
  Activity,
  CheckCircle2,
  XCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, RECOVERY_STATUSES } from '../../context/LoanContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const RecoveryList = () => {
    const navigate = useNavigate();
    const { applications, bulkAssignAgents } = useLoans();
    const { user, role } = useAuth();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedCases, setSelectedCases] = useState([]);
    const [toast, setToast] = useState(null);
    const [showBulkAssign, setShowBulkAssign] = useState(false);

    const AGENTS = ["Sarah Collections", "John Recovery", "Mike Debtors"];

    // Filter applications based on permissions and recovery status
    const recoveryCases = useMemo(() => {
        return (applications || []).filter(app => {
            // Role-based visibility: Recovery agents only see their assigned cases
            const isAssignedToMe = app.assignedAgent === user?.name;
            const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;
            
            if (!isManager && !isAssignedToMe) return false;

            // Core Recovery Filter: Disbursed and has arrears or in recovery lifecycle
            const hasArrears = app.installments?.some(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
            const isInRecovery = app.recoveryStatus && 
                               app.recoveryStatus !== RECOVERY_STATUSES.RECOVERED && 
                               app.recoveryStatus !== RECOVERY_STATUSES.HEALTHY;
            
            return (app.status === 'Disbursed' && (hasArrears || isInRecovery)) || 
                   (app.recoveryStatus && 
                    app.recoveryStatus !== RECOVERY_STATUSES.RECOVERED && 
                    app.recoveryStatus !== RECOVERY_STATUSES.HEALTHY);
        }).map(app => {
            const overdueInstallments = app.installments?.filter(i => 
                i.status !== 'PAID' && new Date(i.dueDate) < new Date()
            ) || [];
            
            const overdueAmount = overdueInstallments.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
            const outstanding = app.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
            
            let dpd = 0;
            if (overdueInstallments.length > 0) {
                const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
                dpd = Math.floor((new Date() - earliest) / (1000 * 60 * 60 * 24));
            }

            return { ...app, overdueAmount, outstanding, dpd };
        });
    }, [applications, user, role]);

    const filteredCases = useMemo(() => {
        return recoveryCases.filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
                                 (c.id || '').toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === 'All' || c.recoveryStatus === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [recoveryCases, search, filterStatus]);

    const stats = useMemo(() => {
        const totalArrears = recoveryCases.reduce((acc, curr) => acc + curr.overdueAmount, 0);
        const highRisk = recoveryCases.filter(c => c.dpd > 30).length;
        return [
            { title: 'Total Portfolio Arrears', value: `R ${totalArrears.toLocaleString()}`, icon: DollarSign, variant: 'danger' },
            { title: 'Active Collections', value: recoveryCases.length.toString(), icon: Users, variant: 'primary' },
            { title: highRisk > 0 ? 'High Risk Items' : 'Accounts Healthy', value: highRisk.toString(), icon: AlertTriangle, variant: highRisk > 0 ? 'warning' : 'success' },
        ];
    }, [recoveryCases]);

    const toggleSelectAll = () => {
        if (selectedCases.length === filteredCases.length) {
            setSelectedCases([]);
        } else {
            setSelectedCases(filteredCases.map(c => c.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedCases(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkAssign = (agent) => {
        bulkAssignAgents(selectedCases, agent);
        setToast({ message: `Successfully assigned ${selectedCases.length} cases to ${agent}`, type: 'success' });
        setSelectedCases([]);
        setShowBulkAssign(false);
    };

    const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <SectionHeader 
                title={role === ROLES.RECOVERY ? "My Recovery Portfolio" : "Recoveries Case Management"} 
                description={role === ROLES.RECOVERY ? "Focus on your assigned accounts and record collection attempts." : "Monitor delinquency aging, manage PTP cycles, and record collection outcomes."}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50 shadow-2xl relative shadow-blue-900/10">
                <div className="p-8 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/10">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            value={search}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12 py-3.5 text-sm bg-slate-950/50" 
                            placeholder="Search by Debtor Name or Case ID..." 
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                            <option value="All">All Recovery Statuses</option>
                            {Object.values(RECOVERY_STATUSES).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto text-[13px]">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-slate-950/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                {isManager && (
                                    <th className="px-8 py-5 w-10">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                        />
                                    </th>
                                )}
                                <th className="px-8 py-5">Case & Borrower</th>
                                <th className="px-8 py-5">Agent</th>
                                <th className="px-8 py-5">Outstanding</th>
                                <th className="px-8 py-5 text-center">Aging (DPD)</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {filteredCases.map((caseItem) => (
                                <tr key={caseItem.id} className={`hover:bg-slate-800/20 transition-all group ${selectedCases.includes(caseItem.id) ? 'bg-blue-600/5' : ''}`}>
                                    {isManager && (
                                        <td className="px-8 py-6">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedCases.includes(caseItem.id)}
                                                onChange={() => toggleSelect(caseItem.id)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                            />
                                        </td>
                                    )}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[18px] bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:border-blue-500/50 transition-all">
                                                <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                                    {caseItem.name || 'Anonymous Debtor'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold mt-1 tracking-widest">
                                                    {caseItem.id} • {caseItem.company}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {caseItem.assignedAgent ? (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <Activity className="w-3 h-3 text-emerald-500" />
                                                    </div>
                                                    <span className="text-xs font-bold">{caseItem.assignedAgent}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 italic text-xs font-medium">Not Assigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-200 text-sm">R {caseItem.outstanding.toLocaleString()}</p>
                                            <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter bg-red-500/5 inline-block px-2 py-0.5 rounded-lg border border-red-500/10">
                                                Arrears: R {caseItem.overdueAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                caseItem.dpd > 60 ? "border-red-500/30 bg-red-500/10 text-red-500" : 
                                                caseItem.dpd > 30 ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                                                caseItem.dpd > 0 ? "border-blue-500/30 bg-blue-500/10 text-blue-500" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                            }`}>
                                                {caseItem.dpd} DPD
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={
                                            caseItem.recoveryStatus === RECOVERY_STATUSES.LEGAL ? 'danger' : 
                                            caseItem.recoveryStatus === RECOVERY_STATUSES.IN_ARREARS ? 'warning' : 'primary'
                                        }>
                                            {caseItem.recoveryStatus || 'Active Collection'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => navigate(`/recovery/case/${caseItem.id}`)}
                                            className="px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                                        >
                                            {role === ROLES.RECOVERY ? "Collect Now" : "Review Case"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCases.length === 0 && (
                    <div className="p-32 text-center flex flex-col items-center justify-center space-y-6 bg-slate-900/10">
                        <div className="w-24 h-24 rounded-[40px] bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-700 shadow-inner">
                            <FilterX className="w-12 h-12" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-bold text-slate-300 tracking-tight">No match found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm">No recoveries match the select criteria. Try adjusting your filters.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Action Bar - Only for Managers */}
            {isManager && selectedCases.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 animate-in slide-in-from-bottom-10 duration-500 z-50">
                    <div className="glass rounded-[32px] p-6 border-2 border-blue-500/40 shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex items-center justify-between gap-8 bg-slate-950/95 backdrop-blur-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-600/30">
                                {selectedCases.length}
                            </div>
                            <div>
                                <h4 className="text-xl font-display font-bold text-white tracking-tight">Cases Selected</h4>
                                <p className="text-slate-500 text-sm font-medium">Batch operational actions.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setShowBulkAssign(!showBulkAssign)}
                                    className="px-8 py-4 rounded-[20px] bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm hover:border-blue-500 hover:bg-slate-800 transition-all flex items-center gap-3 group"
                                >
                                    <User className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                                    Assign Agent
                                </button>
                                
                                {showBulkAssign && (
                                    <div className="absolute bottom-full mb-4 right-0 w-72 glass rounded-[24px] border border-slate-800 shadow-2xl p-3 animate-in fade-in zoom-in-95 bg-slate-950/90 backdrop-blur-3xl">
                                        <p className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 mb-2">Available Recovery Agents</p>
                                        {AGENTS.map(agent => (
                                            <button 
                                                key={agent}
                                                onClick={() => handleBulkAssign(agent)}
                                                className="w-full text-left px-4 py-4 rounded-xl hover:bg-blue-600 group transition-all mb-1 last:mb-0"
                                            >
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white">{agent}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <button className="px-8 py-4 rounded-[20px] bg-slate-900 border border-slate-800 text-slate-200 font-bold text-sm hover:border-red-500/50 hover:bg-red-500/5 transition-all flex items-center gap-3 group">
                                <AlertTriangle className="w-5 h-5 text-slate-500 group-hover:text-red-400 group-hover:scale-110 transition-all" />
                                Legal Escalation
                            </button>
                            
                            <button 
                                onClick={() => setSelectedCases([])}
                                className="p-4 rounded-[20px] bg-slate-900/50 text-slate-500 hover:text-white transition-all border border-transparent hover:border-slate-700"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecoveryList;
