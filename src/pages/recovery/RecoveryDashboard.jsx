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
import { StatCard, SectionHeader, Badge, Modal, Toast } from '../../components/ui/Shared';
import { CreditCard, Ban as Banknote } from 'lucide-react';

const RecoveryDashboard = () => {
    const navigate = useNavigate();
    const { applications, recordRecoveryPayment, logRecoveryInteraction } = useLoans();
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

    const [search, setSearch] = React.useState('');
    const [toast, setToast] = React.useState(null);
    const [activeActionCase, setActiveActionCase] = React.useState(null);
    const [showPaymentModal, setShowPaymentModal] = React.useState(false);
    const [showInteractionModal, setShowInteractionModal] = React.useState(false);
    const [paymentForm, setPaymentForm] = React.useState({ amount: '', ref: '' });
    const [interactionForm, setInteractionForm] = React.useState({ type: 'Call', outcome: 'Answered', notes: '' });

    const efficiency = useMemo(() => {
        const totalArrears = recoveryData.totalArrears;
        if (totalArrears === 0) return 100;
        // Mocking some recovery performance
        return 78; 
    }, [recoveryData.totalArrears]);

    const filteredPriorityCases = useMemo(() => {
        return recoveryData.cases
            .filter(c => (c.name || '').toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const aArrears = a.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
                const bArrears = b.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
                return bArrears - aArrears;
            })
            .slice(0, 5);
    }, [recoveryData.cases, search]);

    const stats = [
        { 
            title: isManager ? 'Global Portfolio Arrears' : 'My Portfolio Arrears', 
            value: `R ${recoveryData.totalArrears.toLocaleString()}`, 
            icon: TrendingDown, 
            variant: 'danger',
            onClick: () => navigate('/recovery/list', { state: { filter: 'Arrears' } })
        },
        { 
            title: isManager ? 'Cases in Recovery' : 'My Active Cases', 
            value: recoveryData.cases.length.toString(), 
            icon: Users, 
            variant: 'warning',
            onClick: () => navigate('/recovery/list')
        },
        { 
            title: 'Collection Efficiency', 
            value: `${efficiency}%`, 
            icon: ShieldCheck, 
            variant: 'success',
            subValue: 'Last 30 Days'
        },
    ];

    const openAction = (e, caseItem, type) => {
        e.stopPropagation();
        setActiveActionCase(caseItem);
        if (type === 'payment') setShowPaymentModal(true);
        if (type === 'interaction') setShowInteractionModal(true);
    };

    const handleQuickPayment = (e) => {
        e.preventDefault();
        const { recordRecoveryPayment } = require('../../context/LoanContext'); // This is a hack, useLoans already has it
        // Better: use destructuring in useLoans call above
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
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
                        <AgingBar label="DPD 1-30" count={recoveryData.agingBuckets.low} color="bg-emerald-500" total={recoveryData.cases.length} onClick={() => navigate('/recovery/list', { state: { filter: 'low' } })} />
                        <AgingBar label="DPD 31-60" count={recoveryData.agingBuckets.mid} color="bg-amber-500" total={recoveryData.cases.length} onClick={() => navigate('/recovery/list', { state: { filter: 'mid' } })} />
                        <AgingBar label="DPD 60+" count={recoveryData.agingBuckets.high} color="bg-red-500" total={recoveryData.cases.length} onClick={() => navigate('/recovery/list', { state: { filter: 'high' } })} />
                    </div>
                </div>

                {/* Priority Collections */}
                <div className="lg:col-span-2 glass rounded-[40px] border border-slate-800/50 overflow-hidden flex flex-col shadow-xl">
                    <div className="p-6 lg:p-8 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/10">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-slate-500" />
                            <h3 className="text-lg lg:text-xl font-display font-bold text-slate-200">Priority Collections</h3>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    className="input-field pl-9 py-1.5 text-xs w-48 bg-slate-900 border-slate-700" 
                                    placeholder="Search..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
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
                                <tr className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800/40">
                                    <th className="px-8 py-5">Borrower</th>
                                    <th className="px-8 py-5 text-center">Outstanding</th>
                                    <th className="px-8 py-5">Status / Assignment</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/40 font-medium hidden md:table-row-group">
                                {filteredPriorityCases.map((row) => (
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
                                                <Badge variant={row.recoveryStatus === RECOVERY_STATUSES.PTP_FAILED ? 'danger' : row.recoveryStatus === RECOVERY_STATUSES.PTP ? 'primary' : 'warning'}>
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
                                                <button 
                                                    onClick={(e) => openAction(e, row, 'interaction')}
                                                    className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all" 
                                                    title="Call"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => openAction(e, row, 'payment')}
                                                    className="p-2.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all" 
                                                    title="Record Payment"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/recovery/case/${row.id}`)}
                                                    className="p-2.5 text-slate-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-xl transition-all" 
                                                    title="View Detail"
                                                >
                                                    <History className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Priority Cards */}
                        <div className="md:hidden p-6 space-y-6">
                            {filteredPriorityCases.map((row) => (
                                <div key={row.id} className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/50 space-y-4 shadow-lg group active:bg-slate-800/50 transition-all" onClick={() => navigate(`/recovery/case/${row.id}`)}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-200">{row.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">{row.id}</p>
                                        </div>
                                        <Badge variant={row.recoveryStatus === RECOVERY_STATUSES.PTP_FAILED ? 'danger' : 'warning'}>
                                            {row.recoveryStatus || 'Arrears'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Arrears</p>
                                            <p className="text-lg font-display font-bold text-red-500">
                                                R {row.installments?.filter(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date())
                                                    .reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={(e) => openAction(e, row, 'interaction')}
                                                className="p-3 rounded-2xl bg-slate-800 text-blue-400"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => openAction(e, row, 'payment')}
                                                className="p-3 rounded-2xl bg-slate-800 text-emerald-400"
                                            >
                                                <DollarSign className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPriorityCases.length === 0 && (
                            <div className="p-32 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-display font-bold text-slate-400 italic">All accounts are healthy</p>
                                    <button 
                                        onClick={() => navigate('/recovery/list')}
                                        className="text-xs font-bold text-blue-500 hover:underline"
                                    >
                                        View All Loans
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals for Quick Actions */}
            {showPaymentModal && activeActionCase && (
                <Modal 
                    title={`Record Payment: ${activeActionCase.name}`} 
                    onClose={() => setShowPaymentModal(false)}
                >
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            recordRecoveryPayment(activeActionCase.id, parseFloat(paymentForm.amount), 'Cash', paymentForm.ref);
                            setToast({ message: "Repayment recorded successfully", type: 'success' });
                            setShowPaymentModal(false);
                            setPaymentForm({ amount: '', ref: '' });
                        }} 
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Amount (R)</label>
                            <input 
                                required
                                type="number"
                                className="input-field py-4 text-xl font-display font-bold text-emerald-400"
                                value={paymentForm.amount}
                                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Reference / Receipt #</label>
                            <input 
                                required
                                className="input-field"
                                value={paymentForm.ref}
                                onChange={(e) => setPaymentForm({ ...paymentForm, ref: e.target.value })}
                                placeholder="e.g. RCP-12345"
                            />
                        </div>
                        <button className="w-full py-5 rounded-3xl bg-emerald-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20">
                            Confirm Repayment
                        </button>
                    </form>
                </Modal>
            )}

            {showInteractionModal && activeActionCase && (
                <Modal 
                    title={`Log Interaction: ${activeActionCase.name}`} 
                    onClose={() => setShowInteractionModal(false)}
                >
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            logRecoveryInteraction(activeActionCase.id, {
                                ...interactionForm,
                                agent: user?.name,
                                date: new Date().toISOString()
                            });
                            setToast({ message: "Interaction logged successfully", type: 'success' });
                            setShowInteractionModal(false);
                            setInteractionForm({ type: 'Call', outcome: 'Answered', notes: '' });
                        }} 
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Method</label>
                                <select 
                                    className="input-field"
                                    value={interactionForm.type}
                                    onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                                >
                                    <option>Call</option>
                                    <option>Message</option>
                                    <option>Visit</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Outcome</label>
                                <select 
                                    className="input-field"
                                    value={interactionForm.outcome}
                                    onChange={(e) => setInteractionForm({ ...interactionForm, outcome: e.target.value })}
                                >
                                    <option>Answered</option>
                                    <option>No Answer</option>
                                    <option>PTP Committed</option>
                                    <option>Refusal</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Notes</label>
                            <textarea 
                                required
                                className="input-field min-h-[120px]"
                                value={interactionForm.notes}
                                onChange={(e) => setInteractionForm({ ...interactionForm, notes: e.target.value })}
                                placeholder="Describe the outcome of the interaction..."
                            />
                        </div>
                        <button className="w-full py-5 rounded-3xl bg-blue-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                            Record Interaction
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

const AgingBar = ({ label, count, color, total, onClick }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div 
            className="space-y-3 group/bar cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onClick}
        >
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover/bar:text-slate-200 transition-colors">{label}</span>
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
