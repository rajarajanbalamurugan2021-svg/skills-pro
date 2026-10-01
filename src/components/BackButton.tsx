import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = 'Back',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-700/50 transition-all ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};
