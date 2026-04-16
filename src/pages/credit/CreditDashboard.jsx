import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Search,
  CheckCircle2,
  XCircle,
  FileSearch,
  BarChart3
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const CreditDashboard = () => {
    const stats = [
        { title: 'In Queue', value: '18', icon: FileSearch, variant: 'primary' },
        { title: 'High Risk', value: '4', icon: AlertTriangle, variant: 'danger' },
        { title: 'Approved Today', value: '22', icon: ShieldCheck, variant: 'success' },
    ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Credit Assessment" 
        description="Analyze risk profiles and recommend loan approvals."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass rounded-[32px] overflow-hidden border border-slate-800/50">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">Assessment Queue</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input className="input-field pl-9 py-1.5 text-sm w-64" placeholder="Search applicant..." />
                </div>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-800/50">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {[
                        { name: 'Sarah Jenkins', score: '680', risk: 'Low', rVar: 'success' },
                        { name: 'Michael Chen', score: '540', risk: 'Medium', rVar: 'warning' },
                        { name: 'Lerato Molefe', score: '420', risk: 'High', rVar: 'danger' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-200">{row.name}</td>
                            <td className="px-6 py-4 text-sm text-slate-400">{row.score}</td>
                            <td className="px-6 py-4">
                                <Badge variant={row.rVar}>{row.risk}</Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="px-4 py-2 rounded-xl bg-blue-600/10 text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Review Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="glass p-6 rounded-[32px] border border-slate-800/50 space-y-6">
            <h3 className="text-lg font-display font-bold">Credit Policy Stats</h3>
            <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                        <span>Avg. Credit Score</span>
                        <span className="text-blue-400 text-base">612</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Rejection Rate</p>
                        <p className="text-xl font-display font-bold text-red-400">14.2%</p>
                    </div>
                    <div className="p-2 bg-red-400/10 rounded-lg text-red-400">
                        <TrendingUp className="w-5 h-5 rotate-180" />
                    </div>
                </div>
            </div>
            <button className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Detailed Risk Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreditDashboard;
