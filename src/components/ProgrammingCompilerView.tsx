import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Terminal,
} from 'lucide-react';
import { CodeProblem, ProgrammingLanguage, CodeExecutionResult } from '../types';
import { initialCodeProblems } from '../server/seed';
import { api } from '../services/api';

interface ProgrammingCompilerViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onRefreshUser: () => void;
}

export const ProgrammingCompilerView: React.FC<ProgrammingCompilerViewProps> = ({
  onShowToast,
  onRefreshUser,
}) => {
  const [problems, setProblems] = useState<CodeProblem[]>(initialCodeProblems);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(initialCodeProblems[0]?.id || '');
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');

  useEffect(() => {
    api.getCodeProblems().then((list) => {
      if (list && list.length > 0) {
        setProblems(list);
      }
    }).catch(() => {});
  }, []);

  const currentProblem = problems.find((p) => p.id === selectedProblemId) || problems[0] || initialCodeProblems[0];

  const [code, setCode] = useState<string>(
    currentProblem?.starterCode[language] || ''
  );
  const [activeTab, setActiveTab] = useState<'description' | 'hints'>('description');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  const handleProblemChange = (probId: string) => {
    setSelectedProblemId(probId);
    const newProb = problems.find((p) => p.id === probId);
    if (newProb) {
      setCode(newProb.starterCode[language]);
    }
    setExecutionResult(null);
  };

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setLanguage(lang);
    if (currentProblem) {
      setCode(currentProblem.starterCode[lang] || '');
    }
    setExecutionResult(null);
  };

  const handleResetCode = () => {
    if (currentProblem) {
      setCode(currentProblem.starterCode[language] || '');
      setExecutionResult(null);
      onShowToast('Code reset to starter template.', 'info');
    }
  };

  const handleRunCode = async (isSubmit = false) => {
    setIsRunning(true);
    try {
      if (isSubmit) {
        const { result } = await api.submitCode(currentProblem.id, language, code);
        setExecutionResult(result);
        if (result.status === 'success') {
          onRefreshUser();
          onShowToast('Accepted! All test cases passed (+50 XP earned)!', 'success');
        } else {
          onShowToast('Test run completed with errors.', 'error');
        }
      } else {
        const res = await api.runCode(currentProblem.id, language, code);
        setExecutionResult(res);
        if (res.status === 'success') {
          onShowToast('Test cases executed successfully!', 'success');
        } else {
          onShowToast('Test run completed with errors.', 'error');
        }
      }
    } catch (e: any) {
      onShowToast(e.message || 'Execution timed out or failed.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Problem & Language Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Problem:</label>
          <select
            value={selectedProblemId}
            onChange={(e) => handleProblemChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {problems.map((prob) => (
              <option key={prob.id} value={prob.id}>
                {prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentProblem.difficulty === 'Easy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : currentProblem.difficulty === 'Medium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {currentProblem.difficulty}
          </span>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Acceptance: {currentProblem.acceptanceRate}
          </span>
        </div>

        {/* Right Language & Run/Submit */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as ProgrammingLanguage)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="javascript">JavaScript (ES2024)</option>
            <option value="python">Python 3.12</option>
            <option value="cpp">C++ 20 (g++)</option>
            <option value="java">Java 21</option>
          </select>

          <button
            onClick={handleResetCode}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={isRunning}
            onClick={() => handleRunCode(false)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Run Code</span>
          </button>

          <button
            disabled={isRunning}
            onClick={() => handleRunCode(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Editor & Problem Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Problem Details & Examples */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col h-[650px] shadow-xl">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'description'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'hints'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Hints ({currentProblem.hints?.length || 0})</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-300">
            {activeTab === 'description' ? (
              <>
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-base font-bold text-white mb-2">
                    {currentProblem.title}
                  </h2>
                  <p className="whitespace-pre-line text-slate-300 leading-relaxed font-sans">
                    {currentProblem.description}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                    Examples:
                  </span>
                  {currentProblem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1"
                    >
                      <p className="text-slate-400">
                        <strong className="text-slate-300">Input:</strong> {ex.input}
                      </p>
                      <p className="text-slate-400">
                        <strong className="text-emerald-400">Output:</strong> {ex.output}
                      </p>
                      {ex.explanation && (
                        <p className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-900">
                          {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="pt-2 space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                    Constraints:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
                    {currentProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Try solving first without hints to simulate live whiteboard conditions.
                </p>
                {currentProblem.hints && currentProblem.hints.length > 0 ? (
                  currentProblem.hints.map((hint, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-950 border border-amber-900/30 rounded-xl text-amber-200 text-xs leading-relaxed space-y-1"
                    >
                      <span className="font-bold text-amber-400">Hint {i + 1}:</span>
                      <p>{hint}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No hints available for this problem.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor & Console Output */}
        <div className="lg:col-span-7 flex flex-col h-[650px] space-y-4">
          {/* Editor Container */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-sans font-medium text-slate-300">
                  solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">
                Monaco Simulation Engine
              </span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-emerald-300 placeholder-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600 selection:text-white"
            />
          </div>

          {/* Execution Result / Console Tab */}
          <div className="h-56 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Test Execution Output</span>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{executionResult.executionTimeMs} ms</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{(executionResult.memoryKb / 1024).toFixed(1)} MB</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto font-mono text-xs">
              {isRunning ? (
                <div className="flex items-center gap-2 text-slate-400 py-4 justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Compiling and running against test suite...</span>
                </div>
              ) : executionResult ? (
                <div className="space-y-3">
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      executionResult.status === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {executionResult.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-bold">
                        {executionResult.status === 'success' ? 'Accepted' : 'Runtime Error'}
                      </span>
                    </div>
                    <span>
                      Passed {executionResult.passedTests}/{executionResult.totalTests} Tests
                    </span>
                  </div>

                  <p className="text-slate-300 whitespace-pre-line bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                    {executionResult.output}
                  </p>
                </div>
              ) : (
                <div className="text-slate-500 text-center py-6 font-sans text-xs">
                  Click "Run Code" or "Submit" to test your solution against test cases.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
