import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: {
    label: string;
    onClick?: () => void;
  }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 overflow-x-auto py-1">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Platform</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="hover:text-indigo-400 transition-colors font-medium whitespace-nowrap"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-200 font-semibold whitespace-nowrap">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
