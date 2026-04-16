import React, { useState } from 'react';
import {
    UserCircle,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    ShieldAlert,
    Settings,
    Bell,
    Lock,
    Edit2,
    Camera,
    BadgeCheck
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Profile = () => {
    const { user, role } = useAuth();
    const [editing, setEditing] = useState(false);

    return (
        <div className="space-y-8 animate-in duration-700 pb-20">
            <SectionHeader
                title="Account Settings"
                description="Manage your personal information, security preferences, and notification settings."
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Profile Card */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="glass p-10 rounded-[48px] border-slate-800 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-sm transition-all hover:shadow-xl">
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 blur-[80px]"></div>

                        <div className="relative">
                            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                {user?.name?.[0]}
                            </div>
                            <button className="absolute -bottom-3 -right-3 p-3 bg-white border border-slate-800 rounded-2xl text-blue-600 hover:text-blue-500 transition-all shadow-xl hover:scale-110">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h2 className="text-3xl font-display font-bold text-slate-200 flex items-center justify-center gap-3">
                                {user?.name}
                                <BadgeCheck className="w-6 h-6 text-blue-500" />
                            </h2>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{role} Account</p>
                        </div>

                        <div className="w-full pt-8 border-t border-slate-800 space-y-5 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Since</span>
                                <span className="text-sm font-bold text-slate-200">April 2026</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Level</span>
                                <Badge variant="success">High (2FA Active)</Badge>
                            </div>
                        </div>

                        <button
                            onClick={() => setEditing(!editing)}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-200 transition-all hover:bg-white hover:border-blue-500 group relative z-10"
                        >
                            <Edit2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            {editing ? 'Confirm Changes' : 'Modify Profile'}
                        </button>
                    </div>

                    <div className="glass p-10 rounded-[48px] border-slate-800 space-y-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Trust & Verification</h3>
                        <div className="space-y-8">
                            <TrustItem icon={ShieldCheck} label="KYC Identification" status="Verified" color="text-emerald-500" />
                            <TrustItem icon={ShieldCheck} label="Employer Confirmation" status="Confirmed" color="text-emerald-500" />
                            <TrustItem icon={BadgeCheck} label="Consolidated Score" status="742 (Good)" color="text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Details Area */}
                <div className="xl:col-span-2 space-y-10">
                    <div className="glass p-12 rounded-[60px] border-slate-800 space-y-12 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] border-b border-slate-800 pb-4">Personal Association</h3>
                                <div className="space-y-10">
                                    <ProfileField icon={Mail} label="Email Address" value={user?.email} editable={editing} />
                                    <ProfileField icon={Phone} label="Mobile Contact" value="+27 (0) 82 123 4567" editable={editing} />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] border-b border-slate-800 pb-4">Entity Information</h3>
                                <div className="space-y-10">
                                    <ProfileField icon={Building2} label="Employer Name" value="TechFlow South Africa" editable={false} />
                                    <ProfileField icon={Lock} label="Employee Reference" value="TF-90412" editable={false} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-slate-800 space-y-8">
                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Account Security Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SecuritySetting
                                    icon={Settings}
                                    title="Two-Factor Auth"
                                    desc="Multi-layer protocol active"
                                    enabled={true}
                                />
                                <SecuritySetting
                                    icon={Bell}
                                    title="Push Notifications"
                                    desc="Live loan status alerts"
                                    enabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 rounded-[48px] bg-red-50 border border-red-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-red-500 transition-all duration-500 shadow-sm">
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-red-600">Request Data Erasure</h4>
                            <p className="text-sm text-red-400 font-medium">Permanently remove your profile and all financial log history.</p>
                        </div>
                        <button className="px-10 py-3.5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all">
                            Terminate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ icon: Icon, label, value, editable }) => (
    <div className="flex gap-6 group/field">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 h-fit group-hover/field:border-blue-500/50 transition-all">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</p>
            {editable ? (
                <input
                    type="text"
                    defaultValue={value}
                    className="bg-transparent border-none p-0 text-lg font-bold text-blue-600 focus:ring-0 w-full tracking-tight"
                />
            ) : (
                <p className="text-lg font-bold text-slate-200 tracking-tight">{value}</p>
            )}
        </div>
    </div>
);

const SecuritySetting = ({ icon: Icon, title, desc, enabled }) => (
    <div className="p-8 bg-white rounded-[32px] border border-slate-800 flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm">
        <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-900 rounded-[20px] border border-slate-800 text-slate-500 group-hover:text-blue-500 transition-colors">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-lg font-bold text-slate-200">{title}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{desc}</p>
            </div>
        </div>
        <div className={cn("w-14 h-7 rounded-full p-1.5 transition-all cursor-pointer shadow-inner", 
            enabled ? 'bg-blue-600' : 'bg-slate-700'
        )}>
            <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-md", 
                enabled ? 'translate-x-7' : 'translate-x-0'
            )} />
        </div>
    </div>
);

const TrustItem = ({ icon: Icon, label, status, color }) => (
    <div className="flex items-center justify-between p-1">
        <div className="flex items-center gap-4">
            <div className={cn("p-1.5 rounded-lg bg-slate-900 border border-slate-800", color)}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-300">{label}</span>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
    </div>
);

export default Profile;
