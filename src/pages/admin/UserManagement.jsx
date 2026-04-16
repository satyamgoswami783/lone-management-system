import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  ShieldCheck, 
  Mail, 
  Building2,
  Lock,
  Edit2
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { ROLES } from '../../context/AuthContext';

const UserManagement = () => {
    // Mock user data (filtered to show only applicants)
    const [users] = useState([
        { id: 5, name: 'John Doe', email: 'john@gmail.com', role: ROLES.APPLICANT, company: 'TechFlow SA', status: 'Active' },
        { id: 6, name: 'Jane Smith', email: 'jane@outlook.com', role: ROLES.APPLICANT, company: 'Global Logistics', status: 'Active' },
        { id: 7, name: 'Robert Brown', email: 'robert@finance.co.za', role: ROLES.APPLICANT, company: 'Standard Bank', status: 'Active' },
    ]);


    const getRoleVariant = (role) => {
        switch(role) {
            case ROLES.ADMIN: return 'danger';
            case ROLES.HR: return 'warning';
            case ROLES.CREDIT: return 'primary';
            case ROLES.FINANCE: return 'success';
            default: return 'primary';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <SectionHeader 
                    title="Applicant Management" 
                    description="Manage loan applicants, verify information, and monitor system access."
                />
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                    <UserPlus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            <div className="glass p-8 rounded-[40px] space-y-6">
                <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 w-full max-w-md">
                    <Search className="w-5 h-5 text-slate-500 ml-2" />
                    <input className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200" placeholder="Search by name, email or role..." />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Permission</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employer / Organization</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:scale-110 transition-transform">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{u.name}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                Verified Provider
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Building2 className="w-4 h-4 text-slate-500" />
                                            {u.company}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-sm font-medium text-slate-400">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                <Lock className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
