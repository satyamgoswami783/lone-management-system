import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.EMPLOYEE);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || `/${selectedRole}/dashboard`;

  const handleLogin = (e, targetEmail, targetPass, targetRole) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate minor delay for context synchronization
    setTimeout(() => {
      const finalRole = targetRole || selectedRole;
      login(targetEmail || email, targetPass || password, finalRole);
      
      // Always prioritize the specific role's dashboard for quick login, 
      // or use the 'from' location for manual login.
      const targetPath = targetRole ? `/${targetRole}/dashboard` : from;
      
      // Secondary delay to ensure context re-render has completed before route protection checks
      setTimeout(() => {
        navigate(targetPath, { replace: true });
        setIsLoggingIn(false);
      }, 100);
    }, 400);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-white flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-[min(600px,120vw)] h-[min(600px,120vw)] max-w-none bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[min(600px,120vw)] h-[min(600px,120vw)] max-w-none bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass w-full max-w-md p-6 sm:p-8 rounded-[28px] sm:rounded-[40px] border-slate-800 relative z-10 space-y-6 animate-in duration-700 shadow-2xl flex flex-col justify-center min-w-0">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-3 shadow-xl shadow-blue-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-0.5">
             <h1 className="text-3xl font-display font-black text-slate-200 tracking-tighter lowercase leading-none">lenni.</h1>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Secure Entry Portal</p>
          </div>
        </div>

        <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="input-field pl-12 h-14 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                className="input-field pl-12 h-14 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full btn-primary h-14 flex items-center justify-center gap-3 text-base disabled:opacity-50"
          >
            {isLoggingIn ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
                <>
                    <span>Access Dashboard</span>
                    <LogIn className="w-5 h-5" />
                </>
            )}
          </button>
        </form>

        <div className="space-y-3 pt-6 border-t border-slate-800">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Development Quick Login</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(ROLES).map(([key, role]) => (
              <button
                key={role}
                disabled={isLoggingIn}
                onClick={() => handleLogin(null, `${role}@lms.demo`, 'password123', role)}
                className="px-3 py-3 text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 text-center shadow-sm"
              >
                {key === 'EMPLOYEE' ? 'EMPLOYEE' : key}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-slate-500 text-sm font-medium">
            First time? <button type="button" className="text-blue-600 font-bold hover:underline">Register Profile</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
