import { Router, Response } from 'express';
import { db } from '../db';
import { AuthRequest, authMiddleware, requireRole, sanitizeUser } from '../auth';
import { executeCodeSafely } from '../compiler';
import {
  AptitudeTestResult,
  Note,
  ProgrammingLanguage,
  CodeSubmission,
} from '../../types';

export const studentRouter = Router();

// Apply auth middleware to all student routes
studentRouter.use(authMiddleware);
studentRouter.use(requireRole(['student', 'staff', 'admin']));

// Student Dashboard Summary
studentRouter.get('/dashboard', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const rawUser = db.findUserById(userId) || req.user;
  const user = rawUser ? sanitizeUser(rawUser) : undefined;

  const enrollments = db.enrollments.filter((e) => e.userId === userId);
  const submissions = db.codeSubmissions.filter((s) => s.userId === userId);
  const attempts = db.aptitudeResults.filter((a) => a.userId === userId);
  const notifications = db.notifications.filter((n) => n.userId === userId);

  res.json({
    success: true,
    user,
    enrolledCoursesCount: enrollments.length,
    problemsSolvedCount: submissions.filter((s) => s.status === 'Accepted').length,
    assessmentsCompletedCount: attempts.length,
    recentNotifications: notifications.slice(0, 5),
    upcomingDrives: db.jobs.slice(0, 4),
  });
});

// Courses
studentRouter.get('/courses', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, courses: db.courses });
});

studentRouter.post('/courses/:id/enroll', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const course = db.enrollCourse(userId, req.params.id);
  if (!course) {
    res.status(404).json({ success: false, error: 'Course not found' });
    return;
  }
  res.json({ success: true, course });
});

studentRouter.post('/courses/:id/lessons/:lessonId/toggle', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const course = db.toggleLessonCompletion(userId, req.params.id, req.params.lessonId);
  if (!course) {
    res.status(404).json({ success: false, error: 'Course or lesson not found' });
    return;
  }
  res.json({ success: true, course });
});

// Aptitude Practice & Assessments
studentRouter.get('/aptitude/questions', (req: AuthRequest, res: Response) => {
  const category = req.query.category as string;
  const questions =
    category && category !== 'All'
      ? db.aptitudeQuestions.filter((q) => q.category === category)
      : db.aptitudeQuestions;
  res.json({ success: true, questions });
});

studentRouter.post('/aptitude/submit', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const result: AptitudeTestResult = req.body;
  const saved = db.saveAptitudeResult(userId, result);
  res.json({ success: true, result: saved });
});

studentRouter.get('/aptitude/history', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const history = db.aptitudeResults.filter((r) => r.userId === userId);
  res.json({ success: true, history });
});

// Programming Compiler Studio
studentRouter.get('/compiler/problems', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, problems: db.codeProblems });
});

studentRouter.post('/compiler/run', (req: AuthRequest, res: Response) => {
  const { problemId, language, code } = req.body;
  const problem = db.codeProblems.find((p) => p.id === problemId);
  if (!problem) {
    res.status(404).json({ success: false, error: 'Problem not found' });
    return;
  }

  const result = executeCodeSafely(problem, language as ProgrammingLanguage, code);
  res.json({ success: true, result });
});

studentRouter.post('/compiler/submit', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { problemId, language, code } = req.body;
  const problem = db.codeProblems.find((p) => p.id === problemId);
  if (!problem) {
    res.status(404).json({ success: false, error: 'Problem not found' });
    return;
  }

  const result = executeCodeSafely(problem, language as ProgrammingLanguage, code);

  const submission: CodeSubmission = {
    id: `sub_${Date.now()}`,
    problemId,
    userId,
    language: language as ProgrammingLanguage,
    code,
    status: result.status === 'success' ? 'Accepted' : 'Wrong Answer',
    passedTests: result.passedTests,
    totalTests: result.totalTests,
    runtimeMs: result.executionTimeMs,
    submittedAt: new Date().toISOString(),
  };

  db.saveCodeSubmission(submission);

  res.json({ success: true, result, submission });
});

studentRouter.get('/compiler/submissions', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const submissions = db.codeSubmissions.filter((s) => s.userId === userId);
  res.json({ success: true, submissions });
});

// Corporate Job Simulations
studentRouter.get('/simulations', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, simulations: db.jobSimulations });
});

studentRouter.patch('/simulations/:id/tasks/:taskId', (req: AuthRequest, res: Response) => {
  const { status, submission, feedback } = req.body;
  const updated = db.updateJobTask(req.params.id, req.params.taskId, {
    status,
    submission,
    feedback,
  });
  if (!updated) {
    res.status(404).json({ success: false, error: 'Simulation or task not found' });
    return;
  }
  res.json({ success: true, simulation: updated });
});

// Skill Matrix & Analytics
studentRouter.get('/skills', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, skills: db.skills });
});

// Certificates
studentRouter.get('/certificates', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, certificates: db.certificates });
});

studentRouter.get('/certificates/verify/:certId', (req: AuthRequest, res: Response) => {
  const cert = db.certificates.find((c) => c.certificateNumber === req.params.certId || c.id === req.params.certId);
  if (!cert) {
    res.status(404).json({ success: false, error: 'Certificate not found or unverified' });
    return;
  }
  res.json({ success: true, certificate: cert });
});

// Notes
studentRouter.get('/notes', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const notes = db.notes.filter((n) => n.userId === userId || !n.userId);
  res.json({ success: true, notes });
});

studentRouter.post('/notes', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const note: Note = req.body;
  const saved = db.saveNote(userId, note);
  res.json({ success: true, note: saved });
});

studentRouter.delete('/notes/:id', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const deleted = db.deleteNote(userId, req.params.id);
  res.json({ success: true, deleted });
});

// Notifications
studentRouter.get('/notifications', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const notifs = db.notifications.filter((n) => n.userId === userId || !n.userId);
  res.json({ success: true, notifications: notifs });
});

studentRouter.patch('/notifications/:id/read', (req: AuthRequest, res: Response) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

// Campus Job Drives & Applications
studentRouter.get('/jobs', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, jobs: db.jobs });
});

studentRouter.post('/jobs/:id/apply', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const application = db.applyForJob(userId, req.params.id);
  if (!application) {
    res.status(404).json({ success: false, error: 'Job drive not found' });
    return;
  }
  res.json({ success: true, application });
});

// Profile
studentRouter.get('/profile', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const user = db.findUserById(userId);
  const activeUser = user || req.user;
  res.json({ success: true, user: activeUser ? sanitizeUser(activeUser) : undefined });
});

studentRouter.put('/profile', (req: AuthRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const updated = db.updateUser(userId, req.body);
  res.json({ success: true, user: updated ? sanitizeUser(updated) : undefined });
});
