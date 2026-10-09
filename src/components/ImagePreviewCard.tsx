import React, { useState } from 'react';
import { Trash2, Sparkles, Grid3X3, Maximize2, X, RefreshCw } from 'lucide-react';
import { GridOverlay } from './GridOverlay';
import { LanguageSelector } from './LanguageSelector';

interface ImagePreviewCardProps {
  imageSrc: string;
  fileName: string;
  onRemove: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasGuide: boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const ImagePreviewCard: React.FC<ImagePreviewCardProps> = ({
  imageSrc,
  fileName,
  onRemove,
  onGenerate,
  isGenerating,
  hasGuide,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [gridMode, setGridMode] = useState<'none' | 'ruleOfThirds' | 'grid4x4'>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cycleGrid = () => {
    if (gridMode === 'none') setGridMode('ruleOfThirds');
    else if (gridMode === 'ruleOfThirds') setGridMode('grid4x4');
    else setGridMode('none');
  };

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
        {/* Header toolbar */}
        <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span className="font-medium truncate max-w-[200px] sm:max-w-xs text-neutral-800">
            {fileName || 'Reference Image'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={cycleGrid}
              title={`Grid mode: ${gridMode}`}
              className={`p-1.5 rounded border text-xs transition-colors ${
                gridMode !== 'none'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="View full size"
              className="p-1.5 rounded bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={isGenerating}
              title="Remove image"
              className="p-1.5 rounded bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="relative bg-neutral-100 flex items-center justify-center min-h-[220px] max-h-[380px] sm:max-h-[440px] overflow-hidden">
          <img
            src={imageSrc}
            alt="Reference preview"
            className="w-full h-full max-h-[380px] sm:max-h-[440px] object-contain select-none"
          />
          <GridOverlay gridType={gridMode} />
        </div>

        {/* Language Selection & Action Controls */}
        <div className="p-4 bg-white border-t border-neutral-200 space-y-3">
          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              disabled={isGenerating}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-xs text-neutral-500 w-full sm:w-auto text-center sm:text-left">
              {gridMode === 'none' ? (
                <span>Tip: Tap grid icon above to enable measuring lines.</span>
              ) : gridMode === 'ruleOfThirds' ? (
                <span>Showing 3×3 Rule of Thirds grid for proportions.</span>
              ) : (
                <span>Showing 4×4 Fine grid for contour alignment.</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!hasGuide ? (
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-md hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Image...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Drawing Guide</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Regenerating Guide...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Regenerate Guide</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded bg-neutral-900">
            <img
              src={imageSrc}
              alt="Fullscreen reference"
              className="max-h-[85vh] w-auto object-contain"
            />
            <GridOverlay gridType={gridMode} />
          </div>
        </div>
      )}
    </>
  );
};
