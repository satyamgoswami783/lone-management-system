import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    ShieldCheck,
    Mail,
    Building2,
    Lock,
    Unlock,
    Edit2,
    Trash2,
    Key,
    Eye,
    Settings2
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { ROLES } from '../../context/AuthContext';
import UserModal from '../../components/admin/UserModal';

const STORAGE_KEY = 'lms_managed_users';

const UserManagement = () => {
    const navigate = useNavigate();

    // Initial users state with localStorage persistence
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved users', e);
            }
        }
        return [
            { id: 101, name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', role: ROLES.Employee, company: 'TechFlow SA', status: 'Active' },
            { id: 102, name: 'Marcus Kruger', email: 'm.kruger@outlook.com', role: ROLES.Employee, company: 'Global Logistics', status: 'Active' },
            { id: 103, name: 'Lerato Dlamini', email: 'lerato.d@finance.co.za', role: ROLES.Employee, company: 'Standard Bank', status: 'Inactive' },
            { id: 104, name: 'Brenda Nkomo', email: 'brenda.n@softserve.co.za', role: ROLES.Employee, company: 'SoftServe', status: 'Active' },
        ];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Save to localStorage whenever users change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }, [users]);

    // Filtering logic
    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    // Handlers
    const handleSaveUser = (userData) => {
        if (editingUser) {
            // Edit existing
            setUsers(users.map(u => u.id === editingUser.id ? { ...userData, id: u.id } : u));
            setToast({ message: 'Identity Access updated successfully', type: 'success' });
        } else {
            // Create new
            const newUser = {
                ...userData,
                id: Math.floor(Math.random() * 10000)
            };
            setUsers([newUser, ...users]);
            setToast({ message: 'New User enrolled successfully', type: 'success' });
        }
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('CRITICAL: Are you sure you want to terminate this user session? All associated data will be archived. This action is irreversible.')) {
            setUsers(users.filter(u => u.id !== id));
            setToast({ message: 'User Identity purged from active database', type: 'danger' });
        }
    };

    const handleToggleStatus = (id) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
                setToast({
                    message: `Security clearance pivoted to ${newStatus}`,
                    type: newStatus === 'Active' ? 'success' : 'info'
                });
                return { ...u, status: newStatus };
            }
            return u;
        }));
    };

    const handleResetPassword = (email) => {
        setToast({ message: `Secure reset vector dispatched to ${email}`, type: 'info' });
    };

    const handleViewDetails = (user) => {
        setToast({ message: `Accessing detailed audit for ${user.name}...`, type: 'info' });
        // In a real app, navigate to /admin/users/:id
    };

    const getRoleVariant = (role) => {
        switch (role) {
            case ROLES.ADMIN: return 'danger';
            case ROLES.HR: return 'warning';
            case ROLES.CREDIT: return 'primary';
            case ROLES.FINANCE: return 'success';
            default: return 'primary';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <SectionHeader
                    title="Employee Management"
                    description="Enterprise identity access control and real-time verification management."
                />
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setIsModalOpen(true);
                    }}
                    className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 rounded-[24px] text-sm font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 active:scale-95 uppercase tracking-widest whitespace-nowrap overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <UserPlus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Enroll New User</span>
                </button>
            </div>

            {/* List Controls */}
            <div className="glass p-8 rounded-[40px] space-y-8 bg-slate-900/40 border-slate-800/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-950 px-6 py-4 rounded-3xl border border-slate-800 w-full max-w-xl group focus-within:border-blue-600/50 transition-all shadow-inner">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 group-focus-within:scale-110 transition-transform" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold"
                            placeholder="Enter Name, Email or Role for deep search..."
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Ops Status:</span>
                        <div className="flex items-center gap-2.5 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 shadow-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Database Sync</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar rounded-[32px] border border-slate-800/50 shadow-2xl pb-48">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/80 border-b border-slate-800/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">System Privilege</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Organization Group</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clearance Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Gatekeeper Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u, index) => (
                                    <tr key={u.id} className="hover:bg-slate-900/60 transition-all group/row">
                                        <td className="px-8 py-8 text-nowrap">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xl text-slate-600 transition-all group-hover/row:border-blue-500/50 group-hover/row:text-blue-400 shadow-inner overflow-hidden">
                                                        {u.name[0]}
                                                        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                                                    </div>
                                                    {u.status === 'Active' && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-200 text-lg group-hover/row:text-white transition-colors truncate tracking-tight">{u.name}</p>
                                                    <p className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-1 italic">
                                                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-nowrap">
                                            <div className="flex flex-col items-start gap-2">
                                                <Badge variant={getRoleVariant(u.role)}>{u.role}</Badge>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950 rounded-lg border border-slate-800/50">
                                                    <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest italic leading-none">Vetted Provider</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-nowrap">
                                            <div className="flex items-center gap-3 text-sm font-black text-slate-400 group-hover/row:text-slate-200 transition-colors">
                                                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 border border-slate-800 shadow-inner">
                                                    <Building2 className="w-4 h-4" />
                                                </div>
                                                {u.company}
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-nowrap">
                                            <div className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border w-fit font-black transition-all ${u.status === 'Active'
                                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                    : 'bg-red-500/5 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]'
                                                    }`}></div>
                                                <span className="text-[10px] uppercase tracking-widest">{u.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right relative">
                                            <div className="flex justify-end gap-3 translate-x-2 group-hover/row:translate-x-0 transition-transform">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingUser(u);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-3 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-[18px] transition-all border border-transparent hover:border-blue-500/20 active:scale-90"
                                                    title="Edit Identity Profile"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(u.id);
                                                    }}
                                                    className={`p-3 rounded-[18px] transition-all border border-transparent active:scale-90 ${u.status === 'Active'
                                                            ? 'text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-500/20'
                                                            : 'text-amber-400 bg-amber-400/10 border-amber-500/20 hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-500/20'
                                                        }`}
                                                    title={u.status === 'Active' ? 'Invalidate Clearance' : 'Restore Clearance'}
                                                >
                                                    {u.status === 'Active' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-32 text-center bg-slate-950/20">
                                        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                                            <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-inner">
                                                <Search className="w-8 h-8 text-slate-700 animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black uppercase tracking-[0.3em] text-sm text-slate-300">Identity Not Found</p>
                                                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No matching records detected in live database</p>
                                            </div>
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all border border-slate-700"
                                            >
                                                Clear Search Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                userToEdit={editingUser}
            />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default UserManagement;


