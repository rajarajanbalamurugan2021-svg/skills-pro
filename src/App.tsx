import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardSidebar, NavView } from './components/DashboardSidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Toast, ToastType } from './components/Toast';
import { AIMentorDrawer } from './components/AIMentorDrawer';
import { LoginPortal } from './components/LoginPortal';

// Views
import { StudentDashboard } from './components/StudentDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CoursesView } from './components/CoursesView';
import { AptitudePracticeView } from './components/AptitudePracticeView';
import { ProgrammingCompilerView } from './components/ProgrammingCompilerView';
import { InterviewSimulatorView } from './components/InterviewSimulatorView';
import { JobSimulatorView } from './components/JobSimulatorView';
import { SkillAnalyzerView } from './components/SkillAnalyzerView';
import { CertificatesView } from './components/CertificatesView';
import { NotesView } from './components/NotesView';
import { ProfileView } from './components/ProfileView';

import { UserProfile, UserRole, Course, CodeProblem } from './types';
import { initialCourses, initialCodeProblems } from './server/seed';
import { api } from './services/api';

// Map pathnames to role & nav view
function parsePathToView(pathname: string, userRole: UserRole): { view: NavView; roleAllowed: boolean; redirectPath?: string } {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/login') {
    return { view: 'dashboard', roleAllowed: true };
  }

  // Root path redirects to role dashboard
  if (clean === '/' || clean === '') {
    return { view: 'dashboard', roleAllowed: true, redirectPath: `/${userRole}/dashboard` };
  }

  // Student paths
  if (clean.startsWith('/student')) {
    if (userRole !== 'student' && userRole !== 'admin') {
      return { view: 'dashboard', roleAllowed: false, redirectPath: `/${userRole}/dashboard` };
    }
    if (clean === '/student/courses') return { view: 'courses', roleAllowed: true };
    if (clean === '/student/compiler') return { view: 'compiler', roleAllowed: true };
    if (clean === '/student/aptitude') return { view: 'aptitude', roleAllowed: true };
    if (clean === '/student/interview') return { view: 'interview', roleAllowed: true };
    if (clean === '/student/job-simulator') return { view: 'job_simulator', roleAllowed: true };
    if (clean === '/student/skill-analyzer') return { view: 'skill_analyzer', roleAllowed: true };
    if (clean === '/student/certificates') return { view: 'certificates', roleAllowed: true };
    if (clean === '/student/notes') return { view: 'notes', roleAllowed: true };
    if (clean === '/student/profile') return { view: 'profile', roleAllowed: true };
    return { view: 'dashboard', roleAllowed: true };
  }

  // Staff paths
  if (clean.startsWith('/staff')) {
    if (userRole !== 'staff' && userRole !== 'admin') {
      return { view: 'dashboard', roleAllowed: false, redirectPath: `/${userRole}/dashboard` };
    }
    if (clean === '/staff/batches') return { view: 'staff_batches', roleAllowed: true };
    if (clean === '/staff/questions') return { view: 'aptitude', roleAllowed: true };
    if (clean === '/staff/analytics') return { view: 'skill_analyzer', roleAllowed: true };
    if (clean === '/staff/profile') return { view: 'profile', roleAllowed: true };
    return { view: 'dashboard', roleAllowed: true };
  }

  // Admin paths
  if (clean.startsWith('/admin')) {
    if (userRole !== 'admin') {
      return { view: 'dashboard', roleAllowed: false, redirectPath: `/${userRole}/dashboard` };
    }
    if (clean === '/admin/users') return { view: 'admin_users', roleAllowed: true };
    if (clean === '/admin/drives') return { view: 'admin_drives', roleAllowed: true };
    if (clean === '/admin/curriculum') return { view: 'courses', roleAllowed: true };
    if (clean === '/admin/credentials') return { view: 'certificates', roleAllowed: true };
    if (clean === '/admin/profile') return { view: 'profile', roleAllowed: true };
    return { view: 'dashboard', roleAllowed: true };
  }

  return { view: 'dashboard', roleAllowed: true, redirectPath: `/${userRole}/dashboard` };
}

