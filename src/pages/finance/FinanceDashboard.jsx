import React from 'react';
import { 
  CreditCard, 
  Receipt, 
  ArrowDownCircle, 
  Download,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const FinanceDashboard = () => {
    const stats = [
        { title: 'Pending Payout', value: 'R 142,500', icon: CreditCard, variant: 'warning' },
        { title: 'Total Disbursed', value: 'R 8.2M', icon: Receipt, variant: 'success' },
        { title: 'Failed Payments', value: '0', icon: AlertCircle, variant: 'neutral' },
    ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Finance & Payouts" 
        description="Process approved loan disbursements and manage historical records."
        actions={
            <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Generate Payout File
            </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50">
        <div className="p-6 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-display font-bold">Payout Queue</h2>
            <div className="flex gap-2">
                <button className="px-4 py-2 glass rounded-xl text-blue-400 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Batch Select</button>
                <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[
              { name: 'Sarah Jenkins', bank: 'Standard Bank - 1234', amount: 'R 5,000', date: 'Just now' },
              { name: 'David Smith', bank: 'Absa - 9921', amount: 'R 9,000', date: '12 mins ago' },
              { name: 'Michael Chen', bank: 'First National - 4421', amount: 'R 3,500', date: '1 hour ago' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">{row.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.bank}</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-200">{row.amount}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.date}</td>
                <td className="px-6 py-4 text-right">
                    <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all">Disburse</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceDashboard;
