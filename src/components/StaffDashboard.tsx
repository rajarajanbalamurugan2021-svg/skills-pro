import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart3,
  Calendar,
  Filter,
  X,
  Send,
  Building,
} from 'lucide-react';
import { UserProfile, StaffBatch, StudentProgressReport } from '../types';
import { initialBatches, initialStudentReports } from '../server/seed';
import { api } from '../services/api';

interface StaffDashboardProps {
  currentUser: UserProfile;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  onShowToast,
}) => {
  const [batches, setBatches] = useState<StaffBatch[]>(initialBatches);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState<StudentProgressReport[]>(initialStudentReports);

  useEffect(() => {
    loadStaffData();
  }, [selectedBatchId]);

  const loadStaffData = async () => {
    try {
      const [batchList, reportList] = await Promise.all([
        api.getBatches(),
        api.getStudentReports(selectedBatchId),
      ]);
      if (batchList && batchList.length > 0) setBatches(batchList);
      if (reportList && reportList.length > 0) setReports(reportList);
    } catch (e) {}
  };

  // Create assessment modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Data Structures');
  const [targetBatch, setTargetBatch] = useState('CSE 2025 - Sec A');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesBatch =
      selectedBatchId === 'all' || r.batch.toLowerCase().includes(selectedBatchId.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    try {
      await api.createAssessment(newTestTitle, newTestCategory, targetBatch);
      setIsModalOpen(false);
      setNewTestTitle('');
      onShowToast(`Assessment "${newTestTitle}" dispatched to ${targetBatch}!`, 'success');
      loadStaffData();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to dispatch assessment.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Placement Training Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor real-time aptitude progress, coding problem submissions, and campus placement eligibility for 2025 graduates across departments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Benchmark Test</span>
        </button>
      </div>

      {/* Batch Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  {batch.department}
                </span>
                <h3 className="text-base font-bold text-white">{batch.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {batch.placementReadinessRate}% Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Students</span>
                <span className="font-bold text-white text-sm">{batch.totalStudents}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Avg Aptitude</span>
                <span className="font-bold text-indigo-400 text-sm">{batch.averageAptitude}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Avg Coding</span>
                <span className="font-bold text-emerald-400 text-sm">{batch.averageCoding}%</span>
              </div>
            </div>

            {/* Top Performers in Batch */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-400">
                Top Performers in this Cohort:
              </span>
              <div className="flex items-center gap-3">
                {batch.topPerformers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="text-left text-[11px]">
                      <span className="font-bold text-slate-200 block truncate max-w-[100px]">
                        {p.name}
                      </span>
                      <span className="text-emerald-400 font-semibold">{p.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Roster Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Student Placement Tracker</h3>
            <p className="text-xs text-slate-400">
              Live tracking of coding problems solved, mock interviews, and assessment readiness.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Ready for Placements">Ready for Placements</option>
              <option value="Active">Active</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Batch</th>
                <th className="pb-3 font-semibold text-center">Problems Solved</th>
                <th className="pb-3 font-semibold text-center">Aptitude Avg</th>
                <th className="pb-3 font-semibold text-center">Mock Interviews</th>
                <th className="pb-3 font-semibold text-center">Readiness Index</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((row) => (
                <tr key={row.studentId} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-slate-100 block">{row.studentName}</span>
                    <span className="text-[11px] text-slate-500">{row.email}</span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-medium">{row.batch}</td>
                  <td className="py-3.5 text-center font-bold text-indigo-400">
                    {row.codingProblemsSolved}
                  </td>
                  <td className="py-3.5 text-center font-bold text-slate-200">
                    {row.aptitudeScoreAvg}%
                  </td>
                  <td className="py-3.5 text-center text-slate-300">
                    {row.mockInterviewsDone} Sessions
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="font-extrabold text-emerald-400">{row.overallReadiness}%</span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'Ready for Placements'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : row.status === 'Active'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleCreateAssessment}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Benchmark Assessment</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  placeholder="e.g. Speed Math & Logical Assessment III"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Domain / Category</label>
                <select
                  value={newTestCategory}
                  onChange={(e) => setNewTestCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                  <option value="Logical Reasoning">Logical Reasoning</option>
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="System Architecture">System Architecture</option>
                  <option value="Core CS (OS/DBMS/CN)">Core CS (OS/DBMS/CN)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Assign to Cohort</label>
                <select
                  value={targetBatch}
                  onChange={(e) => setTargetBatch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="CSE 2025 - Sec A">CSE 2025 - Sec A (Alpha)</option>
                  <option value="IT 2025 - Sec B">IT 2025 - Sec B</option>
                  <option value="All 2025 Batches">All 2025 Batches (Universal)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-lg shadow-amber-600/30"
              >
                Dispatch Assessment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
