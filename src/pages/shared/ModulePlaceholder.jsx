import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Construction, 
  ArrowLeft, 
  BarChart3, 
  Settings, 
  Lock,
  Layers
} from 'lucide-react';
import { SectionHeader } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const ModulePlaceholder = ({ title, description }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const moduleName = title || pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ');

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative">
                <div className="w-32 h-32 rounded-[40px] bg-blue-600/10 border-2 border-dashed border-blue-500/20 flex items-center justify-center text-blue-400 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Construction className="w-12 h-12" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-xl">
                    <Layers className="w-6 h-6" />
                </div>
            </div>

            <div className="text-center space-y-4 max-w-lg mx-auto">
                <SectionHeader 
                    title={`${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module`}
                    description={description || "This specialized module is currently under development to meet specific workflow requirements."}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-8">
                <FeatureMetric icon={BarChart3} label="Data Tracking" status="Ready" />
                <FeatureMetric icon={Settings} label="Configurations" status="Pending" />
                <FeatureMetric icon={Lock} label="Field Isolation" status="Active" />
            </div>

            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-800"
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Previous Page
            </button>
        </div>
    );
};

const FeatureMetric = ({ icon: Icon, label, status }) => (
    <div className="glass p-6 rounded-3xl border-slate-800/50 flex flex-col items-center gap-3">
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-slate-500">
            <Icon className="w-5 h-5" />
        </div>
        <div className="text-center">
            <p className="text-xs font-bold text-slate-300">{label}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${status === 'Ready' || status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status}
            </p>
        </div>
    </div>
);

export default ModulePlaceholder;
