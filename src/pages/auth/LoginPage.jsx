import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Mail, Lock, LogIn, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.APPLICANT);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || `/${selectedRole}/dashboard`;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>

      <div className="glass w-full max-w-md p-10 rounded-3xl relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Secure access to your loan dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="input-field pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                placeholder="Password" 
                required
                className="input-field pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>



          <button type="submit" className="w-full btn-primary h-12 flex items-center justify-center gap-2 group">
            <span>Sign In</span>
            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Quick Access (Demo)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(ROLES).map(([key, role]) => (
                    <button
                        key={role}
                        onClick={() => {
                            setEmail(`${role}@lms.demo`);
                            setPassword('password123');
                            setSelectedRole(role);
                            setTimeout(() => {
                                login(`${role}@lms.demo`, 'password123', role);
                                navigate(`/${role}/dashboard`, { replace: true });
                            }, 500);
                        }}
                        className="px-2 py-2 text-[10px] font-bold glass rounded-xl border-slate-800 transition-all hover:bg-blue-600/10 hover:text-blue-400 capitalize"
                    >
                        {key.toLowerCase()}
                    </button>
                ))}
            </div>
        </div>

        <div className="text-center pt-2">
            <p className="text-slate-500 text-sm">
                Don't have an account? <button className="text-blue-400 font-medium hover:underline">Register</button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
