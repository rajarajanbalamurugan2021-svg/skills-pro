import fs from 'fs';
import path from 'path';
import {
  UserProfile,
  Course,
  CourseEnrollment,
  AptitudeQuestion,
  AptitudeTestResult,
  CodeProblem,
  CodeSubmission,
  JobSimulation,
  JobItem,
  JobApplication,
  InterviewSession,
  SkillMetric,
  Certificate,
  Note,
  NotificationItem,
  StaffBatch,
  StudentProgressReport,
  AdminStats,
  AuditLog,
  UserRole,
} from '../types';
import {
  initialUsers,
  initialCourses,
  initialEnrollments,
  initialAptitudeQuestions,
  initialCodeProblems,
  initialCodeSubmissions,
  initialJobSimulations,
  initialJobs,
  initialJobApplications,
  initialNotifications,
  initialSkillMetrics,
  initialCertificates,
  initialNotes,
  initialBatches,
  initialStudentReports,
  initialAdminStats,
} from './seed';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: UserProfile[];
  courses: Course[];
  enrollments: CourseEnrollment[];
  aptitudeQuestions: AptitudeQuestion[];
  aptitudeResults: AptitudeTestResult[];
  codeProblems: CodeProblem[];
  codeSubmissions: CodeSubmission[];
  jobSimulations: JobSimulation[];
  jobs: JobItem[];
  jobApplications: JobApplication[];
  interviews: InterviewSession[];
  skills: SkillMetric[];
  certificates: Certificate[];
  notes: Note[];
  notifications: NotificationItem[];
  batches: StaffBatch[];
  studentReports: StudentProgressReport[];
  adminStats: AdminStats;
  auditLogs: AuditLog[];
}

function getDefaultDatabase(): DatabaseSchema {
  return {
    users: JSON.parse(JSON.stringify(initialUsers)),
    courses: JSON.parse(JSON.stringify(initialCourses)),
    enrollments: JSON.parse(JSON.stringify(initialEnrollments)),
    aptitudeQuestions: JSON.parse(JSON.stringify(initialAptitudeQuestions)),
    aptitudeResults: [],
    codeProblems: JSON.parse(JSON.stringify(initialCodeProblems)),
    codeSubmissions: JSON.parse(JSON.stringify(initialCodeSubmissions)),
    jobSimulations: JSON.parse(JSON.stringify(initialJobSimulations)),
    jobs: JSON.parse(JSON.stringify(initialJobs)),
    jobApplications: JSON.parse(JSON.stringify(initialJobApplications)),
    interviews: [],
    skills: JSON.parse(JSON.stringify(initialSkillMetrics)),
    certificates: JSON.parse(JSON.stringify(initialCertificates)),
    notes: JSON.parse(JSON.stringify(initialNotes)),
    notifications: JSON.parse(JSON.stringify(initialNotifications)),
    batches: JSON.parse(JSON.stringify(initialBatches)),
    studentReports: JSON.parse(JSON.stringify(initialStudentReports)),
    adminStats: JSON.parse(JSON.stringify(initialAdminStats)),
    auditLogs: JSON.parse(JSON.stringify(initialAdminStats.recentActivities)),
  };
}

export class SkillsDatabase {
  private data: DatabaseSchema;
  private isServer: boolean;

