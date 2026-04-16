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
  Calendar
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
        <div className="glass rounded-[40px] p-8 border border-slate-800/50 flex flex-col">
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 text-slate-200">
                <PieChart className="w-5 h-5 text-blue-400" />
                {isManager ? 'Global Aging' : 'My Portfolio Aging'}
            </h3>
            <div className="space-y-6 flex-1">
                <AgingBar label="DPD 1-30" count={recoveryData.agingBuckets.low} color="bg-emerald-500" total={recoveryData.cases.length} />
                <AgingBar label="DPD 31-60" count={recoveryData.agingBuckets.mid} color="bg-amber-500" total={recoveryData.cases.length} />
                <AgingBar label="DPD 60+" count={recoveryData.agingBuckets.high} color="bg-red-500" total={recoveryData.cases.length} />
            </div>
            
            <div className={`mt-12 p-6 rounded-[24px] border border-slate-800/50 ${recoveryData.agingBuckets.high > 0 ? 'bg-red-500/5' : 'bg-emerald-500/5'}`}>
                <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <Activity className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System Advisory</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {recoveryData.agingBuckets.high > 0 
                        ? `${recoveryData.agingBuckets.high} cases require immediate escalation to legal.` 
                        : "Your current portfolio is healthy with no critically aged debts."}
                </p>
            </div>
        </div>

        {/* Priority Accounts */}
        <div className="lg:col-span-2 glass rounded-[40px] border border-slate-800/50 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/10">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-slate-500" />
                    <h3 className="text-xl font-display font-bold">Priority Collections</h3>
                </div>
                <button 
                    onClick={() => navigate('/recovery/list')}
                    className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group"
                >
                    View All {isManager ? 'Global' : 'My'} Cases
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950/20 text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800/40">
                            <th className="px-8 py-5">Borrower</th>
                            <th className="px-8 py-5">Arrears</th>
                            <th className="px-8 py-5">Assigned Agent</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 font-medium">
                        {recoveryData.cases.slice(0, 5).map((row) => (
                            <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-200">{row.name || 'Anonymous'}</div>
                                    <div className="text-[10px] text-slate-500 font-mono font-bold mt-1 uppercase">{row.id}</div>
                                </td>
                                <td className="px-8 py-6 text-sm text-red-500 font-bold">
                                    R {row.installments?.filter(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date())
                                        .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0).toLocaleString()}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <User className="w-3 h-3" />
                                        {row.assignedAgent || 'Unassigned'}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button 
                                        onClick={() => navigate(`/recovery/case/${row.id}`)}
                                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-blue-500/50 transition-all active:scale-95"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recoveryData.cases.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-slate-600 font-medium italic text-sm">No priority cases found in your current view.</p>
                    </div>
                )}
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
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/20">
                <div 
                    className={`h-full ${color} shadow-lg transition-all duration-1000 ease-out`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default RecoveryDashboard;
