import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  DollarSign, 
  Calendar,
  Download
} from 'lucide-react';
import { SectionHeader, StatCard } from '../../components/ui/Shared';

const ManagementReports = () => {
    const kpis = [
        { title: 'Portfolio Value', value: 'R 2.4M', icon: DollarSign, variant: 'primary', trend: { type: 'up', value: 15 } },
        { title: 'Collection Rate', value: '98.2%', icon: TrendingUp, variant: 'success', trend: { type: 'up', value: 2 } },
        { title: 'Default Rate', value: '1.4%', icon: ArrowDownRight, variant: 'danger', trend: { type: 'down', value: 0.5 } },
        { title: 'Active Borrowers', value: '1,240', icon: Users, variant: 'primary', trend: { type: 'up', value: 8 } },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <SectionHeader 
                    title="Executive Insights" 
                    description="Real-time key performance indicators and financial health metrics."
                />
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all shadow-xl">
                    <Download className="w-4 h-4" />
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <StatCard key={i} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Growth Chart Mockup */}
                <div className="glass p-8 rounded-[40px] space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold">Disbursement Trends</h3>
                        <div className="flex gap-2">
                            {['7D', '1M', '6M', '1Y'].map(t => (
                                <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold ${t === '1M' ? 'bg-blue-600' : 'bg-slate-950 text-slate-500'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-2 px-2">
                        {[40, 60, 45, 90, 65, 80, 55, 75, 95, 100, 85, 90].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group transition-all hover:bg-blue-600/40" style={{ height: `${h}%` }}>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-600 rounded-t-lg shadow-[0_0_15px_rgba(37,99,235,0.3)]"></div>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-slate-800 whitespaces-nowrap pointer-events-none">
                                    R {h * 1000}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="glass p-8 rounded-[40px] space-y-8">
                    <h3 className="text-xl font-display font-bold">Portfolio Risk Profile</h3>
                    <div className="flex gap-8 items-center h-full">
                        <div className="w-48 h-48 rounded-full border-[16px] border-slate-900 relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500 border-l-transparent border-b-transparent rotate-45"></div>
                            <div className="text-center">
                                <p className="text-3xl font-display font-bold">92%</p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold">Low Risk</p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            {[
                                { label: 'Low Risk (A+)', value: 84, color: 'bg-emerald-500' },
                                { label: 'Medium Risk (B)', value: 12, color: 'bg-blue-500' },
                                { label: 'High Risk (C)', value: 4, color: 'bg-red-500' },
                            ].map(item => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400">{item.label}</span>
                                        <span className="text-slate-200">{item.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementReports;
