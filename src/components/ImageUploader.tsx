import React, { useRef, useState } from 'react';
import { Upload, Camera, AlertCircle, ImageIcon, Sparkles } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImage } from '../types';
import { prepareImageForAnalysis } from '../utils/imageUtils';
import { LanguageSelector } from './LanguageSelector';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string, fileName: string) => void;
  isProcessing: boolean;
  disabled?: boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isProcessing,
  disabled = false,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage(
        `Unsupported file type (${file.type || 'unknown'}). Please upload a JPG, PNG, WEBP, or SVG image.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(
        `File is too large (${sizeMb} MB). Maximum allowed size is 10 MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const rawResult = reader.result as string;
        const prepared = await prepareImageForAnalysis(rawResult, file.type);
        onImageSelected(prepared.base64DataUrl, prepared.mimeType, file.name);
      } catch (err: any) {
        setErrorMessage(
          'Failed to process image: ' + (err?.message || 'Unsupported image data.')
        );
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: SampleImage) => {
    try {
      setErrorMessage(null);
      const prepared = await prepareImageForAnalysis(sample.dataUrl, sample.mimeType);
      onImageSelected(prepared.base64DataUrl, prepared.mimeType, `${sample.title}.png`);
    } catch (err: any) {
      setErrorMessage('Failed to load sample image: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isProcessing}
      />

      {/* Language Preference Card upfront */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 sm:p-4">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          disabled={disabled || isProcessing}
        />
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors bg-white ${
          dragActive
            ? 'border-neutral-800 bg-neutral-50'
            : 'border-neutral-200 hover:border-neutral-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3">
            <Upload className="w-5 h-5" />
          </div>

          <h2 className="text-sm font-semibold text-neutral-900 mb-1">
            Upload reference image
          </h2>
          <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
            Choose a photo of an object, animal, or scene you want to draw. JPG, PNG, WEBP, or SVG up to 10MB.
          </p>

          {/* Action buttons (optimized for Android touch targets) */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isProcessing}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 active:bg-neutral-950 transition-colors shadow-xs"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Choose File</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled || isProcessing}
              className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-md hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-md bg-neutral-50 border border-neutral-300 text-xs text-neutral-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
          <span className="flex-1 leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Beginner Presets / Sample Subjects */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-semibold text-neutral-800">
            Or try a beginner sample reference:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              disabled={disabled || isProcessing}
              className="group flex flex-col items-center p-2 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-left transition-all active:scale-[0.98]"
            >
              <div className="w-full aspect-square rounded bg-neutral-100 border border-neutral-200 overflow-hidden mb-2 flex items-center justify-center">
                <img
                  src={sample.thumbnail}
                  alt={sample.title}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs font-medium text-neutral-900 line-clamp-1 w-full text-center">
                {sample.title}
              </span>
              <span className="text-[10px] text-neutral-500 line-clamp-1 w-full text-center">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
