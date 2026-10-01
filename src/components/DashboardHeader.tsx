import React from 'react';
import { Sparkles, Trophy, Zap, Target, Search } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardHeaderProps {
  currentUser: UserProfile;
  title: string;
  subtitle: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  actions?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentUser,
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  actions,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-slate-900/50 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Greeting */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {getGreeting()}, {currentUser.name.split(' ')[0]}!
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {onSearchChange !== undefined && (
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search modules, questions, topics..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          {/* Quick Stats Pill */}
          {currentUser.role === 'student' && (
            <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1 text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span className="font-semibold">Rank #{currentUser.rank || 4}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Target className="w-3.5 h-3.5" />
                <span className="font-semibold">{currentUser.completedAssessments} Tests Completed</span>
              </div>
            </div>
          )}

          {actions}
        </div>
      </div>
    </div>
  );
};
