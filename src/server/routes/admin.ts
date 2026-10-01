import { Router, Response } from 'express';
import { db } from '../db';
import { AuthRequest, authMiddleware, requireRole, sanitizeUser } from '../auth';
import { UserRole, UserStatus, JobItem } from '../../types';

export const adminRouter = Router();

// Admin routes require admin role strictly
adminRouter.use(authMiddleware);
adminRouter.use(requireRole(['admin']));

// Platform Stats
adminRouter.get('/stats', (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    stats: {
      ...db.adminStats,
      totalUsersCount: db.users.length,
      activeUsersCount: db.users.filter((u) => u.status !== 'suspended').length,
    },
  });
});

// User Management Directory
adminRouter.get('/users', (_req: AuthRequest, res: Response) => {
  const sanitizedUsers = db.users.map(sanitizeUser);
  res.json({ success: true, users: sanitizedUsers });
});

// Update Role
adminRouter.patch('/users/:id/role', (req: AuthRequest, res: Response) => {
  const { role } = req.body;
  if (!['student', 'staff', 'admin'].includes(role)) {
    res.status(400).json({ success: false, error: 'Invalid role specified.' });
    return;
  }

  const user = db.updateUser(req.params.id, { role: role as UserRole });
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  db.logAudit(
    req.user?.name || 'Administrator',
    'admin',
    `Modified role for ${user.name} (${user.email}) to ${role.toUpperCase()}`,
    'warning'
  );

  res.json({ success: true, user: sanitizeUser(user) });
});

// Update Account Status (Active / Suspended)
adminRouter.patch('/users/:id/status', (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    res.status(400).json({ success: false, error: 'Invalid status. Must be "active" or "suspended".' });
    return;
  }

  const user = db.updateUser(req.params.id, { status: status as UserStatus });
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  db.logAudit(
    req.user?.name || 'Administrator',
    'admin',
    `Updated status for ${user.name} (${user.email}) to ${status.toUpperCase()}`,
    status === 'suspended' ? 'warning' : 'info'
  );

  res.json({ success: true, user: sanitizeUser(user) });
});

// Delete User
adminRouter.delete('/users/:id', (req: AuthRequest, res: Response) => {
  const target = db.findUserById(req.params.id);
  if (!target) {
    res.status(404).json({ success: false, error: 'User not found.' });
    return;
  }

  if (target.id === req.user?.id) {
    res.status(400).json({ success: false, error: 'Cannot delete your own administrative account.' });
    return;
  }

  db.deleteUser(req.params.id);
  db.logAudit(
    req.user?.name || 'Administrator',
    'admin',
    `Permanently deleted user account ${target.name} (${target.email})`,
    'warning'
  );

  res.json({ success: true, message: 'User deleted successfully.' });
});

// Audit Logs
adminRouter.get('/audit-logs', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, logs: db.auditLogs });
});

// Broadcast Announcement
adminRouter.post('/announcements', (req: AuthRequest, res: Response) => {
  const { title, message } = req.body;
  if (!title) {
    res.status(400).json({ success: false, error: 'Headline is required.' });
    return;
  }

  db.logAudit(
    req.user?.name || 'Administration Office',
    'admin',
    `Broadcasted Campus Notice: ${title}`,
    'info'
  );

  // Also dispatch notification to all students
  const studentUsers = db.users.filter((u) => u.role === 'student');
  for (const s of studentUsers) {
    db.notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: s.id,
      title: `Campus Announcement: ${title}`,
      message: message || title,
      type: 'info',
      read: false,
      createdAt: 'Just now',
    });
  }

  res.json({ success: true, message: 'Announcement broadcasted to student and staff portals.' });
});

// Corporate Recruitment Drives
adminRouter.get('/drives', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, drives: db.jobs });
});

adminRouter.post('/drives', (req: AuthRequest, res: Response) => {
  const { company, role, location, type, salaryLpa, description, requirements, deadline, badge, openings } = req.body;

  if (!company || !role) {
    res.status(400).json({ success: false, error: 'Company and role are required.' });
    return;
  }

  const newDrive: JobItem = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    company,
    role,
    location: location || 'Campus / Multiple Locations',
    type: type || 'Full-time',
    salaryLpa: Number(salaryLpa) || 20,
    description: description || 'Recruitment drive for graduating engineers.',
    requirements: requirements || ['Data Structures & Algorithms', 'Web Engineering'],
    deadline: deadline || '2025-12-31',
    badge: badge || 'Campus Drive',
    openings: Number(openings) || 5,
  };

  db.jobs.unshift(newDrive);
  db.logAudit(
    req.user?.name || 'Administrator',
    'admin',
    `Scheduled new campus recruitment drive with ${company} for role "${role}"`,
    'success'
  );

  res.json({ success: true, drive: newDrive });
});
