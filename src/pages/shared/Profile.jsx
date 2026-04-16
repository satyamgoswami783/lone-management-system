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

const Profile = () => {
    const { user, role } = useAuth();
    const [editing, setEditing] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <SectionHeader 
                title="Account Settings" 
                description="Manage your personal information, security preferences, and notification settings."
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-0 w-full h-24 bg-blue-600/5 blur-3xl"></div>
                        
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform">
                                {user?.name?.[0]}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 hover:text-white transition-all shadow-xl">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center justify-center gap-2">
                                {user?.name}
                                <BadgeCheck className="w-5 h-5 text-blue-400" />
                            </h2>
                            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">{role} Account</p>
                        </div>

                        <div className="w-full pt-6 border-t border-slate-800/50 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Member Since</span>
                                <span className="text-slate-200 font-bold">April 2026</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Security Level</span>
                                <Badge variant="success">High (2FA)</Badge>
                            </div>
                        </div>

                        <button 
                            onClick={() => setEditing(!editing)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all hover:bg-slate-800"
                        >
                            <Edit2 className="w-4 h-4" />
                            {editing ? 'Save Changes' : 'Edit Profile'}
                        </button>
                    </div>

                    <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-6">
                         <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">Trust & Verification</h3>
                         <div className="space-y-6">
                             <TrustItem icon={ShieldCheck} label="KYC Verified" status="Verified" color="text-emerald-500" />
                             <TrustItem icon={ShieldCheck} label="Employer Match" status="Confirmed" color="text-emerald-500" />
                             <TrustItem icon={ShieldAlert} label="Credit Rating" status="742 (Good)" color="text-blue-500" />
                         </div>
                    </div>
                </div>

                {/* Details Area */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="glass p-10 rounded-[40px] border-slate-800/50 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Contact Information</h3>
                                <div className="space-y-8">
                                    <ProfileField icon={Mail} label="Email Address" value={user?.email} editable={editing} />
                                    <ProfileField icon={Phone} label="Mobile Number" value="+27 (0) 82 123 4567" editable={editing} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Affiliation</h3>
                                <div className="space-y-8">
                                    <ProfileField icon={Building2} label="Company Name" value="TechFlow SA" editable={false} />
                                    <ProfileField icon={Lock} label="Employee ID" value="TF-90412" editable={false} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-800/50 space-y-6">
                             <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Account Security</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <SecuritySetting 
                                    icon={Settings} 
                                    title="Two-Factor Auth" 
                                    desc="Secure your account with 2FA" 
                                    enabled={true} 
                                 />
                                 <SecuritySetting 
                                    icon={Bell} 
                                    title="Push Notifications" 
                                    desc="Get alerts for loan status" 
                                    enabled={true} 
                                 />
                             </div>
                        </div>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[40px] flex items-center justify-between group cursor-pointer hover:bg-red-500/10 transition-all">
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-red-400">Request Data Deletion</h4>
                            <p className="text-xs text-red-500/50">Permanently remove your account and all associated loan data.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all">
                            Request Closure
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ icon: Icon, label, value, editable }) => (
    <div className="flex gap-4">
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 h-fit">
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
            {editable ? (
                <input 
                    type="text" 
                    defaultValue={value} 
                    className="bg-transparent border-none p-0 text-sm font-bold text-blue-400 focus:ring-0 w-full"
                />
            ) : (
                <p className="text-sm font-bold text-slate-200">{value}</p>
            )}
        </div>
    </div>
);

const SecuritySetting = ({ icon: Icon, title, desc, enabled }) => (
    <div className="p-6 bg-slate-950 rounded-[32px] border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-200">{title}</p>
                <p className="text-[10px] text-slate-600 font-medium">{desc}</p>
            </div>
        </div>
        <div className={`w-10 h-5 rounded-full p-1 transition-all ${enabled ? 'bg-blue-600' : 'bg-slate-800'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    </div>
);

const TrustItem = ({ icon: Icon, label, status, color }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-xs font-bold text-slate-400">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">{status}</span>
    </div>
);

export default Profile;
