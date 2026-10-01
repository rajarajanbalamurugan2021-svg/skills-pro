import React, { useState, useEffect } from 'react';
import {
  Activity,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Target,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { SkillMetric } from '../types';
import { initialSkillMetrics } from '../server/seed';
import { api } from '../services/api';

interface SkillAnalyzerViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const SkillAnalyzerView: React.FC<SkillAnalyzerViewProps> = ({ onShowToast }) => {
  const [skills, setSkills] = useState<SkillMetric[]>(initialSkillMetrics);

  useEffect(() => {
    api.getSkillMetrics().then((list) => {
      if (list && list.length > 0) setSkills(list);
    }).catch(() => {});
  }, []);

  const overallScore = Math.round(
    skills.reduce((acc: number, s: SkillMetric) => acc + s.score, 0) / (skills.length || 1)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Advanced':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Proficient':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Placement Readiness Quotient */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-900/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tier-1 Placement Verification Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Placement Readiness Index: <span className="text-indigo-400">{overallScore}%</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Your technical proficiency index exceeds the campus tier-1 cutoff (75%). You are eligible for fast-track interview screening with 48+ hiring partners.
          </p>
        </div>

        {/* Circular Dial Representation */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[200px]">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white">{overallScore}%</span>
              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                Readiness
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => {
          const isAboveBenchmark = skill.score >= skill.benchmark;

          return (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-indigo-500/40 transition-all shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {skill.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${getStatusColor(
                    skill.status
                  )}`}
                >
                  {skill.status}
                </span>
              </div>

              {/* Progress and Benchmark Comparison */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Your Score:</span>
                  <span className="font-bold text-white">{skill.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full ${
                      skill.score >= 80
                        ? 'bg-emerald-500'
                        : skill.score >= 70
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${skill.score}%` }}
                  />
                  {/* Benchmark indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-400"
                    style={{ left: `${skill.benchmark}%` }}
                    title={`Industry Benchmark: ${skill.benchmark}%`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Zero</span>
                  <span>Target Benchmark: {skill.benchmark}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-slate-300">
                  {skill.recommendedAction}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
