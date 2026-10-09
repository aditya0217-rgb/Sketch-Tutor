import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  SunMedium,
  Shapes,
  Pencil,
  AlertTriangle,
  Lightbulb,
  Check,
  Eye,
  ListFilter,
  CheckSquare,
  Square,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { DrawingGuide } from '../types';
import { PracticeTimer } from './PracticeTimer';
import { LanguageSelector } from './LanguageSelector';

interface TutorialViewerProps {
  guide: DrawingGuide;
  onReset: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onRegenerate: () => void;
  isGenerating?: boolean;
}

export const TutorialViewer: React.FC<TutorialViewerProps> = ({
  guide,
  onReset,
  selectedLanguage,
  onLanguageChange,
  onRegenerate,
  isGenerating = false,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedTools, setCheckedTools] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const totalSteps = guide.steps.length;
  const activeStep = guide.steps[activeStepIndex] || guide.steps[0];

  const toggleStepCompletion = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((n) => n !== stepNum) : [...prev, stepNum]
    );
  };

  const toggleTool = (index: number) => {
    setCheckedTools((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleNextStep = () => {
    if (activeStepIndex < totalSteps - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100);

  const handleCopySummary = () => {
    const summaryText = `SKETCH TUTOR: ${guide.subjectName.toUpperCase()}
Difficulty: ${guide.difficulty} | Est. Time: ${guide.estimatedMinutes} mins
Light Source: ${guide.lightSourceDirection}

STEPS:
${guide.steps
  .map(
    (s) =>
      `${s.stepNumber}. ${s.title}\n- ${s.instruction}\n- Tip: ${s.actionableTip}\n- Check: ${s.selfCheck}\n`
  )
  .join('\n')}
Proportions Rule: ${guide.proportionsTip}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Quick Language Switcher Banner */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-800 shrink-0">Language:</span>
          <div className="w-full sm:w-64">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              disabled={isGenerating}
              compact
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors disabled:opacity-50 shrink-0 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regenerate in Selected Language</span>
        </button>
      </div>

      {/* Subject Header & Quick Overview */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                {guide.difficulty}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{guide.estimatedMinutes} mins
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
              {guide.subjectName}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PracticeTimer initialMinutes={guide.estimatedMinutes} />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
          {guide.summary}
        </p>

        {/* Essential Overview Cards (Shapes, Light, Proportions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 text-xs">
          {/* Key Geometric Shapes */}
          <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 mb-1.5">
              <Shapes className="w-3.5 h-3.5 text-neutral-600" />
              <span>Foundation Shapes</span>
            </div>
            <ul className="space-y-1 text-neutral-600">
              {guide.keyGeometricShapes.map((ks, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-neutral-400">•</span>
                  <span>
                    <strong className="text-neutral-800 font-medium">{ks.shape}:</strong>{' '}
                    {ks.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Light & Shadow Direction */}
          <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 mb-1.5">
              <SunMedium className="w-3.5 h-3.5 text-neutral-600" />
              <span>Light & Shadow Angle</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {guide.lightSourceDirection}
            </p>
          </div>

          {/* Proportions Tip */}
          <div className="p-3 rounded-md bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800 mb-1.5">
              <Eye className="w-3.5 h-3.5 text-neutral-600" />
              <span>Proportions Rule</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {guide.proportionsTip}
            </p>
          </div>
        </div>

        {/* 60s Warmup drill */}
        {guide.warmupExercise && (
          <div className="mt-3 p-3 rounded-md bg-neutral-50 border border-neutral-200 flex items-start gap-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Quick 60-Second Warmup Drill:
              </span>
              <p className="text-neutral-600 leading-relaxed">
                {guide.warmupExercise}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Pencils & Tools */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs font-semibold text-neutral-900">
              Recommended Tools Checklist
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            Tap to check off
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {guide.recommendedPencils.map((tool, idx) => {
            const isChecked = checkedTools.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleTool(idx)}
                className={`flex items-center gap-2.5 p-2 rounded border text-left transition-colors ${
                  isChecked
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-500 line-through'
                    : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span className="truncate">{tool}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Navigation Bar */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-900">
                Tutorial Progress
              </span>
              <span className="text-xs text-neutral-500">
                ({completedSteps.length} of {totalSteps} steps completed)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full sm:w-64 bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden border border-neutral-200">
              <div
                className="bg-neutral-900 h-1.5 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* View mode toggle */}
          <div className="inline-flex rounded-md border border-neutral-200 p-0.5 bg-neutral-50 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('focused')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                viewMode === 'focused'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Step Focus
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Steps
            </button>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {guide.steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isActive = viewMode === 'focused' && activeStepIndex === idx;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => {
                  setActiveStepIndex(idx);
                  setViewMode('focused');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors shrink-0 ${
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : isCompleted
                    ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-neutral-700" />
                ) : (
                  <span className="text-[10px] opacity-70">#{step.stepNumber}</span>
                )}
                <span>Step {step.stepNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Steps Content */}
      {viewMode === 'focused' ? (
        /* Focused Mode: Single Step view */
        <div className="bg-white border border-neutral-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Step {activeStep.stepNumber} of {totalSteps}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                {activeStep.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => toggleStepCompletion(activeStep.stepNumber)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                completedSteps.includes(activeStep.stepNumber)
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {completedSteps.includes(activeStep.stepNumber) ? 'Completed' : 'Mark as Done'}
              </span>
            </button>
          </div>

          {/* Primary Instruction */}
          <div className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal bg-neutral-50 p-4 rounded-md border border-neutral-200">
            {activeStep.instruction}
          </div>

          {/* Actionable Beginner Tip */}
          <div className="p-3.5 rounded-md bg-white border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-700">
            <Lightbulb className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Beginner Tip:
              </span>
              <p className="leading-relaxed">{activeStep.actionableTip}</p>
            </div>
          </div>

          {/* Self-Check Question */}
          <div className="p-3.5 rounded-md bg-white border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Self-Check:
              </span>
              <p className="leading-relaxed">{activeStep.selfCheck}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md border border-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs font-medium text-neutral-500">
              {activeStepIndex + 1} / {totalSteps}
            </span>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStepIndex === totalSteps - 1}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* All Steps Overview Mode */
        <div className="space-y-4">
          {guide.steps.map((step) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            return (
              <div
                key={step.stepNumber}
                className={`bg-white border rounded-lg p-5 shadow-xs transition-colors ${
                  isCompleted ? 'border-neutral-300 bg-neutral-50/50' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-neutral-900 text-white text-xs font-semibold">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-neutral-900">
                      {step.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStepCompletion(step.stepNumber)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      isCompleted
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-3 pl-8">
                  {step.instruction}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 text-xs">
                  <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold text-neutral-900 block mb-0.5">
                      Tip:
                    </span>
                    <span className="text-neutral-600 leading-relaxed">
                      {step.actionableTip}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200">
                    <span className="font-semibold text-neutral-900 block mb-0.5">
                      Self-Check:
                    </span>
                    <span className="text-neutral-600 leading-relaxed">
                      {step.selfCheck}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Common Mistakes to Avoid */}
      {guide.commonMistakesToAvoid && guide.commonMistakesToAvoid.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-neutral-800">
            <AlertTriangle className="w-4 h-4 text-neutral-700" />
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900">
              Common Beginner Pitfalls to Avoid
            </h3>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-600">
            {guide.commonMistakesToAvoid.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400 font-bold">•</span>
                <span className="leading-relaxed">{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 active:bg-neutral-100 rounded-md border border-neutral-200 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedNotice ? 'Tutorial Copied to Clipboard!' : 'Copy Lesson Text'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md border border-neutral-200 transition-colors"
        >
          <span>Choose Another Image</span>
        </button>
      </div>
    </div>
  );
};
