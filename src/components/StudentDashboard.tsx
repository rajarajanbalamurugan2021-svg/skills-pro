import React from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Code2,
  Brain,
  Video,
  Briefcase,
  Activity,
  ArrowRight,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
  Target,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, Course, CodeProblem } from '../types';
import { NavView } from './DashboardSidebar';

interface StudentDashboardProps {
  currentUser: UserProfile;
  courses: Course[];
  codeProblems: CodeProblem[];
  onNavigate: (view: NavView) => void;
  onOpenAIMentor: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  codeProblems,
  onNavigate,
  onOpenAIMentor,
}) => {
  const activeCourse = courses.find((c) => c.enrolled) || courses[0];
  const dailyProblem = codeProblems[0];

  const upcomingDrives = [
    { company: 'Google', role: 'Software Engineer (Early Career)', date: 'Oct 14, 2025', ctc: '32 LPA', badge: 'Tier-1' },
    { company: 'Microsoft', role: 'Full Stack Associate', date: 'Oct 19, 2025', ctc: '28 LPA', badge: 'Super Dream' },
    { company: 'Goldman Sachs', role: 'Engineering Analyst', date: 'Oct 25, 2025', ctc: '24 LPA', badge: 'Product' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Placement Readiness Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900/60 border border-indigo-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Campus Placement Season 2025 Active</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Ready for Tier-1 Tech Placements,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                {currentUser.name.split(' ')[0]}
              </span>
              !
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your overall readiness index is at <strong className="text-emerald-400">86%</strong>. You are currently eligible for 42 on-campus recruitment drives. Complete today's daily code challenge to maintain your {currentUser.streakDays}-day streak!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('compiler')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Code2 className="w-4 h-4" />
                <span>Solve Daily LeetCode</span>
              </button>

              <button
                onClick={onOpenAIMentor}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <span>Ask AI Placement Mentor</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block">Practice Streak</span>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-orange-400">
                <Flame className="w-5 h-5 fill-orange-400" />
                <span className="text-2xl font-black text-white">{currentUser.streakDays}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Consecutive Days</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block">Campus Rank</span>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-amber-400">
                <Award className="w-5 h-5" />
                <span className="text-2xl font-black text-white">#{currentUser.rank || 4}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Top 1% Percentile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules & Quick Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Continue Course + Daily Coding Challenge */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Course Card */}
          {activeCourse && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Continue Learning
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('courses')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>All Tracks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {activeCourse.category}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {activeCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400">{activeCourse.instructor.name}</p>
                </div>

                <div className="shrink-0 flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">
                      {activeCourse.progressPercentage}% Completed
                    </span>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${activeCourse.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('courses')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Daily LeetCode Challenge */}
          {dailyProblem && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Problem of the Day
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  +50 XP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{dailyProblem.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dailyProblem.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {dailyProblem.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{dailyProblem.category}</p>
                </div>

                <button
                  onClick={() => onNavigate('compiler')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all self-start sm:self-auto"
                >
                  Open Code Compiler
                </button>
              </div>
            </div>
          )}

          {/* Quick Action Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('aptitude')}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all text-left space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Speed Aptitude</h4>
                <p className="text-[11px] text-slate-400">10-min speed drills</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('interview')}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/40 transition-all text-left space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Mock Interview</h4>
                <p className="text-[11px] text-slate-400">STAR audio scoring</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('job_simulator')}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-left space-y-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Corporate Job Sim</h4>
                <p className="text-[11px] text-slate-400">Stripe & Netflix sprints</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Upcoming Drives & Leaderboard Preview */}
        <div className="space-y-6">
          {/* Upcoming Drives Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Placement Calendar</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-400">3 Active Slots</span>
            </div>

            <div className="space-y-3">
              {upcomingDrives.map((drive, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{drive.company}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                      {drive.ctc}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{drive.role}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Drive: {drive.date}</span>
                    <span className="text-emerald-400 font-semibold">Eligible ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Skill Benchmark */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Skill Matrix Snapshot</span>
            </h3>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Data Structures & Algo</span>
                  <span className="font-bold text-emerald-400">86%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '86%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Full Stack Architecture</span>
                  <span className="font-bold text-indigo-400">92%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Aptitude & Speed Math</span>
                  <span className="font-bold text-cyan-400">88%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('skill_analyzer')}
              className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors text-center block"
            >
              View Full Skill Gap Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
