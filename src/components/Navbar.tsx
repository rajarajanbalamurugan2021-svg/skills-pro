import React from 'react';
import {
  Sparkles,
  Flame,
  Award,
  Shield,
  GraduationCap,
  Briefcase,
  Bot,
  LogOut,
  Bell,
  Layers,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onRoleChange: (role: UserRole) => void;
  onOpenAIMentor: () => void;
  onOpenLogin: () => void;
  onNavigateToProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  onOpenAIMentor,
  onOpenLogin,
  onNavigateToProfile,
}) => {
  const roleBadges: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    student: {
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    staff: {
      label: 'Faculty & Placement',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    admin: {
      label: 'Administrator',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">
                Skills<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pro</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Career & Technical Placement Platform
            </p>
          </div>
        </div>

        {/* Role Quick Switcher */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onRoleChange('student')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentUser.role === 'student'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
          <button
            onClick={() => onRoleChange('staff')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentUser.role === 'staff'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-700/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>
          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              currentUser.role === 'admin'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-700/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-3">
          {/* Streak pill (student) */}
          {currentUser.role === 'student' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
              <span>{currentUser.streakDays} Day Streak</span>
            </div>
          )}

          {/* Points */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>{currentUser.points.toLocaleString()} XP</span>
          </div>

          {/* AI Mentor Trigger */}
          <button
            onClick={onOpenAIMentor}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Ask AI Career Mentor"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Mentor</span>
            <Sparkles className="w-3 h-3 text-cyan-300" />
          </button>

          {/* User profile dropdown button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <button
              onClick={onNavigateToProfile}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-900 transition-colors text-left"
              title="View Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div className="hidden xl:block">
                <p className="text-xs font-bold text-slate-100 leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span
                    className={`inline-flex items-center gap-0.5 px-1 py-0.2 rounded border text-[9px] font-semibold ${
                      roleBadges[currentUser.role].color
                    }`}
                  >
                    {roleBadges[currentUser.role].label}
                  </span>
                </div>
              </div>
            </button>

            <button
              onClick={onOpenLogin}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
              title="Switch Account / Login Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
