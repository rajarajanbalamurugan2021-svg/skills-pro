import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Brain,
  Video,
  Briefcase,
  Activity,
  Award,
  FileText,
  User,
  Users,
  Building,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { UserRole } from '../types';

export type NavView =
  | 'dashboard'
  | 'courses'
  | 'compiler'
  | 'aptitude'
  | 'interview'
  | 'job_simulator'
  | 'skill_analyzer'
  | 'certificates'
  | 'notes'
  | 'profile'
  | 'staff_batches'
  | 'admin_users'
  | 'admin_drives';

interface DashboardSidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  userRole: UserRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentView,
  onNavigate,
  userRole,
  collapsed,
  onToggleCollapse,
}) => {
  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses & Tracks', icon: BookOpen },
    { id: 'compiler', label: 'Code Compiler', icon: Code2, badge: 'Hot' },
    { id: 'aptitude', label: 'Aptitude Practice', icon: Brain },
    { id: 'interview', label: 'AI Mock Interview', icon: Video, badge: 'AI' },
    { id: 'job_simulator', label: 'Job Simulator', icon: Briefcase },
    { id: 'skill_analyzer', label: 'Skill Matrix', icon: Activity },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'notes', label: 'Notes & Snippets', icon: FileText },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const staffNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Staff Overview', icon: LayoutDashboard },
    { id: 'staff_batches', label: 'Batch Analytics', icon: Users },
    { id: 'aptitude', label: 'Test Questions Bank', icon: Brain },
    { id: 'compiler', label: 'Problem Editor', icon: Code2 },
    { id: 'skill_analyzer', label: 'Cohort Readiness', icon: TrendingUp },
    { id: 'profile', label: 'Faculty Profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'admin_users', label: 'User Management', icon: Users },
    { id: 'admin_drives', label: 'Hiring Partners', icon: Building },
    { id: 'courses', label: 'Curriculum Hub', icon: BookOpen },
    { id: 'certificates', label: 'Issued Credentials', icon: Award },
    { id: 'profile', label: 'Admin Profile', icon: Shield },
  ];

  const items: NavItem[] =
    userRole === 'admin'
      ? adminNavItems
      : userRole === 'staff'
      ? staffNavItems
      : studentNavItems;

  return (
    <aside
      className={`relative z-30 transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-950/60 backdrop-blur-md flex flex-col shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Top / Toggle */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
            Navigation
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors mx-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-700/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 text-left flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider ${
                        item.badge === 'AI'
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Placement Readiness Meter in Sidebar (student) */}
      {!collapsed && userRole === 'student' && (
        <div className="p-3 m-2 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-900/40 text-left">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-slate-300">Readiness Score</span>
            <span className="font-bold text-indigo-400">86%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              style={{ width: '86%' }}
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Tier-1 placement eligibility unlocked. Keep streak active!
          </p>
        </div>
      )}
    </aside>
  );
};
