import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title = 'Unsaved Changes',
  message = 'You have unsaved changes in your current session. If you leave now, your progress may be lost. Are you sure you want to proceed?',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            Stay Here
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 transition-all"
          >
            Leave & Discard
          </button>
        </div>
      </div>
    </div>
  );
};
