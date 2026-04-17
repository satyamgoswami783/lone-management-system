import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Search,
  Filter as FilterIcon,
  ArrowDownRight
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, StatCard, Badge, Toast } from '../../components/ui/Shared';

const ManagementReports = () => {
    const { applications, getExecutiveStats, getAnalyticsData } = useLoans();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [toast, setToast] = useState(null);

    const statsData = useMemo(() => getExecutiveStats(), [getExecutiveStats]);
    const analytics = useMemo(() => getAnalyticsData(), [getAnalyticsData]);

    const filteredApps = useMemo(() => {
        return applications.filter(app => {
            const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                app.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [applications, searchQuery, statusFilter]);

    const kpis = [
        { title: 'Portfolio Value', value: `R ${(applications.reduce((sum, a) => sum + Number(a.amount), 0)).toLocaleString()}`, icon: DollarSign, variant: 'primary' },
        { title: 'Total Revenue', value: `R ${Math.round(statsData.totalRevenue).toLocaleString()}`, icon: TrendingUp, variant: 'success' },
        { title: 'Default Rate', value: `${analytics.defaultRate}%`, icon: ArrowDownRight, variant: 'danger' },
        { title: 'Active Borrowers', value: statsData.activeClients.toString(), icon: Users, variant: 'primary' },
    ];

    const handleExportCSV = () => {
        if (filteredApps.length === 0) {
            setToast({ message: 'No records available to export for current filters.', type: 'warning' });
            return;
        }

        const headers = ['ID', 'Employee', 'Company', 'Amount', 'Status', 'Date', 'ID Number'];
        const rows = filteredApps.map((app) => [
            app.id ?? '',
            app.name ?? '',
            app.company ?? '',
            Number(app.amount || 0),
            app.status ?? '',
            app.date ? new Date(app.date).toLocaleDateString() : '',
            app.idNumber ?? ''
        ]);

        const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;
        const csvLines = [
            headers.map(escapeCsv).join(','),
            ...rows.map((row) => row.map(escapeCsv).join(','))
        ];
        const csvText = csvLines.join('\n');

        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `lms_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setToast({ message: `Exported ${filteredApps.length} records successfully.`, type: 'success' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <SectionHeader 
                    title="Financial Transparency Report" 
                    description="Real-time key performance indicators and verified financial health metrics."
                />
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-[24px] text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    <Download className="w-5 h-5" />
                    Download Multi-Lens CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <StatCard key={i} {...kpi} />
                ))}
            </div>

            {/* Filter Hub */}
            <div className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 w-full lg:max-w-md group focus-within:border-blue-500/50 transition-all">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 font-bold placeholder:text-slate-700 outline-none" 
                            placeholder="Filter by Name, Reference or ID..." 
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                            <FilterIcon className="w-4 h-4 text-slate-500" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-slate-300 focus:ring-0 cursor-pointer outline-none"
                            >
                                <option value="ALL">All Statuses</option>
                                {Object.values(STATUSES).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="h-10 w-px bg-slate-800 hidden lg:block" />
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Record Count</span>
                                <span className="text-xl font-bold text-white">{filteredApps.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/50 bg-slate-950/30">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Employee</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Company</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredApps.length > 0 ? filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-900/40 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 text-sm">{app.name}</p>
                                                <p className="text-[9px] text-slate-600 font-mono tracking-tighter">REF: {app.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-emerald-400">R {Number(app.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge variant={
                                            app.status === STATUSES.PAID ? 'success' : 
                                            app.status === STATUSES.ACTIVE ? 'primary' : 'warning'
                                        }>{app.status}</Badge>
                                    </td>
                                    <td className="px-6 py-5 underline decoration-slate-800 underline-offset-4 decoration-dashed">
                                        <span className="text-xs font-medium text-slate-400">{app.company}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-slate-500">{new Date(app.date).toLocaleDateString()}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-700 italic">No matching records found in this lens</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ManagementReports;