  constructor() {
    this.isServer = typeof window === 'undefined' && typeof process !== 'undefined';
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    if (this.isServer) {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (fs.existsSync(DB_FILE)) {
          const raw = fs.readFileSync(DB_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          // Merge with defaults to guarantee all collections exist
          return { ...getDefaultDatabase(), ...parsed };
        }
      } catch (err) {
        console.warn('Could not read from data/database.json, initializing fresh store:', err);
      }
    } else {
      // Browser environment
      try {
        const item = localStorage.getItem('skillforge_db');
        if (item) {
          return { ...getDefaultDatabase(), ...JSON.parse(item) };
        }
      } catch (e) {
        // fallback
      }
    }

    const initial = getDefaultDatabase();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave?: DatabaseSchema): void {
    const target = dataToSave || this.data;
    if (this.isServer) {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(target, null, 2), 'utf-8');
      } catch (err) {
        console.error('Failed to write database to disk:', err);
      }
    } else {
      try {
        localStorage.setItem('skillforge_db', JSON.stringify(target));
      } catch (e) {
        // ignore
      }
    }
  }

  // Getters for direct property access (backward compatibility)
  get users(): UserProfile[] { return this.data.users; }
  set users(val: UserProfile[]) { this.data.users = val; this.persist(); }

  get courses(): Course[] { return this.data.courses; }
  set courses(val: Course[]) { this.data.courses = val; this.persist(); }

  get enrollments(): CourseEnrollment[] { return this.data.enrollments; }
  set enrollments(val: CourseEnrollment[]) { this.data.enrollments = val; this.persist(); }

  get aptitudeQuestions(): AptitudeQuestion[] { return this.data.aptitudeQuestions; }
  set aptitudeQuestions(val: AptitudeQuestion[]) { this.data.aptitudeQuestions = val; this.persist(); }

  get aptitudeResults(): AptitudeTestResult[] { return this.data.aptitudeResults; }
  set aptitudeResults(val: AptitudeTestResult[]) { this.data.aptitudeResults = val; this.persist(); }

  get codeProblems(): CodeProblem[] { return this.data.codeProblems; }
  set codeProblems(val: CodeProblem[]) { this.data.codeProblems = val; this.persist(); }

  get codeSubmissions(): CodeSubmission[] { return this.data.codeSubmissions; }
  set codeSubmissions(val: CodeSubmission[]) { this.data.codeSubmissions = val; this.persist(); }

  get jobSimulations(): JobSimulation[] { return this.data.jobSimulations; }
  set jobSimulations(val: JobSimulation[]) { this.data.jobSimulations = val; this.persist(); }

  get jobs(): JobItem[] { return this.data.jobs; }
  set jobs(val: JobItem[]) { this.data.jobs = val; this.persist(); }

  get jobApplications(): JobApplication[] { return this.data.jobApplications; }
  set jobApplications(val: JobApplication[]) { this.data.jobApplications = val; this.persist(); }

  get interviews(): InterviewSession[] { return this.data.interviews; }
  set interviews(val: InterviewSession[]) { this.data.interviews = val; this.persist(); }

  get skills(): SkillMetric[] { return this.data.skills; }
  set skills(val: SkillMetric[]) { this.data.skills = val; this.persist(); }

  get certificates(): Certificate[] { return this.data.certificates; }
  set certificates(val: Certificate[]) { this.data.certificates = val; this.persist(); }

  get notes(): Note[] { return this.data.notes; }
  set notes(val: Note[]) { this.data.notes = val; this.persist(); }

  get notifications(): NotificationItem[] { return this.data.notifications; }
  set notifications(val: NotificationItem[]) { this.data.notifications = val; this.persist(); }

  get batches(): StaffBatch[] { return this.data.batches; }
  set batches(val: StaffBatch[]) { this.data.batches = val; this.persist(); }

  get studentReports(): StudentProgressReport[] { return this.data.studentReports; }
  set studentReports(val: StudentProgressReport[]) { this.data.studentReports = val; this.persist(); }

  get adminStats(): AdminStats { return this.data.adminStats; }
  set adminStats(val: AdminStats) { this.data.adminStats = val; this.persist(); }

  get auditLogs(): AuditLog[] { return this.data.auditLogs; }
  set auditLogs(val: AuditLog[]) { this.data.auditLogs = val; this.persist(); }

  // === USER OPERATIONS ===
  findUserByEmail(email: string): UserProfile | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): UserProfile | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: UserProfile): UserProfile {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.persist();
    return this.data.users[index];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // === AUDIT LOGS ===
  logAudit(user: string, role: UserRole, action: string, type: 'info' | 'success' | 'warning' = 'info', ip?: string): void {
    const entry: AuditLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user,
      role,
      action,
      timestamp: new Date().toISOString(),
      type,
      ip,
    };
    this.data.auditLogs.unshift(entry);
    this.data.adminStats.recentActivities.unshift(entry);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    if (this.data.adminStats.recentActivities.length > 50) {
      this.data.adminStats.recentActivities.pop();
    }
    this.persist();
  }

  // === COURSE & LESSON ENROLLMENT ===
  enrollCourse(userId: string, courseId: string): Course | undefined {
    const course = this.data.courses.find((c) => c.id === courseId);
    if (!course) return undefined;

    let enrollment = this.data.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      enrollment = {
        id: `enr_${Date.now()}`,
        userId,
        courseId,
        progressPercentage: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
      };
      this.data.enrollments.push(enrollment);
    }

    course.enrolled = true;
    this.persist();
    return course;
  }

  toggleLessonCompletion(userId: string, courseId: string, lessonId: string): Course | undefined {
    const course = this.data.courses.find((c) => c.id === courseId);
    if (!course) return undefined;

    let enrollment = this.data.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      enrollment = {
        id: `enr_${Date.now()}`,
        userId,
        courseId,
        progressPercentage: 0,
        completedLessons: [],
        enrolledAt: new Date().toISOString(),
      };
      this.data.enrollments.push(enrollment);
    }

    const isAlreadyCompleted = enrollment.completedLessons.includes(lessonId);
    if (isAlreadyCompleted) {
      enrollment.completedLessons = enrollment.completedLessons.filter((id) => id !== lessonId);
    } else {
      enrollment.completedLessons.push(lessonId);
    }

    let totalLessons = 0;
    course.modules.forEach((mod) => {
      mod.lessons.forEach((l) => {
        totalLessons++;
        l.completed = enrollment.completedLessons.includes(l.id);
      });
    });

    course.progressPercentage = totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0;
    enrollment.progressPercentage = course.progressPercentage;

    this.persist();
    return course;
  }

  // === APTITUDE ===
  saveAptitudeResult(userId: string, result: AptitudeTestResult): AptitudeTestResult {
    result.userId = userId;
    this.data.aptitudeResults.unshift(result);

    // Update user points and completed assessments
    const user = this.findUserById(userId);
    if (user) {
      user.points = (user.points || 0) + result.score * 10;
      user.completedAssessments = (user.completedAssessments || 0) + 1;
    }

    this.persist();
    return result;
  }

  // === CODING ===
  saveCodeSubmission(submission: CodeSubmission): CodeSubmission {
    this.data.codeSubmissions.unshift(submission);
    if (submission.status === 'Accepted') {
      const user = this.findUserById(submission.userId);
      if (user) {
        user.points = (user.points || 0) + 50;
      }
    }
    this.persist();
    return submission;
  }

  // === JOB SIMULATION ===
  updateJobTask(simulationId: string, taskId: string, updates: { status: any; submission?: string; feedback?: string }): JobSimulation | undefined {
    const sim = this.data.jobSimulations.find((s) => s.id === simulationId);
    if (!sim) return undefined;

    const task = sim.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = updates.status;
      if (updates.submission !== undefined) task.userSubmission = updates.submission;
      if (updates.feedback !== undefined) task.mentorFeedback = updates.feedback;
    }

    sim.isCompleted = sim.tasks.every((t) => t.status === 'completed');
    this.persist();
    return sim;
  }

  // === NOTES ===
  saveNote(userId: string, note: Note): Note {
    note.userId = userId;
    const index = this.data.notes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      this.data.notes[index] = note;
    } else {
      this.data.notes.unshift(note);
    }
    this.persist();
    return note;
  }

  deleteNote(userId: string, noteId: string): boolean {
    const initialLen = this.data.notes.length;
    this.data.notes = this.data.notes.filter((n) => !(n.id === noteId && (n.userId === userId || !n.userId)));
    if (this.data.notes.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // === NOTIFICATIONS ===
  markNotificationRead(id: string): void {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  // === JOBS ===
  applyForJob(userId: string, jobId: string): JobApplication | undefined {
    const job = this.data.jobs.find((j) => j.id === jobId);
    if (!job) return undefined;

    const existing = this.data.jobApplications.find((a) => a.userId === userId && a.jobId === jobId);
    if (existing) return existing;

    const application: JobApplication = {
      id: `app_${Date.now()}`,
      jobId,
      userId,
      company: job.company,
      role: job.role,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    this.data.jobApplications.unshift(application);
    this.persist();
    return application;
  }

  // === INTERVIEWS ===
  saveInterview(session: InterviewSession): InterviewSession {
    const idx = this.data.interviews.findIndex((i) => i.id === session.id);
    if (idx >= 0) {
      this.data.interviews[idx] = session;
    } else {
      this.data.interviews.unshift(session);
    }
    this.persist();
    return session;
  }

  // Fallback helper for client-side legacy methods
  getCurrentUser(): UserProfile {
    return this.data.users[0];
  }

  setCurrentUser(userId: string): UserProfile {
    const user = this.findUserById(userId);
    return user || this.data.users[0];
  }

  switchRole(role: UserRole): UserProfile {
    const target = this.data.users.find((u) => u.role === role);
    return target || this.data.users[0];
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    if (this.data.users[0]) {
      this.data.users[0] = { ...this.data.users[0], ...updates };
      this.persist();
    }
    return this.data.users[0];
  }

  resetDefaults(): void {
    this.data = getDefaultDatabase();
    this.persist();
  }
}

export const db = new SkillsDatabase();
