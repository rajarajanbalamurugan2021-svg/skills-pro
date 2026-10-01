import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Phone,
  Briefcase,
  Flame,
  Award,
  Trophy,
  CheckCircle2,
  Github,
  Linkedin,
  Edit2,
  Save,
  X,
  Target,
} from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface ProfileViewProps {
  currentUser: UserProfile;
  onProfileUpdated: () => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onProfileUpdated,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    college: currentUser.college || '',
    department: currentUser.department || '',
    degree: currentUser.degree || '',
    graduationYear: currentUser.graduationYear || 2025,
    phone: currentUser.phone || '',
    targetRole: currentUser.targetRole || '',
    bio: currentUser.bio || '',
    skills: currentUser.skills.join(', '),
  });

  const handleSave = () => {
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    api.updateProfile({
      name: formData.name,
      email: formData.email,
      college: formData.college,
      department: formData.department,
      degree: formData.degree,
      graduationYear: Number(formData.graduationYear),
      phone: formData.phone,
      targetRole: formData.targetRole,
      bio: formData.bio,
      skills: skillsArray,
    });

    onProfileUpdated();
    setIsEditing(false);
    onShowToast('Profile updated successfully!', 'success');
  };

  // Mock 14-day activity heatmap
  const activityDays = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    active: i > 8 && i % 3 !== 0,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                <p className="text-xs sm:text-sm text-indigo-400 font-semibold">
                  {currentUser.targetRole || 'Full Stack Engineer'}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all self-center sm:self-auto"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              {currentUser.bio || 'Aspiring software engineer preparing for placements.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>{currentUser.college || 'Engineering Campus'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Class of {currentUser.graduationYear || 2025}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-semibold mb-0.5">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>Streak</span>
            </div>
            <span className="text-lg font-extrabold text-white">{currentUser.streakDays} Days</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-semibold mb-0.5">
              <Award className="w-4 h-4" />
              <span>Career XP</span>
            </div>
            <span className="text-lg font-extrabold text-white">{currentUser.points}</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-0.5">
              <Trophy className="w-4 h-4" />
              <span>Campus Rank</span>
            </div>
            <span className="text-lg font-extrabold text-white">#{currentUser.rank || 4}</span>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evaluations</span>
            </div>
            <span className="text-lg font-extrabold text-white">
              {currentUser.completedAssessments} Done
            </span>
          </div>
        </div>
      </div>

      {/* Skills Matrix Pill Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Core Competencies & Endorsed Skills</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Practice Streak Activity Heatmap */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Practice Consistency (Past 4 Weeks)</span>
          </h3>
          <span className="text-xs text-slate-400">Current Streak: {currentUser.streakDays} Days</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
          {activityDays.map((d) => (
            <div
              key={d.day}
              className={`h-7 rounded-lg transition-all ${
                d.active
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/80'
              }`}
              title={`Day ${d.day}: ${d.active ? 'Solved daily exercises' : 'Rest day'}`}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-500 text-right">Consistent daily practice accelerates recruitment screening by 3.2x.</p>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Edit Student Placement Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">College / Institute</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Target Engineering Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Full Stack & AI Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, Python, DSA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
