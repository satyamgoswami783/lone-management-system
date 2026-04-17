import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Phone, 
    MessageSquare, 
    Calendar, 
    DollarSign, 
    History, 
    User, 
    Briefcase, 
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Plus,
    Activity,
    ChevronRight,
    TrendingUp,
    ShieldAlert,
    Target
} from 'lucide-react';
import { useLoans, RECOVERY_STATUSES } from '../../context/LoanContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const RecoveryCaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications, recordRecoveryPayment, logRecoveryInteraction, updatePTP, penaltyInterestRate } = useLoans();
    const { user, role } = useAuth();
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('installments');
    
    // Modals state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);
    const [showPtpModal, setShowPtpModal] = useState(false);

    // Form states
    const [paymentForm, setPaymentForm] = useState({ amount: '', ref: '' });
    const [interactionForm, setInteractionForm] = useState({ type: 'Call', outcome: 'Answered', notes: '' });
    const [ptpForm, setPtpForm] = useState({ date: '', amount: '' });

    const loan = useMemo(() => applications.find(a => a.id === id), [applications, id]);

    const financials = useMemo(() => {
        if (!loan) return { totalAmount: 0, totalPaid: 0, principalOutstanding: 0, totalPenalty: 0, totalOutstanding: 0, baseOverdue: 0, dpd: 0 };
        
        const totalAmount = loan.amount;
        const totalPaid = loan.installments?.reduce((acc, curr) => acc + curr.paidAmount, 0) || 0;
        const principalOutstanding = loan.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
        
        const overdueInstallments = loan.installments?.filter(i => 
            i.status !== 'PAID' && new Date(i.dueDate) < new Date()
        ) || [];
        
        const baseOverdue = overdueInstallments.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
        
        // Calculate Penalties (2% per month of overdue amount)
        let totalPenalty = 0;
        let dpd = 0;
        if (overdueInstallments.length > 0) {
            const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
            dpd = Math.floor((new Date() - earliest) / (1000 * 60 * 60 * 24));
            
            // Penalty = (Base Overdue * Rate) * (Days / 30)
            const monthsOverdue = dpd / 30;
            totalPenalty = Math.round(baseOverdue * (penaltyInterestRate || 0.02) * monthsOverdue);
        }

        const totalOutstanding = principalOutstanding + totalPenalty;

        return { totalAmount, totalPaid, principalOutstanding, totalPenalty, totalOutstanding, baseOverdue, dpd };
    }, [loan, penaltyInterestRate]);

    if (!loan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertCircle className="w-16 h-16 text-slate-700" />
                <h2 className="text-2xl font-display font-bold text-slate-400 tracking-tight">Case Not Found</h2>
                <button 
                    onClick={() => navigate('/recovery/list')}
                    className="flex items-center gap-2 text-blue-500 font-bold hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Recovery List
                </button>
            </div>
        );
    }


    const handlePayment = (e) => {
        e.preventDefault();
        const amt = parseFloat(paymentForm.amount);
        
        if (amt > financials.totalOutstanding + 1) {
            setToast({ message: `Overpayment Error: Maximum acceptable is R ${financials.totalOutstanding.toLocaleString()}`, type: 'error' });
            return;
        }

        recordRecoveryPayment(loan.id, amt, 'Bank Transfer', paymentForm.ref);
        setToast({ message: `Repayment of R ${amt} processed successfully.`, type: 'success' });
        setShowPaymentModal(false);
        setPaymentForm({ amount: '', ref: '' });
    };

    const handleInteraction = (e) => {
        e.preventDefault();
        logRecoveryInteraction(loan.id, { 
            ...interactionForm, 
            agent: user?.name || 'Unknown Agent'
        });
        setToast({ message: `Interaction logged: ${interactionForm.type}`, type: 'info' });
        setShowInteractionModal(false);
        setInteractionForm({ type: 'Call', outcome: 'Answered', notes: '' });
    };

    const handlePtp = (e) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];
        if (ptpForm.date < today) {
            setToast({ message: "Invalid Date: Promise date cannot be in the past.", type: 'error' });
            return;
        }

        updatePTP(loan.id, ptpForm);
        setToast({ message: `New PTP created for ${ptpForm.date}`, type: 'success' });
        setShowPtpModal(false);
        setPtpForm({ date: '', amount: '' });
    };

    const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                    <button 
                        onClick={() => navigate('/recovery/list')}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Portfolio
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-[32px] bg-red-600/10 border-2 border-red-500/20 flex items-center justify-center shadow-2xl shadow-red-600/10">
                            <User className="w-10 h-10 text-red-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-display font-bold text-slate-200 tracking-tight">{loan.name || 'Unknown Debtor'}</h1>
                                <Badge variant={financials.dpd > 90 ? 'danger' : financials.dpd > 0 ? 'warning' : 'success'}>
                                    {financials.dpd > 0 ? `${financials.dpd} Days Overdue` : 'Up to Date'}
                                </Badge>
                            </div>
                            <p className="text-slate-500 font-mono text-sm mt-2 flex items-center gap-2">
                                <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold">{loan.id}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-slate-400 font-bold">{loan.company}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowInteractionModal(true)}
                        className="px-6 py-4 rounded-2xl border border-slate-700 text-slate-300 font-bold text-sm hover:border-slate-500 hover:text-white transition-all bg-slate-900/40"
                    >
                        Log Activity
                    </button>
                    <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                        Record Repayment
                    </button>
                </div>
            </div>

            {/* Financial Status Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass rounded-[40px] p-8 border border-slate-800/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 h-16 text-blue-500" />
                    </div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Total Outstanding</p>
                    <h3 className="text-3xl font-display font-bold text-slate-200">R {financials.totalOutstanding.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="text-emerald-500">Principal: R {financials.principalOutstanding.toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span className="text-red-400">Log: R {financials.totalPenalty.toLocaleString()}</span>
                    </div>
                </div>
                
                <StatCard 
                    title="Current Arrears" 
                    value={`R ${financials.baseOverdue.toLocaleString()}`} 
                    icon={AlertCircle} 
                    variant="danger" 
                />
                <StatCard 
                    title="Penalty Accrued" 
                    value={`R ${financials.totalPenalty.toLocaleString()}`} 
                    icon={ShieldAlert} 
                    variant="warning" 
                />
                <StatCard 
                    title="Case Strategy" 
                    value={loan.recoveryStatus || 'Active Collection'} 
                    icon={Target} 
                    variant="primary" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass rounded-[40px] border border-slate-800/50 overflow-hidden shadow-2xl">
                        <div className="flex border-b border-slate-800/50 bg-slate-900/20">
                            {[
                                { id: 'installments', label: 'Repayment Schedule', icon: Calendar },
                                { id: 'timeline', label: 'Action Logs', icon: History },
                                { id: 'ptp', label: 'PTP Lifecycle', icon: CheckCircle2 }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-6 text-sm font-bold border-b-2 transition-all ${
                                        activeTab === tab.id 
                                            ? "border-blue-500 text-blue-400 bg-blue-500/5" 
                                            : "border-transparent text-slate-500 hover:text-slate-300"
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-10 bg-slate-950/20 min-h-[400px]">
                            {activeTab === 'installments' && (
                                <InstallmentList 
                                    installments={loan.installments || []} 
                                />
                            )}
                            {activeTab === 'timeline' && (
                                <ActionTimeline 
                                    loan={loan} 
                                />
                            )}
                            {activeTab === 'ptp' && (
                                <PtpHistory 
                                    history={loan.ptpHistory || []} 
                                    onAdd={() => setShowPtpModal(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-8">
                    <div className="glass rounded-[40px] p-8 border border-slate-800/50 bg-slate-900/10">
                        <h3 className="text-lg font-display font-bold mb-8 flex items-center gap-3 text-slate-200">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            Collector Assignment
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-950 border border-slate-800">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Assigned Agent</p>
                                    <p className="text-sm font-bold text-slate-200">{loan.assignedAgent || 'Unassigned Case'}</p>
                                </div>
                            </div>

                            <div className="space-y-3 px-1">
                                <InfoBar label="Case Value" value={`R ${financials.totalAmount.toLocaleString()}`} />
                                <InfoBar label="Monthly Salary" value={`R ${loan.salary?.toLocaleString()}`} />
                                <InfoBar label="Days Delinquent" value={`${financials.dpd} DPD`} danger={financials.dpd > 30} />
                                <InfoBar label="Company" value={loan.company} />
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[40px] p-8 border border-slate-800/50 bg-blue-600/5 relative overflow-hidden group">
                        <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-600/10 group-hover:scale-110 transition-transform duration-700" />
                        <h3 className="text-lg font-display font-bold mb-4 relative z-10 text-slate-200">Risk Advisory</h3>
                        <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                            {financials.dpd > 90 
                                ? "This account has exceeded the 90-day threshold. Mandatory legal escalation protocol is now active."
                                : financials.dpd > 30 
                                ? "High-risk delinquency. Intensify collection attempts and secure a valid PTP immediately."
                                : "Standard follow-up required. Monitor closest payment date for commitment adherence."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals with Robust Validation */}
            {showPaymentModal && (
                <Modal title="Post Recovery Repayment" onClose={() => setShowPaymentModal(false)}>
                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end px-1">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Repayment Amount</label>
                                <span className="text-[10px] font-bold text-blue-400">Bal: R {financials.totalOutstanding.toLocaleString()}</span>
                            </div>
                            <input 
                                required
                                type="number"
                                step="0.01"
                                value={paymentForm.amount}
                                onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                                className="input-field py-4 text-xl font-display font-bold text-emerald-400" 
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Payment Reference</label>
                            <input 
                                value={paymentForm.ref}
                                onChange={e => setPaymentForm({...paymentForm, ref: e.target.value})}
                                className="input-field py-4 bg-slate-900 border-slate-700" 
                                placeholder="E.g. Bank Transaction ID"
                            />
                        </div>
                        <div className="pt-4">
                            <button className="w-full py-5 bg-emerald-600 rounded-[24px] font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase tracking-widest">
                                Finalize Payment
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showPtpModal && (
                <Modal title="Commitment (PTP) Setup" onClose={() => setShowPtpModal(false)}>
                    <form onSubmit={handlePtp} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Promise Date</label>
                            <input 
                                required
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={ptpForm.date}
                                onChange={e => setPtpForm({...ptpForm, date: e.target.value})}
                                className="input-field py-4" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Promised Amount (R)</label>
                            <input 
                                required
                                type="number"
                                value={ptpForm.amount}
                                onChange={e => setPtpForm({...ptpForm, amount: e.target.value})}
                                className="input-field py-4 text-lg font-bold text-blue-400" 
                                placeholder="0.00"
                            />
                        </div>
                        <div className="pt-4">
                            <button className="w-full py-5 bg-blue-600 rounded-[24px] font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:scale-[1.01] active:scale-95 transition-all text-sm uppercase tracking-widest">
                                Activate Promise
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {showInteractionModal && (
                <Modal title="Log Collector Activity" onClose={() => setShowInteractionModal(false)}>
                    <form onSubmit={handleInteraction} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Method</label>
                                <select 
                                    className="input-field"
                                    value={interactionForm.type}
                                    onChange={e => setInteractionForm({...interactionForm, type: e.target.value})}
                                >
                                    <option>Call</option>
                                    <option>Visit</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Result</label>
                                <select 
                                    className="input-field"
                                    value={interactionForm.outcome}
                                    onChange={e => setInteractionForm({...interactionForm, outcome: e.target.value})}
                                >
                                    <option>Answered</option>
                                    <option>No Answer</option>
                                    <option>PTP Captured</option>
                                    <option>Refusal</option>
                                    <option>Wrong Number</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Interaction Notes</label>
                            <textarea 
                                required
                                value={interactionForm.notes}
                                onChange={e => setInteractionForm({...interactionForm, notes: e.target.value})}
                                className="input-field min-h-[120px] py-4 bg-slate-900 border-slate-700" 
                                placeholder="Describe the borrower response and strategy..."
                            />
                        </div>
                        <div className="pt-4">
                            <button className="w-full py-5 bg-slate-800 rounded-[24px] font-bold text-white border border-slate-700 hover:bg-slate-700 hover:text-white transition-all text-sm uppercase tracking-widest">
                                Submit Activity Log
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

// Sub-components
const InstallmentList = ({ installments }) => (
    <div className="space-y-4">
        {installments.map((inst, idx) => (
            <div key={idx} className="flex items-center justify-between p-6 bg-white rounded-[28px] border border-slate-700 hover:border-blue-500/30 transition-all group shadow-sm">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        inst.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 
                        inst.status === 'PARTIAL' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                        {inst.status === 'PAID' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="font-display font-bold text-white text-lg">R {inst.amount.toLocaleString()}</p>
                            <Badge variant={inst.status === 'PAID' ? 'success' : inst.status === 'PARTIAL' ? 'warning' : 'neutral'}>
                                {inst.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-bold mt-1">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Received</p>
                        <p className="font-mono font-bold text-emerald-400 text-sm">R {inst.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Balance</p>
                        <p className={`font-mono font-bold text-sm ${inst.amount - inst.paidAmount > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                            R {(inst.amount - inst.paidAmount).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const ActionTimeline = ({ loan }) => {
    const events = useMemo(() => {
        const logs = (loan.interactionLogs || []).map(l => ({ ...l, category: 'INTERACTION' }));
        const history = (loan.auditHistory || []).map(h => ({ 
            id: `audit-${h.date}`, 
            type: h.status, 
            outcome: h.notes || 'Status Updated', 
            notes: h.notes, 
            date: h.date, 
            agent: h.user,
            category: 'STATUS'
        }));
        const ptps = (loan.ptpHistory || []).map(p => ({
            id: `ptp-${p.id}`,
            type: 'PTP Created',
            outcome: `R ${p.amount} promised by ${new Date(p.date).toLocaleDateString()}`,
            notes: `Status: ${p.status}`,
            date: p.createdDate,
            agent: 'System',
            category: 'PTP'
        }));

        return [...logs, ...history, ...ptps].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [loan]);

    return (
        <div className="relative pl-10 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {events.map((event) => (
                <div key={event.id} className="relative group">
                    <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-4 border-slate-800 group-hover:border-blue-500 transition-all z-10 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-slate-500 group-hover:bg-blue-500" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge variant={
                                event.category === 'INTERACTION' ? 'primary' : 
                                event.category === 'PTP' ? 'warning' : 'neutral'
                            }>
                                {event.type}
                            </Badge>
                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                                {new Date(event.date).toLocaleString()}
                            </span>
                        </div>
                        <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-700 group-hover:border-slate-500 transition-all max-w-2xl shadow-sm">
                            <p className="font-bold text-slate-200 text-base mb-2">{event.outcome}</p>
                            {event.notes && <p className="text-slate-400 text-sm leading-relaxed">{event.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] pt-1 pl-1">
                            <Activity className="w-3 h-3" />
                            Activity by: {event.agent}
                        </div>
                    </div>
                </div>
            ))}
            {events.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                    <Activity className="w-12 h-12 text-slate-800" />
                    <p className="text-slate-600 text-sm font-medium italic">No recovery events recorded for this case.</p>
                </div>
            )}
        </div>
    );
};

const PtpHistory = ({ history, onAdd }) => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">PTP Audit Trail</h4>
            <button 
                onClick={onAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600/10 text-blue-400 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all shadow-lg"
            >
                <Plus className="w-4 h-4" />
                Capture Promise
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((ptp, idx) => (
                <div key={idx} className="p-8 rounded-[32px] border border-slate-700 bg-white space-y-6 relative overflow-hidden group shadow-sm">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${
                        ptp.status === 'FAILED' ? 'bg-red-500' : ptp.status === 'FULFILLED' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} style={{ borderRadius: '100%' }} />
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Promised Amount</p>
                            <p className="text-2xl font-display font-bold text-white">R {ptp.amount.toLocaleString()}</p>
                        </div>
                        <Badge variant={ptp.status === 'FAILED' ? 'danger' : ptp.status === 'FULFILLED' ? 'success' : 'primary'}>
                            {ptp.status}
                        </Badge>
                    </div>
                    <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between text-slate-500 relative z-10">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold">{new Date(ptp.date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">Created: {new Date(ptp.createdDate).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const InfoBar = ({ label, value, danger }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-bold ${danger ? 'text-red-500' : 'text-slate-300'}`}>{value}</span>
    </div>
);

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-200/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
        <div className="relative w-full max-w-xl glass rounded-[40px] border border-slate-800/50 overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 md:p-10 border-b border-slate-800/50 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-2xl font-display font-bold text-slate-200 tracking-tight">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-2xl transition-all text-slate-500 hover:text-white">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>
            </div>
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    </div>
);

export default RecoveryCaseDetail;
