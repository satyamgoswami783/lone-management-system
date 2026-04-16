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
  Download
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';

const Reconciliation = () => {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const { applications } = useLoans();

    const handleUpload = () => {
        setProcessing(true);
        // Simulate processing delay
        setTimeout(() => {
            setResults({
                totalRows: 124,
                matched: 120,
                exceptions: 4,
                valueMatched: 45000,
                exceptionsList: [
                    { id: 'EMP-902', name: 'John Peterson', reason: 'Insufficient deduction amount' },
                    { id: 'EMP-114', name: 'Thabo Mbeki', reason: 'Employee not found in active list' },
                ]
            });
            setProcessing(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader 
                title="Payroll Reconciliation" 
                description="Import employer deduction files and match payments against active loan accounts."
            />

            {!results ? (
                <div className="glass p-12 rounded-[40px] text-center space-y-8 border-dashed border-slate-700/50">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 text-blue-400">
                        <FileSpreadsheet className="w-10 h-10" />
                    </div>
                    <div className="max-w-md mx-auto space-y-4">
                        <h3 className="text-2xl font-display font-bold">Import Deduction File</h3>
                        <p className="text-slate-500 text-sm">Upload the Excel or CSV file provided by the employer payroll system to start the matching process.</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <div className={`px-8 py-4 rounded-2xl border-2 border-dashed transition-all flex items-center gap-3 ${file ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-400'}`}>
                                <FileUp className="w-5 h-5" />
                                <span className="font-bold">{file ? file.name : 'Choose File to Upload'}</span>
                            </div>
                        </div>
                        
                        {file && (
                            <button 
                                onClick={handleUpload}
                                disabled={processing}
                                className="btn-primary w-full max-w-xs flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Processing Matching Engine...
                                    </>
                                ) : (
                                    <>
                                        Start Reconciliation
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                        
                        <button className="text-sm font-bold text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-2 mt-4">
                            <Download className="w-4 h-4" />
                            Download Template CSV
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <ReconStat title="Total Records" value={results.totalRows} icon={Database} color="text-blue-400" />
                        <ReconStat title="Auto-Matched" value={results.matched} icon={CheckCircle2} color="text-emerald-400" />
                        <ReconStat title="Exceptions" value={results.exceptions} icon={AlertCircle} color="text-red-400" />
                        <ReconStat title="Matched Value" value={`R ${results.valueMatched.toLocaleString()}`} icon={RefreshCw} color="text-amber-400" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-[40px] space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-display font-bold">Exceptions Requiring Attention</h4>
                                <Badge variant="danger">{results.exceptions} Pending</Badge>
                            </div>
                            <div className="space-y-4">
                                {results.exceptionsList.map((ex, i) => (
                                    <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-red-500/10 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
                                                <AlertCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{ex.name}</p>
                                                <p className="text-xs text-slate-500 font-mono italic">{ex.reason}</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                            Fix Manual
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-8 rounded-[40px] space-y-6">
                            <h4 className="text-xl font-display font-bold">Recently Matched Payments</h4>
                            <div className="space-y-4">
                                {applications.slice(0, 4).map((app, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">
                                                {app.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-slate-300">{app.name}</span>
                                        </div>
                                        <span className="text-sm font-mono text-emerald-400 font-bold">R {(app.amount * 0.1).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setResults(null)}
                                className="w-full py-3 rounded-2xl border border-slate-800 text-sm font-bold text-slate-500 hover:text-white hover:border-slate-600 transition-all"
                            >
                                Start New Reconciliation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ReconStat = ({ title, value, icon: Icon, color }) => (
    <div className="glass p-6 rounded-3xl space-y-2 border-slate-800/50">
        <Icon className={`w-5 h-5 ${color}`} />
        <p className="text-2xl font-display font-bold text-slate-100">{value}</p>
        <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">{title}</p>
    </div>
);

export default Reconciliation;
