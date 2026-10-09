import React from 'react';
import { Languages } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
  className = '',
  compact = false,
}) => {
  const currentLang =
    LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <label
            htmlFor="language-select"
            className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-neutral-600" />
            <span>Tutorial Language</span>
          </label>
          {selectedLanguage === 'hinglish' && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-300">
              Natural Chat Style
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-white border border-neutral-300 hover:border-neutral-400 focus:border-neutral-900 focus:outline-hidden rounded-md px-3 py-2 text-xs font-medium text-neutral-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pr-8 shadow-2xs"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name} — {lang.nativeName}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {!compact && currentLang.description && (
        <p className="text-[11px] text-neutral-500 leading-tight">
          {currentLang.description}
        </p>
      )}
    </div>
  );
};
