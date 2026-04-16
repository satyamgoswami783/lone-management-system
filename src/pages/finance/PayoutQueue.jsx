import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Banknote,
  Send,
  History,
  FileText
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard } from '../../components/ui/Shared';

const PayoutQueue = () => {
    const { applications, updateStatus } = useLoans();
    const [processing, setProcessing] = useState(false);
    
    // Show applications that are ADMIN_APPROVED
    const queue = applications.filter(app => app.status === STATUSES.ADMIN_APPROVED);

    const stats = [
        { title: 'Ready for Payout', value: queue.length.toString(), icon: Banknote, variant: 'warning' },
        { title: 'Total Paid today', value: 'R 84,000', icon: CreditCard, variant: 'success' },
        { title: 'Failed Transfers', value: '0', icon: AlertCircle, variant: 'primary' },
    ];

    const handleDisburse = (id) => {
        setProcessing(true);
        // Simulate bank transfer delay
        setTimeout(() => {
            updateStatus(id, STATUSES.DISBURSED);
            setProcessing(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader 
                title="Disbursement Queue" 
                description="Manage approved loan payouts and generate bank instruction files."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50">
                <div className="p-8 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-900/20">
                    <div className="space-y-1">
                        <h2 className="text-xl font-display font-bold">Approved Loans</h2>
                        <p className="text-sm text-slate-500">Funds will be disbursed to the verified bank account on file.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                            <Download className="w-4 h-4" />
                            Batch File
                        </button>
                    </div>
                </div>

                {queue.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-slate-500">No Pending Payouts</h3>
                        <p className="text-slate-600 max-w-sm">Global disbursement pipeline is currently clear. Approved payments will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/50">
                                    <th className="px-8 py-5">Recipient & Bank</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {queue.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 group-hover:scale-105 transition-transform">
                                                    {app.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200">{app.name}</p>
                                                    <p className="text-xs text-slate-500 font-mono">FNB 1234567890 (Savings)</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-display font-bold text-lg text-emerald-400">
                                            R {app.amount?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="warning">Awaiting Funds</Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                disabled={processing}
                                                onClick={() => handleDisburse(app.id)}
                                                className={`flex items-center gap-2 ml-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${processing ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'}`}
                                            >
                                                <Send className="w-4 h-4" />
                                                {processing ? 'Processing...' : 'Disburse Now'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayoutQueue;
