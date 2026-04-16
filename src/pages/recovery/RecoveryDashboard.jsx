import React from 'react';
import { 
  Users, 
  Receipt, 
  AlertTriangle, 
  Search,
  Filter,
  Phone,
  MessageSquare,
  History
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const RecoveryDashboard = () => {
    const stats = [
        { title: 'Accounts in Default', value: '142', icon: AlertTriangle, variant: 'danger' },
        { title: 'Recovered This Month', value: 'R 64,250', icon: Receipt, variant: 'success' },
        { title: 'Pending Contact', value: '28', icon: Phone, variant: 'warning' },
    ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Recovery & Collections" 
        description="Track and manage repayments for defaulted or exited employee loans."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50">
        <div className="p-6 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-display font-bold">Defaulted Accounts</h2>
            <div className="flex gap-2">
                <input className="input-field py-1.5 text-sm w-64" placeholder="Search debtor..." />
                <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Debtor</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Payment</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[
              { name: 'Sarah Jenkins', balance: 'R 8,250', last: '12 Jan 2026', status: 'In Arrears', sVar: 'danger' },
              { name: 'David Smith', balance: 'R 1,500', last: '25 Feb 2026', status: 'Promise to Pay', sVar: 'warning' },
              { name: 'Michael Chen', balance: 'R 4,200', last: 'Never', status: 'Handed Over', sVar: 'danger' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">{row.name}</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-400">{row.balance}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.last}</td>
                <td className="px-6 py-4">
                  <Badge variant={row.sVar}>{row.status}</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-500 hover:text-blue-400 rounded-lg transition-colors" title="Contact"><Phone className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors" title="Message"><MessageSquare className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-500 hover:text-purple-400 rounded-lg transition-colors" title="History"><History className="w-4 h-4" /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecoveryDashboard;
