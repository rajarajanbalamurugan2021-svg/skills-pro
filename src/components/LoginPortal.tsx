import React, { useState } from 'react';
import {
  Layers,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  Building,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '../types';
import { api } from '../services/api';

interface LoginPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('student@skillforge.ai');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectDemoPersona = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'student') {
      setEmail('student@skillforge.ai');
      setPassword('Password123!');
    } else if (role === 'staff') {
      setEmail('staff@skillforge.ai');
      setPassword('Password123!');
    } else if (role === 'admin') {
      setEmail('admin@skillforge.ai');
      setPassword('Password123!');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await api.login(email.trim(), password, selectedRole);
      onLoginSuccess(user);
      onShowToast(`Signed in successfully as ${user.name} (${user.role.toUpperCase()})`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
      onShowToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const user = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
        department,
      });
      onLoginSuccess(user);
      onShowToast(`Account created successfully! Welcome to Skill Forge AI, ${user.name}.`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      onShowToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Skill Forge <span className="text-cyan-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' ? 'Authentication & Institutional Sign-In' : 'Create Student / Faculty Account'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`py-1.5 rounded-lg transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Personas (Development/Demo Mode) */}
        {mode === 'login' && (
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Select Demo Persona:</span>
              <span className="text-emerald-400 font-normal">Pre-configured</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoPersona('student')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedRole === 'student' && email === 'student@skillforge.ai'
                    ? 'bg-indigo-950/70 border-indigo-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span className="text-xs font-bold block text-white">Student</span>
                <span className="text-[10px] text-slate-400 block truncate">Rajarajan</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('staff')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedRole === 'staff' && email === 'staff@skillforge.ai'
                    ? 'bg-amber-950/70 border-amber-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Briefcase className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-xs font-bold block text-white">Faculty</span>
                <span className="text-[10px] text-slate-400 block truncate">Dr. Sarah</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoPersona('admin')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedRole === 'admin' && email === 'admin@skillforge.ai'
                    ? 'bg-cyan-950/70 border-cyan-500 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-xs font-bold block text-white">Admin</span>
                <span className="text-[10px] text-slate-400 block truncate">Director M.</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajarajan B."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-1">Institutional Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password123!"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Selected Portal Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'staff', 'admin'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    selectedRole === r
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all mt-4"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Workspace' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
