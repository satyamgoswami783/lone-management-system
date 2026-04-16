import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  FileText,
  BadgeCheck,
  XCircle,
  Clock
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useAuth } from '../../context/AuthContext';

const HistoryPage = ({ title }) => {
    const { applications } = useLoans();
    const { user } = useAuth();

    // Determine what history is relevant based on the user's role
    // For HR: Show history of their company
    // For Finance: Show history of payouts
    // For Credit: Show history of reviews
    // For Recovery: Show history of collections
    
    let filteredHistory = applications;
    
    if (user?.role === 'hr') {
        filteredHistory = applications.filter(app => app.company === user.company);
    } else if (user?.role === 'finance') {
        filteredHistory = applications.filter(app => [STATUSES.DISBURSED, STATUSES.ADMIN_APPROVED].includes(app.status));
    } else if (user?.role === 'recovery') {
        filteredHistory = applications.filter(app => [STATUSES.DEFAULTED, STATUSES.CLOSED].includes(app.status));
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader 
                title={title || "Action History"} 
                description="View a complete audit trail of past loan applications and system actions."
            />

            <div className="glass p-8 rounded-[40px] space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 w-full max-w-md">
                        <Search className="w-5 h-5 text-slate-500 ml-2" />
                        <input className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200" placeholder="Search by ID, applicant, or company..." />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event / Action</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Final Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredHistory.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-200">{new Date(app.date).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-mono">{new Date(app.date).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-blue-400">
                                                {app.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-slate-300">{app.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            {app.status === STATUSES.DISBURSED ? (
                                                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                                            ) : app.status === STATUSES.DECLINED ? (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-blue-500" />
                                            )}
                                            {app.status === STATUSES.DISBURSED ? "Funds Successfully Disbursed" : `Moved to ${app.status}`}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge 
                                            variant={
                                                app.status === STATUSES.DISBURSED ? 'success' : 
                                                (app.status === STATUSES.DECLINED || app.status === STATUSES.HR_REJECTED) ? 'danger' : 'primary'
                                            }
                                        >
                                            {app.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-xs font-mono text-slate-500">{app.id}</span>
                                    </td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Clock className="w-12 h-12 text-slate-800" />
                                            <p className="text-slate-500 font-medium">No history found for this view.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
