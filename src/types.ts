export interface KeyShape {
  shape: string;
  role: string;
}

export interface DrawingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  actionableTip: string;
  selfCheck: string;
}

export interface DrawingGuide {
  subjectName: string;
  summary: string;
  difficulty: string;
  estimatedMinutes: number;
  recommendedPencils: string[];
  keyGeometricShapes: KeyShape[];
  lightSourceDirection: string;
  proportionsTip: string;
  steps: DrawingStep[];
  commonMistakesToAvoid: string[];
  warmupExercise: string;
}

export interface SampleImage {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  dataUrl: string;
  mimeType: string;
}
