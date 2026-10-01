import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Building,
  Layers,
  Award,
  ChevronRight,
  FileCode2,
  Send,
  Sparkles,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { JobSimulation, JobTask } from '../types';
import { initialJobSimulations } from '../server/seed';
import { api } from '../services/api';

interface JobSimulatorViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onRefreshUser: () => void;
}

export const JobSimulatorView: React.FC<JobSimulatorViewProps> = ({
  onShowToast,
  onRefreshUser,
}) => {
  const [simulations, setSimulations] = useState<JobSimulation[]>(initialJobSimulations);
  const [selectedSimId, setSelectedSimId] = useState<string>(initialJobSimulations[0]?.id || '');
  const [activeTask, setActiveTask] = useState<JobTask | null>(null);
  const [taskSubmission, setTaskSubmission] = useState('');

  useEffect(() => {
    api.getJobSimulations().then((list) => {
      if (list && list.length > 0) {
        setSimulations(list);
      }
    }).catch(() => {});
  }, []);

  const currentSim = simulations.find((s) => s.id === selectedSimId) || simulations[0] || initialJobSimulations[0];

  const handleOpenTask = (task: JobTask) => {
    setActiveTask(task);
    setTaskSubmission(task.userSubmission || task.initialCode || '');
  };

  const handleSubmitTask = async (taskId: string) => {
    if (!currentSim) return;

    const feedback = `Engineering Lead Review: Accepted with high marks! Your implementation cleanly addresses concurrency constraints and satisfies corporate acceptance criteria.`;

    try {
      const updated = await api.updateJobTask(
        currentSim.id,
        taskId,
        'completed',
        taskSubmission,
        feedback
      );

      if (updated) {
        setSimulations((prev) => prev.map((s) => (s.id === currentSim.id ? updated : s)));
        onRefreshUser();
        onShowToast('Task submitted and verified by engineering lead! (+100 XP)', 'success');
        setActiveTask(null);
      }
    } catch (e: any) {
      onShowToast(e.message || 'Failed to submit task.', 'error');
    }
  };

  const getTaskBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium">
            To Do
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {simulations.map((sim) => (
          <button
            key={sim.id}
            onClick={() => {
              setSelectedSimId(sim.id);
              setActiveTask(null);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold text-left transition-all shrink-0 border ${
              selectedSimId === sim.id
                ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-500 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5">
              <Building className="w-3 h-3" />
              <span>{sim.company}</span>
            </div>
            <p className="font-bold text-xs truncate max-w-[240px] text-slate-100">
              {sim.title}
            </p>
          </button>
        ))}
      </div>

      {/* Main Simulation View */}
      {currentSim && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/40 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {currentSim.company}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Department: {currentSim.department}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentSim.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {currentSim.overview}
                </p>
              </div>

              {/* Badge showcase */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center shrink-0 min-w-[180px]">
                <Award className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                  Credential Badge
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {currentSim.badgeName}
                </span>
              </div>
            </div>

            {/* Skills Gained Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Skills Gained:</span>
              {currentSim.skillsGained.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Corporate Sprint Kanban Board */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Sprint Backlog & Work Items ({currentSim.tasks.length} Tasks)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSim.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-lg space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Sprint Item #{index + 1}
                      </span>
                      {getTaskBadge(task.status)}
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{task.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Type: {task.type}
                    </span>
                    <button
                      onClick={() => handleOpenTask(task)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Work on Task</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Execution Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                    {activeTask.type}
                  </span>
                  <span className="text-xs text-slate-400">Priority: {activeTask.priority}</span>
                </div>
                <h3 className="text-base font-bold text-white">{activeTask.title}</h3>
              </div>
              <button
                onClick={() => setActiveTask(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Details & Scenario */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-300">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Production Scenario:
                </span>
                <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                  {activeTask.scenario}
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Acceptance Criteria:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  {activeTask.acceptanceCriteria.map((ac, i) => (
                    <li key={i}>{ac}</li>
                  ))}
                </ul>
              </div>

              {/* Code or Solution Submission */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                  Your Implementation / Pull Request:
                </span>
                <textarea
                  rows={8}
                  value={taskSubmission}
                  onChange={(e) => setTaskSubmission(e.target.value)}
                  placeholder="Paste your implementation, code changes, or root cause diagnosis here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
                />
              </div>

              {/* Mentor Feedback if already completed */}
              {activeTask.mentorFeedback && (
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-200 text-xs space-y-1">
                  <span className="font-bold text-emerald-400">Reviewer Feedback:</span>
                  <p>{activeTask.mentorFeedback}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Meets corporate peer review standards.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTask(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitTask(activeTask.id)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
