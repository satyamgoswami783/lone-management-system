import React, { useMemo } from 'react';
import { 
  Users, 
  Receipt, 
  AlertTriangle, 
  History,
  TrendingDown,
  Activity,
  DollarSign,
  PieChart,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  Phone,
  MessageSquare,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, RECOVERY_STATUSES } from '../../context/LoanContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const RecoveryDashboard = () => {
    const navigate = useNavigate();
    const { applications } = useLoans();
    const { user, role } = useAuth();
    
    const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;

    // Derived recovery data with role-based filtering
    const recoveryData = useMemo(() => {
        const allCases = (applications || []).filter(app => 
            app.status === 'Disbursed' && 
            (app.installments?.some(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date()) || 
             app.recoveryStatus)
        );

        // Filter based on role
        const cases = isManager ? allCases : allCases.filter(c => c.assignedAgent === user?.name);

        const totalOutstanding = cases.reduce((acc, curr) => {
            const out = curr.installments?.reduce((sum, inst) => sum + (inst.amount - inst.paidAmount), 0) || 0;
            return acc + out;
        }, 0);

        const totalArrears = cases.reduce((acc, curr) => {
            const overdue = curr.installments?.filter(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date())
                .reduce((sum, inst) => sum + (inst.amount - inst.paidAmount), 0) || 0;
            return acc + overdue;
        }, 0);

        const agingBuckets = {
            low: cases.filter(c => {
                const earliest = c.installments?.find(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
                if (!earliest) return false;
                const dpd = Math.floor((new Date() - new Date(earliest.dueDate)) / (1000 * 60 * 60 * 24));
                return dpd <= 30;
            }).length,
            mid: cases.filter(c => {
                const earliest = c.installments?.find(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
                if (!earliest) return false;
                const dpd = Math.floor((new Date() - new Date(earliest.dueDate)) / (1000 * 60 * 60 * 24));
                return dpd > 30 && dpd <= 60;
            }).length,
            high: cases.filter(c => {
                const earliest = c.installments?.find(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
                if (!earliest) return false;
                const dpd = Math.floor((new Date() - new Date(earliest.dueDate)) / (1000 * 60 * 60 * 24));
                return dpd > 60;
            }).length,
        };

        return { cases, totalOutstanding, totalArrears, agingBuckets, allCasesCount: allCases.length };
    }, [applications, user, role, isManager]);

    const stats = [
        { 
            title: isManager ? 'Global Portfolio Arrears' : 'My Portfolio Arrears', 
            value: `R ${recoveryData.totalArrears.toLocaleString()}`, 
            icon: TrendingDown, 
            variant: 'danger' 
        },
        { 
            title: isManager ? 'Cases in Recovery' : 'My Active Cases', 
            value: recoveryData.cases.length.toString(), 
            icon: Users, 
            variant: 'warning' 
        },
        { 
            title: 'Collection Efficiency', 
            value: '78%', 
            icon: ShieldCheck, 
            variant: 'success' 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title={isManager ? "Administrative Recovery Control" : "Recovery Performance Dashboard"}
                description={isManager ? "Corporate-level oversight of global delinquency metrics and agent productivity." : `Welcome back, ${user?.name}. Manage your assigned accounts and track your performance.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Aging Analysis */}
                <div className="glass rounded-[40px] p-8 border border-slate-800/50 flex flex-col shadow-xl">
                    <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 text-slate-200">
                        <PieChart className="w-5 h-5 text-blue-400" />
                        {isManager ? 'Global Aging' : 'My Portfolio Aging'}
                    </h3>
                    <div className="space-y-6 flex-1">
                        <AgingBar label="DPD 1-30" count={recoveryData.agingBuckets.low} color="bg-emerald-500" total={recoveryData.cases.length} />
                        <AgingBar label="DPD 31-60" count={recoveryData.agingBuckets.mid} color="bg-amber-500" total={recoveryData.cases.length} />
                        <AgingBar label="DPD 60+" count={recoveryData.agingBuckets.high} color="bg-red-500" total={recoveryData.cases.length} />
                    </div>
                </div>

                {/* Priority Collections */}
                <div className="lg:col-span-2 glass rounded-[40px] border border-slate-800/50 overflow-hidden flex flex-col shadow-xl">
                    <div className="p-6 lg:p-8 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/10">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500" />
                            <h3 className="text-lg lg:text-xl font-display font-bold text-slate-100">Priority Collections</h3>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input className="input-field pl-9 py-1.5 text-xs w-48 bg-slate-950/50" placeholder="Search..." />
                            </div>
                            <button 
                                onClick={() => navigate('/recovery/list')}
                                className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-1 group"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/20 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800/40">
                                    <th className="px-8 py-5">Borrower</th>
                                    <th className="px-8 py-5 text-center">Outstanding</th>
                                    <th className="px-8 py-5">Status / Assignment</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 font-medium">
                                {recoveryData.cases.slice(0, 5).map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => navigate(`/recovery/case/${row.id}`)}>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-200">{row.name || 'Anonymous'}</div>
                                            <div className="text-[10px] text-slate-500 font-mono font-bold mt-1 uppercase tracking-tighter">Ref: {row.id}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <p className="text-sm font-bold text-red-500">
                                                R {row.installments?.filter(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date())
                                                    .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <Badge variant={row.recoveryStatus === RECOVERY_STATUSES.PTP_FAILED ? 'danger' : 'warning'}>
                                                    {row.recoveryStatus || 'In Arrears'}
                                                </Badge>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                                    <User className="w-3 h-3" />
                                                    {row.assignedAgent || 'Unassigned'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" title="Contact"><Phone className="w-4 h-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Message"><MessageSquare className="w-4 h-4" /></button>
                                                <button className="p-2 text-slate-500 hover:text-purple-400 rounded-lg transition-colors" title="History" onClick={() => navigate(`/recovery/case/${row.id}`)}><History className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {recoveryData.cases.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-slate-600 font-medium italic text-sm">
                                            No priority cases found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AgingBar = ({ label, count, color, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-black text-slate-500">{count} Cases</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/10 shadow-inner">
                <div 
                    className={`h-full ${color} shadow-lg transition-all duration-1000 ease-out shadow-${color}`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default RecoveryDashboard;
