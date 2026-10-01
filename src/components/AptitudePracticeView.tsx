import React, { useState, useEffect } from 'react';
import {
  Brain,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Flame,
  Zap,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { AptitudeQuestion, AptitudeCategory, AptitudeTestResult } from '../types';
import { api } from '../services/api';

interface AptitudePracticeViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onRefreshUser: () => void;
}

export const AptitudePracticeView: React.FC<AptitudePracticeViewProps> = ({
  onShowToast,
  onRefreshUser,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mode, setMode] = useState<'practice' | 'mock_test'>('practice');
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  // Timed Mock Exam state
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [testResult, setTestResult] = useState<AptitudeTestResult | null>(null);

  const categories: (string | AptitudeCategory)[] = [
    'All',
    'Quantitative',
    'Logical Reasoning',
    'Verbal Ability',
    'Core CS',
  ];

  useEffect(() => {
    loadQuestions();
  }, [selectedCategory]);

  const loadQuestions = async () => {
    try {
      const list = await api.getAptitudeQuestions(selectedCategory);
      setQuestions(list || []);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation({});
      setTestResult(null);
    } catch (e: any) {
      onShowToast('Failed to load questions.', 'error');
    }
  };

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isTestActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishMockTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft]);

  const startMockTest = () => {
    setIsTestActive(true);
    setTimeLeft(600);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTestResult(null);
    onShowToast('Timed mock test started! You have 10 minutes.', 'info');
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const finishMockTest = async () => {
    setIsTestActive(false);
    let correctCount = 0;
    const answersData = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
      };
    });

    const result: AptitudeTestResult = {
      id: `apt_res_${Date.now()}`,
      category: (selectedCategory === 'All' ? 'Comprehensive' : selectedCategory) as any,
      score: correctCount,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
      timeSpentSeconds: 600 - timeLeft,
      date: new Date().toLocaleDateString(),
      answers: answersData,
    };

    try {
      await api.submitAptitudeTest(result);
      setTestResult(result);
      onRefreshUser();
      onShowToast(`Test submitted! You scored ${result.score}/${result.total} (${result.percentage}%)`, 'success');
    } catch (e: any) {
      setTestResult(result);
      onShowToast('Test submitted locally.', 'info');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Top Controls: Mode & Category */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              disabled={isTestActive}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              } ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              disabled={isTestActive}
              onClick={() => {
                setMode('practice');
                setIsTestActive(false);
                setTestResult(null);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                mode === 'practice'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Practice Mode
            </button>
            <button
              disabled={isTestActive}
              onClick={() => {
                setMode('mock_test');
                setTestResult(null);
              }}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                mode === 'mock_test'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timed Exam Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {mode === 'mock_test' && !isTestActive && !testResult && (
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/50 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto">
            <Timer className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Campus Placement Mock Exam</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard 10-minute speed assessment replicating TCS, Cognizant, Infosys, and Amazon online screening rounds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
            <div>
              <span className="block text-slate-500 text-[11px]">Questions</span>
              <span className="font-bold text-base text-white">{questions.length}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[11px]">Time Limit</span>
              <span className="font-bold text-base text-white">10 Mins</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[11px]">Marking</span>
              <span className="font-bold text-base text-emerald-400">+10 XP / Q</span>
            </div>
          </div>

          <button
            onClick={startMockTest}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            Start Timed Assessment Now
          </button>
        </div>
      )}

      {/* Test Score Card Modal / View */}
      {testResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Assessment Complete!</h3>
            <p className="text-xs text-slate-400">
              Your results have been benchmarked against campus placement standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                {testResult.percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Score: <strong className="text-white">{testResult.score}</strong> of {testResult.total} questions correct • Time: {formatTime(testResult.timeSpentSeconds)}
            </p>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${testResult.percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setTestResult(null);
                setMode('practice');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Review with Explanations
            </button>
            <button
              onClick={startMockTest}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-colors"
            >
              Retake Mock Test
            </button>
          </div>
        </div>
      )}

      {/* Active Question View (Practice or Active Test) */}
      {(mode === 'practice' || isTestActive) && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Box */}
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header: Question Meta & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[11px] font-medium">
                  {currentQ.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    currentQ.difficulty === 'Hard'
                      ? 'text-rose-400 bg-rose-500/10'
                      : currentQ.difficulty === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>

              {isTestActive && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                  <Timer className="w-4 h-4 animate-spin [animation-duration:4s]" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isCorrect = currentQ.correctAnswer === optIdx;
                const revealed = mode === 'practice' && showExplanation[currentIndex];

                let optionStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';

                if (revealed) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-950/50 border-rose-500/50 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-950/50 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentIndex, optIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {revealed && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {revealed && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Practice Mode: Reveal Explanation */}
            {mode === 'practice' && (
              <div className="pt-2">
                {!showExplanation[currentIndex] ? (
                  <button
                    onClick={() => {
                      setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Check Solution & Explanation</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-900/40 space-y-2 animate-fade-in text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Correct Answer: Option {String.fromCharCode(65 + currentQ.correctAnswer)}
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                    {currentQ.formulaOrTip && (
                      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 font-medium">
                        💡 Formula / Speed Tip: {currentQ.formulaOrTip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {isTestActive ? (
                <button
                  onClick={finishMockTest}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
                >
                  Submit Test Now
                </button>
              ) : null}

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Question Palette
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white shadow-md'
                        : isAnswered
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-800" />
                <span>Unvisited</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
