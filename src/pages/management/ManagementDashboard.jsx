import React from 'react';
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
    const stats = [
        { title: 'Total Revenue', value: 'R 2.4M', icon: DollarSign, variant: 'success', trend: { type: 'up', value: 12 } },
        { title: 'Active Clients', value: '842', icon: Users, variant: 'primary', trend: { type: 'up', value: 5 } },
        { title: 'Portfolio Yield', value: '18.4%', icon: TrendingUp, variant: 'warning' },
    ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Executive Insights" 
        description="High-level performance metrics and portfolio analytics."
        actions={
            <div className="flex gap-2">
                <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                </button>
                <button className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>
        }
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last 6 Months</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataPerformance}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R${value/1000}k`} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                    itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold">Application Status</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Distribution</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-80">
            <div className="w-full h-full max-w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dataRoles}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {dataRoles.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full sm:w-48">
                {dataRoles.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-sm text-slate-400 font-medium">{entry.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200">{entry.value}</span>
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
