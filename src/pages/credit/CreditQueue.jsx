import React, { useState } from 'react';
import {
    ShieldCheck,
    Search,
    Filter,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    BarChart3,
    FileSearch,
    MessageSquare
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard } from '../../components/ui/Shared';

const CreditQueue = () => {
    const { applications, updateStatus } = useLoans();
    const [selectedApp, setSelectedApp] = useState(null);

    // Show applications that are HR_APPROVED or CREDIT_PENDING
    const queue = applications.filter(app => app.status === STATUSES.CREDIT_PENDING || app.status === STATUSES.HR_APPROVED);

    const stats = [
        { title: 'In Queue', value: queue.length.toString(), icon: ShieldCheck, variant: 'primary' },
        { title: 'Avg Score', value: '724', icon: TrendingUp, variant: 'success' },
        { title: 'High Risk', value: '3', icon: AlertCircle, variant: 'danger' },
    ];

    const handleApprove = (id) => {
        updateStatus(id, STATUSES.CREDIT_APPROVED);
        setTimeout(() => updateStatus(id, STATUSES.ADMIN_PENDING), 500);
        setSelectedApp(null);
    };

    const handleDecline = (id) => {
        updateStatus(id, STATUSES.DECLINED);
        setSelectedApp(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Credit Assessment Queue"
                description="Perform risk assessment and affordability checks on verified applications."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List View */}
                <div className={selectedApp ? "hidden xl:block xl:col-span-1" : "xl:col-span-3"}>
                    <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50">
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold">Queue</h2>
                            <Search className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="divide-y divide-slate-800/50">
                            {queue.map((app) => (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedApp(app)}
                                    className={`w-full p-6 text-left hover:bg-slate-800/30 transition-all flex items-center justify-between group ${selectedApp?.id === app.id ? 'bg-blue-600/5 border-l-4 border-blue-600' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 group-hover:scale-110 transition-transform">
                                            {app.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{app.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{app.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-200">R {app.amount?.toLocaleString()}</p>
                                        <Badge variant="primary">Assessment</Badge>
                                    </div>
                                </button>
                            ))}
                            {queue.length === 0 && (
                                <div className="p-10 text-center text-slate-500">No applications pending assessment.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail View */}
                {selectedApp && (
                    <div className="xl:col-span-2 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="glass p-8 rounded-[40px] space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <FileSearch className="w-12 h-12 text-blue-600/20" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-3xl font-bold text-blue-400">
                                    {selectedApp.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-bold">{selectedApp.name}</h2>
                                    <p className="text-slate-400">{selectedApp.email} • {selectedApp.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800/50">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Employee & HR Context</h3>
                                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Company</span>
                                            <span className="text-slate-200 font-bold">{selectedApp.company}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">HR Verification</span>
                                            <Badge variant="success">Verified</Badge>
                                        </div>
                                        <div className="pt-2 border-t border-slate-800/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">HR Notes</p>
                                            <p className="text-xs text-slate-300 italic">"Employee in good standing. 3 years tenure. No active disciplinary issues."</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Documents</h3>
                                        <div className="flex gap-2">
                                            <button className="flex-1 p-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                                                <FileSearch className="w-3 h-3" />
                                                View Payslip
                                            </button>
                                            <button className="flex-1 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-bold text-blue-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                                <TrendingUp className="w-3 h-3" />
                                                Pull Credit Report
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Risk Analysis</h3>
                                    <div className="glass p-6 rounded-2xl border-blue-500/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Monthly Surplus</span>
                                            <span className="text-lg font-bold text-emerald-400">R 8,450.00</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Installment/Income</span>
                                            <span className="text-lg font-bold text-blue-400">8.2%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600" style={{ width: '74%' }}></div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <BarChart3 className="w-4 h-4 text-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Affordability Score: <span className="text-white">A+</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-800/50">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" />
                                    Risk Review Notes
                                </h3>
                                <textarea
                                    className="input-field min-h-[100px] text-sm py-4"
                                    placeholder="Confirm affordability and risk assessment notes for final approval..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => handleApprove(selectedApp.id)}
                                    className="flex-1 btn-primary py-4 text-lg"
                                >
                                    Recommend Approval
                                </button>
                                <button
                                    onClick={() => handleDecline(selectedApp.id)}
                                    className="flex-1 py-4 rounded-2xl border border-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Reject Application
                                </button>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="px-6 py-4 rounded-2xl border border-slate-800 text-slate-500 hover:text-white transition-all"
                                >
                                    Close
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
