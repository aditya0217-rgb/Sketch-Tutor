import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreviewCard } from './components/ImagePreviewCard';
import { TutorialViewer } from './components/TutorialViewer';
import { DrawingGuide } from './types';
import { AlertCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { prepareImageForAnalysis } from './utils/imageUtils';
import { ChatAssistant } from './components/ChatAssistant';

export default function App() {
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  // Selected image state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [fileName, setFileName] = useState<string>('');

  // Selected language (Natural Hinglish by default for conversational Indian guidance)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hinglish');

  // Guide generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [guide, setGuide] = useState<DrawingGuide | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check backend Gemini API key configuration on mount
  const checkBackendStatus = async () => {
    try {
      setCheckingStatus(true);
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setIsConfigured(data.configured);
      } else {
        setIsConfigured(false);
      }
    } catch (err) {
      console.warn('Could not contact /api/status:', err);
      setIsConfigured(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const handleImageSelected = (base64: string, type: string, name: string) => {
    setImageSrc(base64);
    setMimeType(type);
    setFileName(name);
    setErrorMessage(null);
    setGuide(null);
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setFileName('');
    setGuide(null);
    setErrorMessage(null);
  };

  const handleResetAll = () => {
    setImageSrc(null);
    setFileName('');
    setGuide(null);
    setErrorMessage(null);
  };

  const handleGenerateGuide = async () => {
    if (!imageSrc) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setLoadingStage('Analyzing image contour and subject...');

    const timer1 = setTimeout(() => {
      setLoadingStage('Breaking down geometric shapes & perspective...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setLoadingStage(
        selectedLanguage === 'hinglish'
          ? 'Structuring easy Natural Hinglish drawing steps...'
          : 'Formulating step-by-step beginner instructions...'
      );
    }, 3200);

    try {
      const prepared = await prepareImageForAnalysis(imageSrc, mimeType);

      const response = await fetch('/api/generate-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: prepared.base64DataUrl,
          mimeType: prepared.mimeType,
          userSkillLevel: 'beginner',
          language: selectedLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'AI_NOT_CONFIGURED') {
          setIsConfigured(false);
        }
        throw new Error(data.message || 'Failed to generate drawing guide.');
      }

      setGuide(data);
    } catch (err: any) {
      console.error('Error in handleGenerateGuide:', err);
      setErrorMessage(
        err.message || 'An error occurred while generating the tutorial. Please try again.'
      );
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsGenerating(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
      <Header hasGuide={Boolean(guide || imageSrc)} onReset={handleResetAll} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* API Key Configuration Status Banner */}
        <StatusBanner
          isConfigured={isConfigured}
          onRefresh={checkBackendStatus}
          isLoading={checkingStatus}
        />

        {/* Intro description if no image is uploaded */}
        {!imageSrc && !guide && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-1.5">
              Learn to draw anything step by step
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
              Upload any photo or object reference. Sketch Tutor breaks it down into easy geometric
              shapes, proportions, and light sources with friendly instructions in your preferred
              language — including conversational Natural Hinglish.
            </p>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-neutral-900 mb-0.5">
                Drawing Guide Error
              </span>
              <p className="text-neutral-600 leading-relaxed mb-2">{errorMessage}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateGuide}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-neutral-900 text-white rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay / state indicator */}
        {isGenerating && (
          <div className="mb-6 p-6 rounded-lg bg-neutral-50 border border-neutral-200 text-center">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Analyzing Your Reference Image
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
              {loadingStage || 'Processing with Gemini multimodal AI...'}
            </p>
          </div>
        )}

        {/* Step 1: Upload or Choose Image (if none currently selected) */}
        {!imageSrc && (
          <ImageUploader
            onImageSelected={handleImageSelected}
            isProcessing={isGenerating}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        )}

        {/* Step 2: Image Preview Card (if selected) */}
        {imageSrc && (
          <div className="space-y-6">
            <ImagePreviewCard
              imageSrc={imageSrc}
              fileName={fileName}
              onRemove={handleRemoveImage}
              onGenerate={handleGenerateGuide}
              isGenerating={isGenerating}
              hasGuide={Boolean(guide)}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            {/* Step 3: Generated Tutorial Details */}
            {guide && (
              <TutorialViewer
                guide={guide}
                onReset={handleResetAll}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onRegenerate={handleGenerateGuide}
                isGenerating={isGenerating}
              />
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 px-4 text-center text-[11px] text-neutral-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sketch Tutor • Mobile-First Art Learning in Natural Hinglish & Multilingual</span>
          <span>Powered by Gemini Multimodal AI</span>
        </div>
      </footer>

      {/* Floating AI Chatbot Assistant */}
      <ChatAssistant
        currentGuide={guide}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </div>
  );
}
