export type UserRole = 'student' | 'staff' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  passwordHash?: string;
  avatar: string;
  college?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  phone?: string;
  targetRole?: string;
  bio?: string;
  skills: string[];
  resumeUrl?: string;
  streakDays: number;
  points: number;
  rank?: number;
  completedAssessments: number;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserProfile;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LessonType = 'video' | 'article' | 'quiz' | 'code';

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  completed: boolean;
  content?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Full Stack' | 'Data Structures & Algorithms' | 'Cloud & DevOps' | 'System Design' | 'AI & ML' | 'Aptitude & Soft Skills';
  level: CourseLevel;
  duration: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  modules: CourseModule[];
  progressPercentage: number;
  enrolled: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: string[];
  enrolledAt: string;
}

export type AptitudeCategory = 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Core CS' | 'Data Interpretation';

export interface AptitudeQuestion {
  id: string;
  category: AptitudeCategory;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  formulaOrTip?: string;
  points?: number;
}

export interface AptitudeTestResult {
  id: string;
  userId?: string;
  category: AptitudeCategory | 'Comprehensive';
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
  date: string;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }[];
}

export type ProgrammingLanguage = 'javascript' | 'python' | 'cpp' | 'java';

export interface CodeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Arrays & Strings' | 'Trees & Graphs' | 'Dynamic Programming' | 'Sorting & Searching' | 'Recursion' | 'Stack & Queue';
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  testCases: {
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }[];
  solution?: string;
  hints?: string[];
}

export interface CodeExecutionResult {
  status: 'success' | 'error' | 'runtime_error' | 'timeout';
  output: string;
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  memoryKb: number;
  details?: {
    testIndex: number;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
}

export interface CodeSubmission {
  id: string;
  problemId: string;
  userId: string;
  language: ProgrammingLanguage;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  submittedAt: string;
}

export type JobTaskType = 'bugfix' | 'feature' | 'code_review' | 'sql_query' | 'incident';
export type JobTaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface JobTask {
  id: string;
  title: string;
  type: JobTaskType;
  status: JobTaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  scenario: string;
  initialCode?: string;
  hints: string[];
  acceptanceCriteria: string[];
  userSubmission?: string;
  mentorFeedback?: string;
  solutionSnippet?: string;
}

export interface JobSimulation {
  id: string;
  title: string;
  company: string;
  role: string;
  department: string;
  duration: string;
  difficulty: 'Junior' | 'Associate' | 'Mid-Level';
  badgeName: string;
  overview: string;
  objectives: string[];
  tasks: JobTask[];
  skillsGained: string[];
  isCompleted?: boolean;
}

export interface JobItem {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  salaryLpa: number;
  description: string;
  requirements: string[];
  deadline: string;
  badge: string;
  openings: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  company: string;
  role: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'rejected';
  appliedDate: string;
}

export type InterviewType = 'Technical Coding' | 'System Design' | 'HR & Behavioral' | 'Placement Manager';
export type InterviewDifficulty = 'Junior' | 'Mid' | 'Senior';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  sampleAnswer: string;
  keyPointsToCover: string[];
  userAnswer?: string;
  score?: number; // 0-100
  feedback?: {
    relevance: number;
    clarity: number;
    technicalAccuracy: number;
    starTechnique: number;
    strongPoints: string[];
    improvements: string[];
    suggestedAnswer: string;
  };
}

export interface InterviewSession {
  id: string;
  userId?: string;
  role: string;
  companyFocus: string;
  type: InterviewType;
  difficulty: InterviewDifficulty;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  status: 'in_progress' | 'completed';
  overallScore?: number;
  completedAt?: string;
  summaryFeedback?: string;
}

export interface SkillMetric {
  name: string;
  category: string;
  score: number; // 0-100
  benchmark: number; // industry benchmark
  status: 'Advanced' | 'Proficient' | 'Needs Practice';
  recommendedAction: string;
}

export interface Certificate {
  id: string;
  userId?: string;
  title: string;
  recipientName: string;
  issuedBy: string;
  issueDate: string;
  certificateNumber: string;
  grade: string;
  skills: string[];
  track: string;
  verificationUrl: string;
}

export interface Note {
  id: string;
  userId?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  updatedAt: string;
  isPinned: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
  ip?: string;
}

export interface StaffBatch {
  id: string;
  name: string;
  department: string;
  year: number;
  totalStudents: number;
  averageAptitude: number;
  averageCoding: number;
  placementReadinessRate: number; // percentage
  topPerformers: {
    id: string;
    name: string;
    avatar: string;
    score: number;
    rank: number;
  }[];
}

export interface StudentProgressReport {
  studentId: string;
  studentName: string;
  email: string;
  batch: string;
  attendancePercent: number;
  coursesCompleted: number;
  codingProblemsSolved: number;
  aptitudeScoreAvg: number;
  mockInterviewsDone: number;
  jobSimulationsCompleted: number;
  overallReadiness: number;
  lastActive: string;
  status: 'Ready for Placements' | 'Active' | 'Needs Attention';
}

export interface AdminStats {
  totalStudents: number;
  totalStaff: number;
  activePlacementDrives: number;
  averagePlacementReadiness: number;
  partnerCompaniesCount: number;
  assessmentsConducted: number;
  hiringPartners: {
    name: string;
    logo: string;
    openings: number;
    avgCtcLpa: number;
  }[];
  recentActivities: AuditLog[];
}
