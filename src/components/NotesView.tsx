import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Search,
  Tag,
  Check,
  X,
  Code2,
} from 'lucide-react';
import { Note } from '../types';
import { initialNotes } from '../server/seed';
import { api } from '../services/api';

interface NotesViewProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onShowToast }) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'Algorithms',
    tags: [],
    isPinned: false,
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      if (data && data.length > 0) setNotes(data);
    } catch (e) {}
  };

  const categories = ['All', 'Algorithms', 'Interviews', 'Databases', 'General'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || n.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleSave = async () => {
    if (!currentNote.title?.trim() || !currentNote.content?.trim()) {
      onShowToast('Please provide both a title and content for your note.', 'error');
      return;
    }

    const noteToSave: Note = {
      id: currentNote.id || `note_${Date.now()}`,
      title: currentNote.title.trim(),
      content: currentNote.content.trim(),
      category: currentNote.category || 'General',
      tags: currentNote.tags || ['Study Notes'],
      updatedAt: 'Just now',
      isPinned: Boolean(currentNote.isPinned),
    };

    try {
      const saved = await api.saveNote(noteToSave);
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === saved.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
      setIsEditing(false);
      setCurrentNote({ title: '', content: '', category: 'Algorithms', tags: [], isPinned: false });
      onShowToast('Note saved successfully!', 'success');
    } catch (e: any) {
      onShowToast('Failed to save note.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      onShowToast('Note deleted.', 'info');
    } catch (e) {
      onShowToast('Failed to delete note.', 'error');
    }
  };

  const handleTogglePin = async (note: Note) => {
    const updated = { ...note, isPinned: !note.isPinned };
    try {
      const saved = await api.saveNote(updated);
      setNotes((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === c
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentNote({
              title: '',
              content: '',
              category: 'Algorithms',
              tags: ['Revision'],
              isPinned: false,
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Revision Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl space-y-4 ${
              note.isPinned
                ? 'border-indigo-500/50 shadow-indigo-500/5'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                  {note.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePin(note)}
                    className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                      note.isPinned ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                    title={note.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentNote(note);
                      setIsEditing(true);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{note.title}</h3>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap line-clamp-6 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-850">
                {note.content}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{note.updatedAt}</span>
              <div className="flex items-center gap-1">
                {note.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Note Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {currentNote.id ? 'Edit Study Note' : 'Create New Study Note'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={currentNote.title || ''}
                  onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  placeholder="e.g. Graph Cycle Detection BFS vs DFS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={currentNote.category || 'Algorithms'}
                  onChange={(e) => setCurrentNote({ ...currentNote, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Algorithms">Algorithms & DSA</option>
                  <option value="Interviews">Behavioral & HR</option>
                  <option value="Databases">Databases & SQL</option>
                  <option value="System Design">System Design</option>
                  <option value="General">General Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Content (Markdown / Code snippets)
                </label>
                <textarea
                  rows={8}
                  value={currentNote.content || ''}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  placeholder="Write formulas, algorithms, or STAR examples..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
