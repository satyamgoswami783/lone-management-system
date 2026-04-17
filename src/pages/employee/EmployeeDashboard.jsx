import React from 'react';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your loans."
        actions={
          <button
            onClick={() => navigate('/employee/apply')}
            className="btn-primary flex items-center gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            Apply New Loan
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Loan Status"
          value="Active"
          subValue="Monthly Installments"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Current Balance"
          value="R 4,250.00"
          subValue="Total Outstanding"
          icon={Wallet}
        />
        <StatCard
          title="Next Deduction"
          value="25 Apr 2026"
          subValue="Payroll Deduction"
          icon={Calendar}
          variant="warning"
        />
        <StatCard
          title="Eligibility"
          value="R 9,000.00"
          subValue="Available to borrow"
          icon={ArrowUpRight}
          variant="primary"
          trend={{ type: 'up', value: 15 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold">Recent Activity</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="glass rounded-3xl overflow-hidden border border-slate-800/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] lg:min-w-0">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[
                    { ref: 'LMS-9021', date: '12 Apr 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                    { ref: 'LMS-8842', date: '25 Mar 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                    { ref: 'LMS-1029', date: '10 Mar 2026', amount: 'R 4,500.00', status: 'Disbursed', sVar: 'primary' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-300">{row.ref}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-200">{row.amount}</td>
                      <td className="px-6 py-4">
                        <Badge variant={row.sVar}>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Requests */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold px-2">Requests & Letters</h2>
          <div className="glass p-6 rounded-3xl space-y-4">
            <button
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-medium">Settlement Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-medium">Paid-Up Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-medium">Confirmation Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
