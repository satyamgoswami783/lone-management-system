import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ROLES } from '../../context/AuthContext';

const UserModal = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ROLES.Employee,
        company: '',
        status: 'Active'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({
                name: '',
                email: '',
                role: ROLES.Employee,
                company: '',
                status: 'Active'
            });
        }
        setErrors({});
    }, [userToEdit, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'FullName is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.company) newErrors.company = 'Organization/Employer is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg glass rounded-[40px] border border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden bg-slate-900/90">
                <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                            {userToEdit ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-white tracking-tight">
                                {userToEdit ? 'Update User Identity' : 'Enroll New User'}
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                                Secure Identity Access Management
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Identity Name</label>
                        <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50'}`}>
                            <User className="w-5 h-5 text-slate-500" />
                            <input 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold" 
                                placeholder="e.g. Sarah Jenkins"
                            />
                        </div>
                        {errors.name && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Contact Email</label>
                        <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50'}`}>
                            <Mail className="w-5 h-5 text-slate-500" />
                            <input 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold" 
                                placeholder="name@domain.com"
                                type="email"
                            />
                        </div>
                        {errors.email && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Privilege</label>
                            <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all">
                                <Shield className="w-5 h-5 text-slate-500" />
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 font-bold appearance-none cursor-pointer"
                                >
                                    {Object.entries(ROLES).map(([key, value]) => (
                                        <option key={value} value={value} className="bg-slate-900">{key}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Status</label>
                            <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all">
                                <div className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 font-bold appearance-none cursor-pointer"
                                >
                                    <option value="Active" className="bg-slate-900 text-emerald-400">Active</option>
                                    <option value="Inactive" className="bg-slate-900 text-red-400">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employer / Organization</label>
                        <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.company ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50'}`}>
                            <Building2 className="w-5 h-5 text-slate-500" />
                            <input 
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold" 
                                placeholder="e.g. TechFlow SA"
                            />
                        </div>
                        {errors.company && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.company}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 no-print">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {userToEdit ? 'Commit Changes' : 'Confirm Access'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
