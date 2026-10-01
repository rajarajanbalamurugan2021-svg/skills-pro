import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building,
  TrendingUp,
  Activity,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Plus,
  X,
  Search,
} from 'lucide-react';
import { UserProfile, UserRole, UserStatus, AdminStats } from '../types';
import { initialAdminStats, initialUsers } from '../server/seed';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: UserProfile;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onRefreshUser: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onShowToast,
  onRefreshUser,
}) => {
  const [stats, setStats] = useState<AdminStats>(initialAdminStats);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [s, u] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(),
      ]);
      if (s) setStats(s);
      if (u && u.length > 0) setUsers(u);
    } catch (e) {}
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      onShowToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
      loadAdminData();
      onRefreshUser();
    } catch (e: any) {
      onShowToast(e.message || 'Failed to update role', 'error');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      onShowToast(`Account status updated to ${newStatus.toUpperCase()}`, 'success');
      loadAdminData();
    } catch (e: any) {
      onShowToast(e.message || 'Failed to update status', 'error');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    try {
      await api.broadcastAnnouncement(broadcastTitle);
      setIsBroadcastOpen(false);
      setBroadcastTitle('');
      onShowToast('Announcement broadcasted to entire campus portal!', 'success');
      loadAdminData();
    } catch (e: any) {
      onShowToast(e.message || 'Failed to broadcast', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Governance & Placement Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Administrative Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Institutional oversight across curriculum accreditation, multi-tenant student directories, enterprise partner tie-ups, and live security audits.
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all self-start sm:self-auto shrink-0"
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Notice</span>
        </button>
      </div>

      {/* KPI Stats 4-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Enrolled Students</span>
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-black text-white">
              {stats.totalStudents.toLocaleString()}
            </span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            +18% from last placement season
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-semibold text-slate-400">Active Placement Drives</span>
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-black text-white">{stats.activePlacementDrives}</span>
            <Building className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold block">
            Across 94 Corporate Partners
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-semibold text-slate-400">Campus Readiness Rate</span>
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-black text-emerald-400">
              {stats.averagePlacementReadiness}%
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] text-slate-500 block">Exceeds 75% tier-1 benchmark</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-1">
          <span className="text-xs font-semibold text-slate-400">Assessments Evaluated</span>
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-black text-white">
              {stats.assessmentsConducted.toLocaleString()}
            </span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            99.8% AI evaluation uptime
          </span>
        </div>
      </div>

      {/* Hiring Partners Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-cyan-400" />
          <span>Premier Hiring Partners & Current Openings</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.hiringPartners.map((partner, i) => (
            <div
              key={i}
              className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 text-center space-y-2 hover:border-slate-700 transition-all"
            >
              <span className="text-2xl block">{partner.logo}</span>
              <span className="font-bold text-xs text-white block">{partner.name}</span>
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-emerald-400">{partner.openings}</span> Openings
              </div>
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-bold">
                {partner.avgCtcLpa} LPA Avg
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* User Directory & Role Assignment */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">User Directory & Role Governance</h3>
            <p className="text-xs text-slate-400">
              Manage accounts and dynamically grant Student, Faculty Staff, or Administrator privileges.
            </p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Department / Affiliation</th>
                <th className="pb-3 font-semibold text-center">Current Role</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <span className="font-bold text-slate-100 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 font-medium">
                    {u.department || u.college || 'Engineering Faculty'}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : u.role === 'staff'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => handleStatusChange(u.id, u.status === 'suspended' ? 'active' : 'suspended')}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                        u.status === 'suspended'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                      title="Click to toggle account status"
                    >
                      {u.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="student">Role: Student</option>
                      <option value="staff">Role: Staff</option>
                      <option value="admin">Role: Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live System & Activity Audit Trail */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Live Operations & Security Audit Trail</span>
        </h3>

        <div className="divide-y divide-slate-800/60">
          {stats.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    act.type === 'success'
                      ? 'bg-emerald-400'
                      : act.type === 'warning'
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                />
                <div>
                  <span className="font-semibold text-white">{act.user}</span>{' '}
                  <span className="text-slate-400">({act.role}):</span>{' '}
                  <span className="text-slate-200">{act.action}</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 shrink-0 ml-4">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <form
            onSubmit={handleBroadcast}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Broadcast Campus Notice</h3>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">
                  Announcement Headline
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Google & Microsoft Placement Slots Confirmed for Oct 14"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30"
              >
                Broadcast Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
