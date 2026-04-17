import React, { useMemo } from 'react';
import { useLoans } from '../../context/LoanContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Calendar,
  Filter
} from 'lucide-react';
import { StatCard, SectionHeader } from '../../components/ui/Shared';

const dataPerformance = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

const dataRoles = [
  { name: 'Approved', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Rejected', value: 100 },
];

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];

const ManagementDashboard = () => {
  const { getExecutiveStats, getDisbursementTrends, getStatusDistribution } = useLoans();

  // 2. CONNECT DASHBOARD METRICS: Real-time aggregated stats
  const statsData = useMemo(() => getExecutiveStats(), [getExecutiveStats]);
  const trendData = useMemo(() => getDisbursementTrends(), [getDisbursementTrends]);
  const statusData = useMemo(() => getStatusDistribution(), [getStatusDistribution]);

  const stats = [
    {
      title: 'Total Revenue',
      value: `R ${Math.round(statsData.totalRevenue).toLocaleString()}`,
      icon: DollarSign,
      variant: 'success',
      trend: { type: 'up', value: 12 }
    },
    {
      title: 'Active Clients',
      value: statsData.activeClients.toString(),
      icon: Users,
      variant: 'primary',
      trend: { type: 'up', value: 5 }
    },
    {
      title: 'Portfolio Yield',
      value: `${statsData.yieldRate}%`,
      icon: TrendingUp,
      variant: 'warning'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-w-0 max-w-full">
      <SectionHeader
        title="Executive Insights"
        description="Real-time performance metrics and portfolio analytics synchronized with LMS core."
      // 7. ROLE ENFORCEMENT: Strictly read-only, actions hidden
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Chart */}
        <div className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Disbursement Trends</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Portfolio</span>
          </div>
          <div className="h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  itemStyle={{ color: '#3b82f6' }}
                  formatter={(value) => [`R ${value.toLocaleString()}`, 'Disbursed']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] border border-slate-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg lg:text-xl font-display font-bold">Application Status</h3>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Live Distribution</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-8 min-h-[400px] sm:min-h-[320px]">
            <div className="w-full h-64 sm:h-full max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 w-full sm:w-56 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between group/legend py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tight group-hover/legend:text-slate-200 transition-colors">{entry.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-200">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
