import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200',
    error: 'bg-rose-950/80 border-rose-500/30 text-rose-200',
    info: 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-bounce-in max-w-md ${bgStyles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
