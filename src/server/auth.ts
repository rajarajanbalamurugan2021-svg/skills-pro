import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserProfile, UserRole } from '../types';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'skill_forge_super_secure_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: UserProfile;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Strip sensitive credentials (passwordHash) before sending user object to client
 */
export function sanitizeUser(user: UserProfile): UserProfile {
  const clone = { ...user };
  delete clone.passwordHash;
  return clone;
}

/**
 * Generate signed JWT token
 */
export function signToken(user: UserProfile): string {
  const payload: JWTPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT token string
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Express middleware to authenticate Bearer token
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication token.' });
    return;
  }

  const user = db.findUserById(decoded.id);
  if (!user) {
    res.status(401).json({ success: false, error: 'User account not found.' });
    return;
  }

  if (user.status === 'suspended') {
    res.status(403).json({ success: false, error: 'This account has been suspended by administration.' });
    return;
  }

  req.user = sanitizeUser(user);
  next();
}

/**
 * Role-based authorization middleware
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Requires one of: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}

/**
 * Authenticate login credentials
 */
export function authenticateUser(email: string, password?: string, requiredRole?: UserRole): { success: boolean; user?: UserProfile; token?: string; error?: string } {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email address is required.' };
  }
  if (!password) {
    return { success: false, error: 'Password is required.' };
  }

  const user = db.findUserByEmail(email.trim());

  if (!user) {
    return { success: false, error: 'Invalid email or password.' };
  }

  if (user.status === 'suspended') {
    return { success: false, error: 'Account has been suspended by administration.' };
  }

  // Validate role if specified
  if (requiredRole && user.role !== requiredRole) {
    return {
      success: false,
      error: `Account role mismatch: Account is registered as ${user.role.toUpperCase()}, not ${requiredRole.toUpperCase()}.`,
    };
  }

  // Password verification against hashed credential
  if (user.passwordHash) {
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password.' };
    }
  }

  const token = signToken(user);
  const safeUser = sanitizeUser(user);

  db.logAudit(user.name, user.role, `Logged in successfully via ${user.role} portal`, 'success');

  return {
    success: true,
    user: safeUser,
    token,
  };
}

/**
 * Register a new student/staff account
 */
export function registerUser(data: {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  college?: string;
  department?: string;
}): { success: boolean; user?: UserProfile; token?: string; error?: string } {
  const existing = db.findUserByEmail(data.email);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const role: UserRole = data.role || 'student';
  const passwordToHash = data.password || 'Password123!';
  const passwordHash = bcrypt.hashSync(passwordToHash, 10);

  const newUser: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    role,
    status: 'active',
    passwordHash,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: data.college || 'National Technical Institute',
    department: data.department || 'Computer Science & Engineering',
    degree: 'B.E. Computer Science',
    graduationYear: 2025,
    skills: ['Problem Solving', 'Data Structures', 'Web Development'],
    streakDays: 1,
    points: 100,
    completedAssessments: 0,
    createdAt: new Date().toISOString(),
  };

  db.createUser(newUser);
  db.logAudit(newUser.name, newUser.role, `New account registered as ${newUser.role.toUpperCase()}`, 'info');

  const token = signToken(newUser);
  return {
    success: true,
    user: sanitizeUser(newUser),
    token,
  };
}
