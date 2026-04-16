import React, { useState } from 'react';
import {
    FileUp,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Search,
    Database,
    RefreshCw,
    FileSpreadsheet,
    Download,
    ShieldCheck,
    Activity
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';

const Reconciliation = () => {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [toast, setToast] = useState(null);
    const { applications, batchMarkAsPaid } = useLoans();

    // TARGET: Loans that are currently ACTIVE
    const activeLoans = applications.filter(app => app.status === STATUSES.ACTIVE);

    const handleUpload = () => {
        if (!file) return;
        setProcessing(true);

        // Simulate advanced matching engine logic
        setTimeout(() => {
            // In a real app, we would parse the CSV here
            // For now, we simulate matching based on active loans
            const matchedIds = activeLoans.slice(0, Math.ceil(activeLoans.length * 0.8)).map(a => a.id);
            const exceptions = activeLoans.filter(a => !matchedIds.includes(a.id)).map(a => ({
                id: a.id,
                name: a.name,
                reason: Math.random() > 0.5 ? 'Partial Payment Detected' : 'Employer Reference Mismatch'
            }));

            setResults({
                totalRows: activeLoans.length + 5, // mock 5 extra random rows
                matched: matchedIds,
                exceptions: exceptions,
                valueMatched: matchedIds.reduce((sum, id) => sum + (applications.find(a => a.id === id)?.amount || 0) * 0.1, 0), // Assuming 10% installment
            });
            setProcessing(false);
            setToast({ message: 'Matching complete. Review exceptions before applying.', type: 'info' });
        }, 2000);
    };

    const handleApplyReconciliation = () => {
        if (!results || results.matched.length === 0) return;

        try {
            const batchResults = batchMarkAsPaid(results.matched, 'Payroll Reconciliation Engine');

            // Show detailed feedback as requested
            const successCount = batchResults.success.length;
            const failCount = batchResults.failed.length;

            setToast({
                message: `Reconciliation Processed: ${successCount} Successful, ${failCount} Failed.`,
                type: failCount > 0 ? 'warning' : 'success'
            });

            // Update results view with actual processing outcomes
            setResults(prev => ({
                ...prev,
                processingReport: batchResults
            }));

            // Optionally clear the file and list after a delay or based on user flow
            setTimeout(() => {
                setResults(null);
                setFile(null);
            }, 3000);

        } catch (error) {
            setToast({ message: 'Critical error during reconciliation execution.', type: 'danger' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Payroll Reconciliation Engine"
                description="Match incoming employer deduction files against active loan accounts to automate repayment processing."
            />

            {!results ? (
                <div className="glass p-16 rounded-[48px] text-center space-y-8 border-dashed border-slate-700/50 shadow-2xl bg-slate-900/10">
                    <div className="w-28 h-28 bg-blue-600/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 text-blue-400 shadow-inner group transition-all hover:scale-105">
                        <FileSpreadsheet className="w-12 h-12 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                        <h3 className="text-2xl font-display font-bold text-white tracking-tight">Import Deduction File</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Upload your automated payroll deduction file (CSV/XLSX). The system will strictly match transactions with <span className="text-blue-400">ACTIVE</span> loans.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className={`px-10 py-5 rounded-2xl border-2 border-dashed transition-all flex items-center gap-4 ${file ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-400'}`}>
                                <FileUp className="w-6 h-6" />
                                <span className="font-black uppercase tracking-widest text-[10px]">{file ? file.name : 'Choose File to Upload'}</span>
                            </div>
                        </div>

                        {file && (
                            <button
                                onClick={handleUpload}
                                disabled={processing}
                                className="btn-primary w-full max-w-sm flex items-center justify-center gap-3 py-5 rounded-[24px] shadow-2xl shadow-blue-600/20"
                            >
                                {processing ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Running Matching Engine...
                                    </>
                                ) : (
                                    <>
                                        Start Reconciliation
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        )}

                        <div className="flex items-center gap-6">
                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Download Template
                            </button>
                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700">
                                <ShieldCheck className="w-4 h-4" />
                                256-bit Encrypted
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <ReconStat title="Total Records" value={results.totalRows} icon={Database} color="text-blue-400" />
                        <ReconStat title="Auto-Matched" value={results.matched.length} icon={CheckCircle2} color="text-emerald-400" />
                        <ReconStat title="Exceptions" value={results.exceptions.length} icon={AlertCircle} color="text-red-400" />
                        <ReconStat title="Matched Value" value={`R ${results.valueMatched.toLocaleString()}`} icon={Activity} color="text-amber-400" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-10 rounded-[48px] space-y-8 border-slate-800/50 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-display font-bold text-white tracking-tight">Exceptions Required Attention</h4>
                                <Badge variant="danger">{results.exceptions.length} Conflicts</Badge>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {results.exceptions.length > 0 ? results.exceptions.map((ex, i) => (
                                    <div key={i} className="bg-slate-900/50 p-5 rounded-3xl border border-red-500/10 flex items-center justify-between group hover:border-red-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                                                <AlertCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{ex.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic mt-0.5">{ex.reason}</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-xl bg-slate-800 text-[10px] font-black uppercase tracking-widest text-blue-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-700">
                                            Fix Manual
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-slate-600 text-sm font-medium py-10 text-center uppercase tracking-widest">No exceptions detected</p>
                                )}
                            </div>
                        </div>

                        <div className="glass p-10 rounded-[48px] space-y-8 border-slate-800/50 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-display font-bold text-white tracking-tight">Matched for Bulk Update</h4>
                                <Badge variant="success">{results.matched.length} Verified</Badge>
                            </div>
                            <div className="space-y-4 flex-grow">
                                {results.matched.slice(0, 5).map((id, i) => {
                                    const app = applications.find(a => a.id === id);
                                    return (
                                        <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">
                                                    {app?.name[0]}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-300">{app?.name}</span>
                                                    <p className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-tighter italic">Status: Active</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-mono text-emerald-400 font-black">R {(app?.amount * 0.1).toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                                {results.matched.length > 5 && (
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] text-center mt-2">
                                        + {results.matched.length - 5} more records identified
                                    </p>
                                )}
                            </div>
                            <div className="pt-8 space-y-4">
                                <button
                                    onClick={handleApplyReconciliation}
                                    className="w-full py-5 rounded-[24px] bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95"
                                >
                                    Apply Repayments & Close Loans
                                </button>
                                <button
                                    onClick={() => { setResults(null); setFile(null); }}
                                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-all"
                                >
                                    Abort Reconciliation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

const ReconStat = ({ title, value, icon: Icon, color }) => (
    <div className="glass p-8 rounded-[32px] space-y-3 border-slate-800/50 shadow-xl group hover:border-slate-700 transition-all">
        <div className={`p-3 rounded-2xl bg-slate-900 inline-block mb-1 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-3xl font-display font-black text-slate-100 italic tracking-tighter">{value}</p>
            <p className="text-[10px] uppercase font-black text-slate-600 tracking-[0.2em] mt-1">{title}</p>
        </div>
    </div>
);

export default Reconciliation;