function getViewUrl(view: NavView, role: UserRole): string {
  if (role === 'student') {
    switch (view) {
      case 'dashboard': return '/student/dashboard';
      case 'courses': return '/student/courses';
      case 'compiler': return '/student/compiler';
      case 'aptitude': return '/student/aptitude';
      case 'interview': return '/student/interview';
      case 'job_simulator': return '/student/job-simulator';
      case 'skill_analyzer': return '/student/skill-analyzer';
      case 'certificates': return '/student/certificates';
      case 'notes': return '/student/notes';
      case 'profile': return '/student/profile';
      default: return '/student/dashboard';
    }
  } else if (role === 'staff') {
    switch (view) {
      case 'dashboard': return '/staff/dashboard';
      case 'staff_batches': return '/staff/batches';
      case 'aptitude': return '/staff/questions';
      case 'skill_analyzer': return '/staff/analytics';
      case 'profile': return '/staff/profile';
      default: return '/staff/dashboard';
    }
  } else {
    switch (view) {
      case 'dashboard': return '/admin/dashboard';
      case 'admin_users': return '/admin/users';
      case 'admin_drives': return '/admin/drives';
      case 'courses': return '/admin/curriculum';
      case 'certificates': return '/admin/credentials';
      case 'profile': return '/admin/profile';
      default: return '/admin/dashboard';
    }
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(api.getCurrentUser());
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAIMentorOpen, setIsAIMentorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');

  // Course and problem caches
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [codeProblems, setCodeProblems] = useState<CodeProblem[]>(initialCodeProblems);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  }, []);

  // Sync route on popstate and initial load
  const syncRouteWithLocation = useCallback((user: UserProfile) => {
    const pathname = window.location.pathname;

    if (pathname === '/login') {
      setIsLoginOpen(true);
      return;
    }

    const { view, roleAllowed, redirectPath } = parsePathToView(pathname, user.role);

    if (!roleAllowed && redirectPath) {
      showToast(`Access Denied: Role ${user.role.toUpperCase()} is not authorized for this section.`, 'error');
      window.history.replaceState(null, '', redirectPath);
      setCurrentView('dashboard');
      return;
    }

    if (redirectPath && redirectPath !== pathname) {
      window.history.replaceState(null, '', redirectPath);
    }

    setCurrentView(view);
  }, [showToast]);

  // Initial authentication & routing check
  useEffect(() => {
    const token = api.getToken();

    if (!token || window.location.pathname === '/login') {
      setIsLoginOpen(true);
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    } else {
      api.checkAuth().then((authenticatedUser) => {
        if (authenticatedUser) {
          setCurrentUser(authenticatedUser);
          syncRouteWithLocation(authenticatedUser);
        } else {
          setIsLoginOpen(true);
          window.history.replaceState(null, '', '/login');
          showToast('Session expired. Please sign in.', 'info');
        }
      }).catch(() => {
        setIsLoginOpen(true);
        window.history.replaceState(null, '', '/login');
      });
    }

    // Load initial data
    api.getCourses().then(setCourses).catch(() => {});
    api.getCodeProblems().then(setCodeProblems).catch(() => {});

    // Listen for browser forward/backward buttons
    const handlePopState = () => {
      const activeUser = api.getCurrentUser();
      syncRouteWithLocation(activeUser);
    };

    // Listen for session expiration
    const handleAuthExpired = () => {
      setIsLoginOpen(true);
      window.history.replaceState(null, '', '/login');
      showToast('Session expired. Please sign in.', 'error');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [showToast, syncRouteWithLocation]);

  const refreshUser = () => {
    const updated = api.getCurrentUser();
    setCurrentUser(updated);
  };

  const handleNavigate = (newView: NavView) => {
    setCurrentView(newView);
    const newUrl = getViewUrl(newView, currentUser.role);
    window.history.pushState(null, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      const updated = await api.switchRole(newRole);
      setCurrentUser(updated);
      setCurrentView('dashboard');
      const newUrl = `/${newRole}/dashboard`;
      window.history.pushState(null, '', newUrl);
      showToast(`Switched workspace to ${newRole.toUpperCase()} portal`, 'info');
    } catch (err: any) {
      showToast(`Could not switch role: ${err.message}`, 'error');
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoginOpen(true);
    window.history.pushState(null, '', '/login');
    showToast('Signed out successfully.', 'info');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoginOpen(false);
    const targetUrl = `/${user.role}/dashboard`;
    window.history.pushState(null, '', targetUrl);
    setCurrentView('dashboard');
  };

  const viewTitles: Record<NavView, { title: string; subtitle: string }> = {
    dashboard: {
      title: `${currentUser.role.toUpperCase()} Workspace`,
      subtitle:
        currentUser.role === 'student'
          ? 'Personalized technical placement accelerator and daily practice dashboard.'
          : currentUser.role === 'staff'
          ? 'Batch performance analytics and curriculum assessment control.'
          : 'Campus-wide governance, partner recruitment drives, and audit controls.',
    },
    courses: {
      title: 'Curriculum & Placement Tracks',
      subtitle: 'Structured video modules, reading roadmaps, and verifiable skill tracks.',
    },
    compiler: {
      title: 'Code Compiler & LeetCode Studio',
      subtitle: 'Multi-language code editor with live test case execution and algorithmic challenges.',
    },
    aptitude: {
      title: 'Aptitude & Speed Reasoning',
      subtitle: 'Timed mock screenings, quantitative drills, and instant solutions for company tests.',
    },
    interview: {
      title: 'AI Mock Interview Studio',
      subtitle: 'Real-time speech evaluation, STAR methodology scoring, and feedback rubrics.',
    },
    job_simulator: {
      title: 'Corporate Engineering Simulations',
      subtitle: 'Hands-on sprint tickets, concurrency bug fixes, and peer code reviews.',
    },
    skill_analyzer: {
      title: 'Placement Readiness & Skill Matrix',
      subtitle: 'Spider matrix benchmarks against industry hiring requirements.',
    },
    certificates: {
      title: 'Accredited Certificates',
      subtitle: 'Cryptographically verifiable credentials shareable with hiring recruiters.',
    },
    notes: {
      title: 'Notes & Formula Cheat Sheets',
      subtitle: 'Organized markdown snippets, algorithm tricks, and behavioral STAR stories.',
    },
    profile: {
      title: 'Candidate Placement Profile',
      subtitle: 'Institutional credentials, practice streak, and portfolio achievements.',
    },
    staff_batches: {
      title: 'Student Batch Analytics',
      subtitle: 'Departmental performance monitoring and placement readiness cohorts.',
    },
    admin_users: {
      title: 'User Management & Permissions',
      subtitle: 'Directory administration and role assignments.',
    },
    admin_drives: {
      title: 'Corporate Recruitment Drives',
      subtitle: 'Partner company quotas, job roles, and campus visit scheduling.',
    },
  };

  const currentMeta = viewTitles[currentView] || viewTitles.dashboard;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenAIMentor={() => setIsAIMentorOpen(true)}
        onOpenLogin={handleLogout}
        onNavigateToProfile={() => handleNavigate('profile')}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <DashboardSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          userRole={currentUser.role}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-950">
          <DashboardHeader
            currentUser={currentUser}
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            <Breadcrumbs
              items={[
                { label: 'Workspace', onClick: () => handleNavigate('dashboard') },
                { label: currentMeta.title },
              ]}
            />

            {/* View Routing & Rendering */}
            {currentView === 'dashboard' && (
              <>
                {currentUser.role === 'student' && (
                  <StudentDashboard
                    currentUser={currentUser}
                    courses={courses}
                    codeProblems={codeProblems}
                    onNavigate={handleNavigate}
                    onOpenAIMentor={() => setIsAIMentorOpen(true)}
                  />
                )}
                {currentUser.role === 'staff' && (
                  <StaffDashboard
                    currentUser={currentUser}
                    onShowToast={showToast}
                  />
                )}
                {currentUser.role === 'admin' && (
                  <AdminDashboard
                    currentUser={currentUser}
                    onShowToast={showToast}
                    onRefreshUser={refreshUser}
                  />
                )}
              </>
            )}

            {currentView === 'courses' && (
              <CoursesView
                courses={courses}
                onCourseUpdated={() => {
                  refreshUser();
                  api.getCourses().then(setCourses).catch(() => {});
                }}
                onShowToast={showToast}
              />
            )}

            {currentView === 'compiler' && (
              <ProgrammingCompilerView
                onShowToast={showToast}
                onRefreshUser={refreshUser}
              />
            )}

            {currentView === 'aptitude' && (
              <AptitudePracticeView
                onShowToast={showToast}
                onRefreshUser={refreshUser}
              />
            )}

            {currentView === 'interview' && (
              <InterviewSimulatorView
                onShowToast={showToast}
                onRefreshUser={refreshUser}
              />
            )}

            {currentView === 'job_simulator' && (
              <JobSimulatorView
                onShowToast={showToast}
                onRefreshUser={refreshUser}
              />
            )}

            {currentView === 'skill_analyzer' && (
              <SkillAnalyzerView onShowToast={showToast} />
            )}

            {currentView === 'certificates' && (
              <CertificatesView onShowToast={showToast} />
            )}

            {currentView === 'notes' && <NotesView onShowToast={showToast} />}

            {currentView === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onProfileUpdated={refreshUser}
                onShowToast={showToast}
              />
            )}

            {currentView === 'staff_batches' && (
              <StaffDashboard currentUser={currentUser} onShowToast={showToast} />
            )}

            {(currentView === 'admin_users' || currentView === 'admin_drives') && (
              <AdminDashboard
                currentUser={currentUser}
                onShowToast={showToast}
                onRefreshUser={refreshUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global AI Mentor Drawer */}
      <AIMentorDrawer
        isOpen={isAIMentorOpen}
        onClose={() => setIsAIMentorOpen(false)}
        currentUser={currentUser}
      />

      {/* Global Login & Persona Switcher */}
      <LoginPortal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowToast={showToast}
      />

      {/* Toast Alert */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
