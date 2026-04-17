import React, { useRef, useState } from 'react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { Receipt, Calendar, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import html2pdf from 'html2pdf.js';
import { cleanupHtml2PdfArtifacts } from '../../utils/pdfCleanup';

const Statements = () => {
    const { applications } = useLoans();
    const activeLoan = applications.find(app => app.status === STATUSES.DISBURSED);
    const statementRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState(null);

    const mockTransactions = [
        { id: 'TX-9021', date: '2024-03-31', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-8842', date: '2024-02-28', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-1029', date: '2024-01-31', description: 'Initial Loan Disbursement', amount: 5000, type: 'disbursement' },
    ];

    const handleDownloadPdf = async () => {
        const target = statementRef.current;
        if (!target) {
            setToast({ type: 'danger', message: 'Statement content is not ready. Please retry.' });
            return;
        }
        try {
            setIsDownloading(true);
            setToast({ type: 'info', message: 'Preparing statement PDF...' });
            cleanupHtml2PdfArtifacts();
            await html2pdf()
                .set({
                    margin: 8,
                    filename: `Statement-${activeLoan?.id || 'Loan'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                })
                .from(target)
                .save();
            setToast({ type: 'success', message: 'Statement PDF downloaded successfully.' });
        } catch (error) {
            window.print();
            setToast({
                type: 'info',
                message: `PDF export fallback opened print dialog${error?.message ? ` (${error.message})` : ''}.`,
            });
        } finally {
            cleanupHtml2PdfArtifacts();
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <SectionHeader
                title="Repayment Statements"
                description="View your active loan balance and transaction history."
            />

            {!activeLoan ? (
                <div className="glass p-6 sm:p-12 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-bold">No Active Statements</h3>
                    <p className="text-slate-500 max-w-md">Statements are only generated once your loan has been approved and disbursed.</p>
                </div>
            ) : (
                <div className="space-y-8" ref={statementRef}>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="glass p-6 rounded-3xl bg-blue-600/5 border-blue-500/10">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Balance</p>
                            <p className="text-2xl lg:text-3xl font-display font-bold">R 2,500.00</p>
                        </div>
                        <div className="glass p-6 rounded-3xl">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Next Payment</p>
                            <p className="text-2xl font-display font-bold">R 1,250.00</p>
                            <p className="text-[10px] text-emerald-400 mt-1 font-bold">DUE: 30 APR 2024</p>
                        </div>
                        <div className="glass p-6 rounded-3xl sm:col-span-2 lg:col-span-1">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Total Repaid</p>
                            <p className="text-2xl font-display font-bold text-emerald-400">R 2,500.00</p>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50">
                        <div className="p-6 md:p-8 border-b border-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-display font-bold">Transaction History</h2>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                {isDownloading ? (
                                    'Generating PDF...'
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Download PDF Statement</span>
                                        <span className="sm:hidden">Download</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
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
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            <span className="mx-2 opacity-30">•</span>
                                                            <span className="font-mono">{tx.id}</span>
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

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-slate-800/40">
                            {mockTransactions.map((tx) => (
                                <div key={tx.id} className="p-6 space-y-4 hover:bg-slate-800/20 active:bg-slate-800/40 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${tx.type === 'repayment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-600/10 text-blue-400'}`}>
                                                {tx.type === 'repayment' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-200">{tx.description}</p>
                                                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{tx.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/30">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </div>
                                        <p className={`font-display font-black text-xl ${tx.type === 'repayment' ? "text-emerald-400" : "text-blue-400"}`}>
                                            {tx.type === 'repayment' ? '-' : '+'} R {tx.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
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
