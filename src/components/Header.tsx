import React from 'react';
import { Pencil, RotateCcw } from 'lucide-react';

interface HeaderProps {
  hasGuide: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasGuide, onReset }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-neutral-200 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
            <Pencil className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-neutral-900 leading-none">
              Sketch Tutor
            </h1>
            <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
              Step-by-step drawing breakdown
            </p>
          </div>
        </div>

        {hasGuide && (
          <button
            onClick={onReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded border border-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Drawing</span>
          </button>
        )}
      </div>
    </header>
  );
};
