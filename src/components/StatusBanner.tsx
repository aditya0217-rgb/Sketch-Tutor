import React from 'react';
import { AlertCircle, KeyRound, RefreshCw } from 'lucide-react';

interface StatusBannerProps {
  isConfigured: boolean | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  isConfigured,
  onRefresh,
  isLoading,
}) => {
  if (isConfigured === true || isConfigured === null) {
    return null;
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-800">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded bg-neutral-200 text-neutral-700 shrink-0 mt-0.5">
          <KeyRound className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <h2 className="font-semibold text-neutral-900 mb-1 flex items-center gap-1.5">
            Gemini AI API Key Required
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Sketch Tutor strictly uses genuine multimodal AI analysis and will never display
            fabricated or placeholder drawing steps. To analyze your reference image and generate
            real step-by-step guides, ensure the <code className="px-1 py-0.5 bg-neutral-200 rounded font-mono text-xs text-neutral-800">GEMINI_API_KEY</code> environment variable is set in the AI Studio Secrets panel or <code className="px-1 py-0.5 bg-neutral-200 rounded font-mono text-xs text-neutral-800">.env</code> file.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Re-check Key Status
            </button>
            <span className="text-[11px] text-neutral-500">
              Auto-detects upon secret configuration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
