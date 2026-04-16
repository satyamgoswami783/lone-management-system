import React from 'react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { Receipt, Calendar, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Statements = () => {
    const { applications } = useLoans();
    const activeLoan = applications.find(app => app.status === STATUSES.DISBURSED);

    const mockTransactions = [
        { id: 'TX-9021', date: '2024-03-31', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-8842', date: '2024-02-28', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-1029', date: '2024-01-31', description: 'Initial Loan Disbursement', amount: 5000, type: 'disbursement' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Repayment Statements"
                description="View your active loan balance and transaction history."
            />

            {!activeLoan ? (
                <div className="glass p-12 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold">No Active Statements</h3>
                    <p className="text-slate-500 max-w-md">Statements are only generated once your loan has been approved and disbursed.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl bg-blue-600/5 border-blue-500/10">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Balance</p>
                            <p className="text-3xl font-display font-bold">R 2,500.00</p>
                        </div>
                        <div className="glass p-6 rounded-3xl">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Next Payment</p>
                            <p className="text-2xl font-display font-bold">R 1,250.00</p>
                            <p className="text-xs text-emerald-400 mt-1 font-bold">DUE: 30 APR 2024</p>
                        </div>
                        <div className="glass p-6 rounded-3xl">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Repaid</p>
                            <p className="text-2xl font-display font-bold text-emerald-400">R 2,500.00</p>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50">
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold">Transaction History</h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-colors">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <th className="px-8 py-4">Transaction Details</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {mockTransactions.map((tx, i) => (
                                        <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-2xl ${tx.type === 'repayment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-600/10 text-blue-400'}`}>
                                                        {tx.type === 'repayment' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{tx.description}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            <span className="mx-2">•</span>
                                                            <span className="font-mono uppercase">{tx.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="success">Completed</Badge>
                                            </td>
                                            <td className={cn(
                                                "px-8 py-6 text-right font-display font-bold text-lg",
                                                tx.type === 'repayment' ? "text-emerald-400" : "text-blue-400"
                                            )}>
                                                {tx.type === 'repayment' ? '-' : '+'} R {tx.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default Statements;
