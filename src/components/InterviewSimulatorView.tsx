import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Bot,
  User,
  ShieldAlert,
} from 'lucide-react';
import {
  InterviewSession,
  InterviewQuestion,
  InterviewType,
  InterviewDifficulty,
} from '../types';
import { api } from '../services/api';

interface InterviewSimulatorViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onRefreshUser: () => void;
}

export const InterviewSimulatorView: React.FC<InterviewSimulatorViewProps> = ({
  onShowToast,
  onRefreshUser,
}) => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [selectedRole, setSelectedRole] = useState('Full Stack Software Engineer');
  const [selectedType, setSelectedType] = useState<InterviewType>('Technical Coding');
  const [selectedDiff, setSelectedDiff] = useState<InterviewDifficulty>('Mid');

  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const startNewInterview = () => {
    const newSession = api.startInterview(selectedRole, selectedType, selectedDiff);
    setSession(newSession);
    setCurrentIdx(0);
    setCandidateAnswer('');
    onShowToast(`Interview session started for ${selectedRole}`, 'info');
  };

  const handleEvaluateAnswer = async () => {
    if (!session || !candidateAnswer.trim()) return;

    const currentQ = session.questions[currentIdx];
    setIsEvaluating(true);

    try {
      const evaluation = await api.evaluateInterviewAnswer(
        currentQ.question,
        candidateAnswer,
        currentQ.category
      );

      const updatedQuestions = [...session.questions];
      updatedQuestions[currentIdx] = {
        ...currentQ,
        userAnswer: candidateAnswer,
        score: evaluation.overallScore,
        feedback: evaluation,
      };

      const updatedSession: InterviewSession = {
        ...session,
        questions: updatedQuestions,
      };

      setSession(updatedSession);
      onRefreshUser();
      onShowToast(`Answer evaluated! Score: ${evaluation.overallScore}/100`, 'success');
    } catch (err) {
      onShowToast('Evaluation failed. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      onShowToast('Microphone activated. Simulating voice transcription...', 'info');
      // Simulate speech-to-text typing
      setTimeout(() => {
        setCandidateAnswer(
          (prev) =>
            (prev ? prev + ' ' : '') +
            'In our microservices architecture, we resolved concurrent race conditions by adopting an event-driven Kafka stream and Redis distributed locks, resulting in zero double-charging incidents.'
        );
        setIsRecording(false);
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-900/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-600/20">
            <Video className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">AI Placement Interview Studio</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Practice real-time technical, architectural, and behavioral STAR interviews with instant AI speech analysis, score breakdowns, and sample answers.
            </p>
          </div>

          {/* Config Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="Frontend Engineer (React/TypeScript)">Frontend Engineer (React/TypeScript)</option>
                <option value="Backend Systems Engineer (Distributed Systems)">Backend Systems Engineer (Distributed Systems)</option>
                <option value="Data Engineer & AI Specialist">Data Engineer & AI Specialist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Interview Domain
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as InterviewType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Technical Coding">Technical Coding & DSA</option>
                <option value="System Design">System Design & High Scale</option>
                <option value="HR & Behavioral">HR & Behavioral (STAR)</option>
                <option value="Placement Manager">Campus Placement Director Round</option>
              </select>
            </div>
          </div>

          <button
            onClick={startNewInterview}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            Launch Mock Interview Simulation
          </button>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[currentIdx];
  const hasFeedback = Boolean(currentQ.feedback);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
              {session.type}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {session.role}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-100 mt-1">
            Question {currentIdx + 1} of {session.questions.length}
          </h2>
        </div>

        <button
          onClick={() => setSession(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Exit Interview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Interviewer Video Avatar & Question */}
        <div className="lg:col-span-5 space-y-4">
          {/* Simulated Video Feed */}
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
              alt="Interviewer"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

            {/* Video Label */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dr. Eleanor Vance (AI Placement Director)</span>
            </div>

            {/* Audio Wave Indicator */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 text-emerald-400 text-xs">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-semibold">Active</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Prompt:
            </span>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              "{currentQ.question}"
            </p>

            {/* Key points to cover */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 text-[11px]">
                Key Elements to Highlight:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                {currentQ.keyPointsToCover.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Candidate Answer & AI Feedback */}
        <div className="lg:col-span-7 space-y-4">
          {/* Answer Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Your Answer Response</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak or type your structured response here (Use the STAR framework: Situation, Task, Action, Result)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                {candidateAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                disabled={!candidateAnswer.trim() || isEvaluating}
                onClick={handleEvaluateAnswer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{isEvaluating ? 'AI Scoring...' : 'Analyze with AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Feedback Panel */}
          {hasFeedback && currentQ.feedback && (
            <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl p-5 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">AI Evaluation Scorecard</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>{currentQ.score}/100</span>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Relevance</span>
                  <span className="font-bold text-indigo-300">
                    {currentQ.feedback.relevance}%
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Clarity</span>
                  <span className="font-bold text-indigo-300">
                    {currentQ.feedback.clarity}%
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Tech Accuracy</span>
                  <span className="font-bold text-indigo-300">
                    {currentQ.feedback.technicalAccuracy}%
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">STAR Method</span>
                  <span className="font-bold text-indigo-300">
                    {currentQ.feedback.starTechnique}%
                  </span>
                </div>
              </div>

              {/* Strong Points & Improvements */}
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Strengths:
                  </span>
                  <ul className="list-disc pl-4 text-slate-300 space-y-0.5 text-[11px]">
                    {currentQ.feedback.strongPoints.map((sp, i) => (
                      <li key={i}>{sp}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="font-bold text-amber-400 text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Growth Recommendations:
                  </span>
                  <ul className="list-disc pl-4 text-slate-300 space-y-0.5 text-[11px]">
                    {currentQ.feedback.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Between Questions */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx((p) => p - 1);
                setCandidateAnswer(session.questions[currentIdx - 1]?.userAnswer || '');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Question</span>
            </button>

            <button
              disabled={currentIdx === session.questions.length - 1}
              onClick={() => {
                setCurrentIdx((p) => p + 1);
                setCandidateAnswer(session.questions[currentIdx + 1]?.userAnswer || '');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-colors"
            >
              <span>Next Question</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
