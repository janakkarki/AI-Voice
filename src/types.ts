export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' | 'Aoede';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  toneDescription: string;
  nepaliRecommended: boolean;
}

export interface SpeakingAgent {
  id: string;
  nameNe: string;
  nameEn: string;
  roleNe: string;
  roleEn: string;
  avatarEmoji: string;
  voiceBase: VoiceName;
  gender: 'Female' | 'Male' | 'Neutral';
  accent: string;
  stylePrompt: string;
  sampleNepaliLine: string;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
}

export interface VoicePreset {
  id: string;
  labelNe: string;
  labelEn: string;
  icon: string;
  stylePrompt: string;
  recommendedVoice: VoiceName;
}

export interface SpeakerConfig {
  speaker: string;
  voiceName: VoiceName;
  style: string;
}

export interface PanelistConfig {
  id: string;
  name: string;
  role: string;
  agentId: string;
  voiceBase: VoiceName;
  style: string;
  color: string;
}

export interface DiscussionTurn {
  id: string;
  panelistId: string;
  speakerName: string;
  text: string;
  vocalReaction?: string; // e.g. '<laugh>', '<breath>', '|हो|'
}

export interface GeneratedAudioItem {
  id: string;
  timestamp: number;
  title: string;
  text: string;
  mode: 'single' | 'dialogue' | 'discussion';
  voiceName?: VoiceName;
  speakers?: SpeakerConfig[];
  stylePrompt?: string;
  audioData: string; // data:audio/wav;base64,...
  durationEstimateSec?: number;
  language?: string;
}

export interface ScriptOptimizationResult {
  optimizedText: string;
  phoneticRomanizedText: string;
  englishTranslation: string;
  voiceStyleSuggestion: string;
  diagnostics: {
    nepaliExplanation: string;
    englishExplanation: string;
    issuesDetected: string[];
    improvementsApplied: string[];
  };
}

export interface TtsToolComparison {
  name: string;
  tagline: string;
  nepaliSupportRating: string; // e.g. "9.5/10"
  nepaliVoices: string[];
  strengths: string[];
  limitations: string[];
  pricingModel: string;
  integrationMethod: string;
  accuracyVerdict: string;
  recommendedFor: string;
  codeSnippet: string;
}

export interface QuotaUsage {
  dailyCharLimit: number; // e.g. 50,000 characters
  usedCharsToday: number;
  remainingChars: number;
  requestsCountToday: number;
  totalAudioSecondsGenerated: number;
  lastResetDate: string; // YYYY-MM-DD
}

export interface StudioAudioModifiers {
  pitch: 'low' | 'normal' | 'high';
  speed: number; // 0.8 to 1.5
  volumeGain: number; // 1.0 to 1.5
  ambientSound: 'none' | 'soft-breeze' | 'temple-bell' | 'acoustic-cafe' | 'studio-calm';
}

