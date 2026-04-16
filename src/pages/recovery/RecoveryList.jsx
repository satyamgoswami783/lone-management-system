import React from 'react';
import {
    Users,
    AlertTriangle,
    PhoneCall,
    Calendar,
    DollarSign,
    Search,
    Filter,
    MessageCircle,
    Clock
} from 'lucide-react';
import { SectionHeader, Badge, StatCard } from '../../components/ui/Shared';

const RecoveryList = () => {
    const cases = [
        { id: 'REC-1209', name: 'John Peterson', amount: 4200, daysOverdue: 14, status: 'Active Collection', company: 'BuildCo SA' },
        { id: 'REC-1142', name: 'Thabo Mbeki', amount: 1500, daysOverdue: 45, status: 'Final Notice', company: 'Global Log' },
        { id: 'REC-1028', name: 'Maria Gomez', amount: 8900, daysOverdue: 7, status: 'Contacted', company: 'Standard BK' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Recoveries Case Management"
                description="Manage defaulted loans and handle manual collection processes for exited employees."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Arrears" value="R 142,500" icon={DollarSign} variant="danger" />
                <StatCard title="Active Cases" value="24" icon={Users} variant="warning" />
                <StatCard title="Recovered Today" value="R 12,400" icon={Clock} variant="success" />
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50">
                <div className="p-8 border-b border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-xl font-display font-bold">Defaulted Loans</h2>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input className="input-field pl-9 py-2 text-sm w-64" placeholder="Search debtor..." />
                        </div>
                        <button className="p-2.5 glass rounded-xl text-slate-400 hover:text-white transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-8 py-4">Borrower Details</th>
                                <th className="px-8 py-4">Outstanding</th>
                                <th className="px-8 py-4">Delinquency</th>
                                <th className="px-8 py-4">Current Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {cases.map((caseItem) => (
                                <tr key={caseItem.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center font-bold text-red-400">
                                                {caseItem.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{caseItem.name}</p>
                                                <p className="text-xs text-slate-500 uppercase font-mono">{caseItem.id} • {caseItem.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-slate-200 text-lg">R {caseItem.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${caseItem.daysOverdue > 30 ? 'bg-red-500 animate-pulse' : 'bg-warning-500'}`}></div>
                                            <span className="text-sm font-medium text-slate-300">{caseItem.daysOverdue} Days Overdue</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={caseItem.daysOverdue > 30 ? 'danger' : 'warning'}>{caseItem.status}</Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2.5 rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-600/5">
                                                <PhoneCall className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:border-slate-500 hover:text-white transition-all">
                                                Add PTP
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecoveryList;
