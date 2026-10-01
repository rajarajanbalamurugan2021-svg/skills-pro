import { Router, Response } from 'express';
import { db } from '../db';
import { AuthRequest, authMiddleware, requireRole } from '../auth';
import { AptitudeQuestion } from '../../types';

export const staffRouter = Router();

// Staff routes require staff or admin role
staffRouter.use(authMiddleware);
staffRouter.use(requireRole(['staff', 'admin']));

// Batches
staffRouter.get('/batches', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, batches: db.batches });
});

// Student Roster
staffRouter.get('/students', (req: AuthRequest, res: Response) => {
  const batchId = req.query.batchId as string;
  const reports =
    batchId && batchId !== 'all'
      ? db.studentReports.filter((r) => r.batch.toLowerCase().includes(batchId.toLowerCase()))
      : db.studentReports;
  res.json({ success: true, reports });
});

// Create Benchmark Assessment
staffRouter.post('/assessments', (req: AuthRequest, res: Response) => {
  const { title, category, targetBatch } = req.body;
  if (!title) {
    res.status(400).json({ success: false, error: 'Assessment title is required.' });
    return;
  }

  const staffName = req.user?.name || 'Faculty Coordinator';
  db.logAudit(
    staffName,
    'staff',
    `Published benchmark test "${title}" (${category}) for cohort ${targetBatch || 'All Batches'}`,
    'info'
  );

  res.json({ success: true, message: 'Assessment published successfully and dispatched to students.' });
});

// Question Bank Management
staffRouter.get('/questions', (req: AuthRequest, res: Response) => {
  const category = req.query.category as string;
  const questions =
    category && category !== 'All'
      ? db.aptitudeQuestions.filter((q) => q.category === category)
      : db.aptitudeQuestions;
  res.json({ success: true, questions });
});

staffRouter.post('/questions', (req: AuthRequest, res: Response) => {
  const { category, question, options, correctAnswer, explanation, difficulty, formulaOrTip } = req.body;

  if (!question || !options || options.length < 2 || correctAnswer === undefined) {
    res.status(400).json({ success: false, error: 'Invalid question payload. Must include question, options, and correctAnswer.' });
    return;
  }

  const newQuestion: AptitudeQuestion = {
    id: `apt_q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    category: category || 'Quantitative',
    question,
    options,
    correctAnswer: Number(correctAnswer),
    explanation: explanation || 'Standard algorithmic derivation.',
    difficulty: difficulty || 'Medium',
    formulaOrTip,
  };

  db.aptitudeQuestions.unshift(newQuestion);
  db.logAudit(req.user?.name || 'Staff', 'staff', `Added question to question bank: ${question.substring(0, 40)}...`, 'info');

  res.json({ success: true, question: newQuestion });
});

staffRouter.put('/questions/:id', (req: AuthRequest, res: Response) => {
  const idx = db.aptitudeQuestions.findIndex((q) => q.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ success: false, error: 'Question not found' });
    return;
  }

  db.aptitudeQuestions[idx] = {
    ...db.aptitudeQuestions[idx],
    ...req.body,
    id: req.params.id,
  };

  res.json({ success: true, question: db.aptitudeQuestions[idx] });
});

staffRouter.delete('/questions/:id', (req: AuthRequest, res: Response) => {
  const initialLen = db.aptitudeQuestions.length;
  db.aptitudeQuestions = db.aptitudeQuestions.filter((q) => q.id !== req.params.id);

  if (db.aptitudeQuestions.length === initialLen) {
    res.status(404).json({ success: false, error: 'Question not found' });
    return;
  }

  db.logAudit(req.user?.name || 'Staff', 'staff', `Deleted question ${req.params.id} from bank`, 'warning');
  res.json({ success: true, message: 'Question deleted successfully' });
});

staffRouter.post('/questions/import', (req: AuthRequest, res: Response) => {
  const { questions } = req.body;
  if (!Array.isArray(questions) || questions.length === 0) {
    res.status(400).json({ success: false, error: 'Expected an array of question objects to import.' });
    return;
  }

  let importedCount = 0;
  for (const q of questions) {
    if (q.question && Array.isArray(q.options) && q.correctAnswer !== undefined) {
      db.aptitudeQuestions.unshift({
        id: `apt_q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        category: q.category || 'Quantitative',
        question: q.question,
        options: q.options,
        correctAnswer: Number(q.correctAnswer),
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Medium',
        formulaOrTip: q.formulaOrTip,
      });
      importedCount++;
    }
  }

  db.logAudit(req.user?.name || 'Staff', 'staff', `Bulk imported ${importedCount} questions into question bank`, 'info');
  res.json({ success: true, importedCount });
});

// Analytics
staffRouter.get('/analytics', (_req: AuthRequest, res: Response) => {
  const totalStudents = db.studentReports.length;
  const readyCount = db.studentReports.filter((r) => r.status === 'Ready for Placements').length;
  const avgReadiness = Math.round(
    db.studentReports.reduce((sum, r) => sum + r.overallReadiness, 0) / (totalStudents || 1)
  );

  res.json({
    success: true,
    analytics: {
      totalStudents,
      readyForPlacementsCount: readyCount,
      cohortReadinessAverage: avgReadiness,
      activeBatchesCount: db.batches.length,
      averageAptitude: 82.4,
      averageCodingSolved: 112,
    },
  });
});
