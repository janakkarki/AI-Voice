import React, { useState, useEffect } from 'react';
import {
  Mic,
  Users,
  Stethoscope,
  Languages,
  Sparkles,
  Volume2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Headphones,
  Scale,
  UserCheck,
  Radio,
  Activity,
  Download,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AudioVisualizerPlayer } from './components/AudioVisualizerPlayer';
import { SingleSpeakerStudio } from './components/SingleSpeakerStudio';
import { DialogueStudio } from './components/DialogueStudio';
import { FivePersonDiscussionStudio } from './components/FivePersonDiscussionStudio';
import { SpeakingAgentsGallery } from './components/SpeakingAgentsGallery';
import { AlternativeTtsComparison } from './components/AlternativeTtsComparison';
import { AudioTroubleshooterDoctor } from './components/AudioTroubleshooterDoctor';
import { TranslatorPanel } from './components/TranslatorPanel';
import { HistoryDrawer } from './components/HistoryDrawer';
import { QuotaTrackerBadge } from './components/QuotaTrackerBadge';
import {
  GeneratedAudioItem,
  VoiceName,
  SpeakerConfig,
  PanelistConfig,
  DiscussionTurn,
  SpeakingAgent,
  QuotaUsage,
} from './types';
import { getQuotaUsage, recordUsage } from './utils/quotaManager';

type TabKey = 'single' | 'discussion' | 'agents' | 'alternatives' | 'dialogue' | 'doctor' | 'translator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('single');
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudioItem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedAudioItem[]>([]);
  const [transferredText, setTransferredText] = useState<string>('');
  const [transferredStyle, setTransferredStyle] = useState<string>('');
  const [transferredVoice, setTransferredVoice] = useState<VoiceName | undefined>(undefined);
  const [quota, setQuota] = useState<QuotaUsage>(getQuotaUsage());

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nepali_tts_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load audio history', e);
    }
  }, []);

  const saveToHistory = (item: GeneratedAudioItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.slice(0, 19)]; // Keep latest 20
      try {
        localStorage.setItem('nepali_tts_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('nepali_tts_history');
    } catch (e) {}
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem('nepali_tts_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Single speaker synthesis handler
  const handleGenerateSingle = async (
    text: string,
    voiceName: VoiceName,
    style: string,
    title: string
  ) => {
    if (quota.remainingChars <= 0) {
      setGlobalError('आजको दैनिक क्यारेक्टर कोटा (५०,००० अक्षर) समाप्त भएको छ। भोलि पुनः स्वतः ताजा हुनेछ वा कोटा विवरणबाट रिसेट गर्नुहोस्।');
      return;
    }

    setIsGenerating(true);
    setGlobalError(null);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName,
          style,
          mode: 'single',
          language: 'ne',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize Nepali speech.');
      }

      const durationSec = data.durationEstimateSec || Math.round(text.length / 15);
      const updatedQuota = recordUsage(text.length, durationSec);
      setQuota(updatedQuota);

      const newItem: GeneratedAudioItem = {
        id: `tts-${Date.now()}`,
        timestamp: Date.now(),
        title: title || 'नेपाली वाचन',
        text,
        mode: 'single',
        voiceName,
        stylePrompt: style,
        audioData: data.audioData,
        durationEstimateSec: data.durationEstimateSec,
        language: 'ne',
      };

      setCurrentAudio(newItem);
      saveToHistory(newItem);
    } catch (err: any) {
      console.error('TTS synthesis error:', err);
      setGlobalError(
        err.message ||
          'वाचन सिर्जना गर्दा समस्या आयो। यदि "Audio not supported" आएको हो भने "अडियो डाक्टर" ट्याब प्रयोग गरी अङ्क र विराम चिन्हहरू अनुकूल बनाउनुहोस्।'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Dual-speaker dialogue synthesis handler
  const handleGenerateDialogue = async (
    dialogueParts: Array<{ speaker: string; text: string; style?: string }>,
    speakerConfigs: SpeakerConfig[],
    title: string
  ) => {
    const totalChars = dialogueParts.reduce((acc, curr) => acc + curr.text.length, 0);
    if (quota.remainingChars <= 0) {
      setGlobalError('आजको दैनिक क्यारेक्टर कोटा समाप्त भएको छ।');
      return;
    }

    setIsGenerating(true);
    setGlobalError(null);

    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'dialogue',
          dialogueParts,
          speakerConfigs,
          language: 'ne',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate dialogue audio.');
      }

      const durationSec = data.durationEstimateSec || Math.round(totalChars / 15);
      const updatedQuota = recordUsage(totalChars, durationSec);
      setQuota(updatedQuota);

      const summaryText = dialogueParts.map((p) => `${p.speaker}: ${p.text}`).join(' | ');

      const newItem: GeneratedAudioItem = {
        id: `dialogue-${Date.now()}`,
        timestamp: Date.now(),
        title: title || 'नेपाली दुई-पात्र सम्वाद',
        text: summaryText,
        mode: 'dialogue',
        speakers: speakerConfigs,
        audioData: data.audioData,
        durationEstimateSec: data.durationEstimateSec,
        language: 'ne',
      };

      setCurrentAudio(newItem);
      saveToHistory(newItem);
    } catch (err: any) {
      console.error('Dialogue error:', err);
      setGlobalError(err.message || 'सम्वाद अडियो सिर्जना गर्दा त्रुटि भयो।');
    } finally {
      setIsGenerating(false);
    }
  };

  // 5-Person Panel Discussion handler
  const handleGenerateDiscussion = async (
    panelists: PanelistConfig[],
    turns: DiscussionTurn[],
    title: string
  ) => {
    const totalChars = turns.reduce((acc, curr) => acc + curr.text.length, 0);
    if (quota.remainingChars <= 0) {
      setGlobalError('आजको दैनिक क्यारेक्टर कोटा समाप्त भएको छ।');
      return;
    }

    setIsGenerating(true);
    setGlobalError(null);

    try {
      const res = await fetch('/api/tts/generate-discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelists,
          turns,
          title,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '५-पात्र छलफल अडियो सिर्जना गर्न सकिएन।');
      }

      const durationSec = data.durationEstimateSec || Math.round(totalChars / 14);
      const updatedQuota = recordUsage(totalChars, durationSec);
      setQuota(updatedQuota);

      const summaryText = turns.map((t) => `${t.speakerName}: ${t.text}`).join(' | ');

      const newItem: GeneratedAudioItem = {
        id: `discussion-${Date.now()}`,
        timestamp: Date.now(),
        title: title || '५-पात्र गोलमेच छलफल',
        text: summaryText,
        mode: 'discussion',
        audioData: data.audioData,
        durationEstimateSec: data.durationEstimateSec,
        language: 'ne',
      };

      setCurrentAudio(newItem);
      saveToHistory(newItem);
    } catch (err: any) {
      console.error('Discussion generation error:', err);
      setGlobalError(err.message || '५-पात्र छलफल अडियो सिर्जना गर्दा त्रुटि भयो।');
    } finally {
      setIsGenerating(false);
    }
  };

  // Send from Doctor or Translator into Single Speaker Studio
  const handleApplyScriptFromDoctor = (text: string, style: string) => {
    setTransferredText(text);
    if (style) setTransferredStyle(style);
    setActiveTab('single');
  };

  const handleSpeakImmediately = (text: string, style = 'Natural Nepali speaker') => {
    handleGenerateSingle(text, 'Kore', style, 'अप्टिमाइज गरिएको नेपाली वाचन');
  };

  const handleSelectAgentFromGallery = (agent: SpeakingAgent) => {
    setTransferredVoice(agent.voiceBase);
    setTransferredStyle(agent.stylePrompt);
    setTransferredText(agent.sampleNepaliLine);
    setActiveTab('single');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100/50 to-blue-50 text-slate-800 flex flex-col font-sans selection:bg-sky-200 selection:text-sky-900">
      {/* Top Navigation & App Identity with Soft Sky styling */}
      <header className="sticky top-0 z-30 border-b border-sky-200/80 bg-white/85 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg font-devanagari">
                  नेपाली पोडकास्ट भ्वाइस स्टुडियो
                </h1>
                <span className="hidden sm:inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
                  TTS • १२+ पात्रहरू • ५-पात्र छलफल
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI Voice & Podcast Studio • Powered by{' '}
                <span className="font-semibold text-sky-700">gemini-3.8-flash-tts</span>
              </p>
            </div>
          </div>

          {/* Right side controls: Quota Tracker Badge & MP3 indicator */}
          <div className="flex items-center gap-3">
            <QuotaTrackerBadge quota={quota} onQuotaUpdated={setQuota} />

            <div className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-sky-200 bg-sky-50/80 px-3 py-1.5 text-xs text-sky-800 font-semibold shadow-2xs">
              <Download className="h-3.5 w-3.5 text-sky-600" />
              <span>MP3 र WAV डाउनलोड</span>
            </div>
          </div>
        </div>

        {/* Tab Bar with clean light-sky theme pills */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="flex space-x-1.5 overflow-x-auto py-2.5 text-xs font-semibold scrollbar-none">
            {/* 1. Single Speaker */}
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'single'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Mic className="h-4 w-4" />
              <span>एकल वाचन (Single TTS)</span>
            </button>

            {/* 2. 5-Person Discussion */}
            <button
              onClick={() => setActiveTab('discussion')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'discussion'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Radio className="h-4 w-4" />
              <span>५-पात्र छलफल (5-Person Panel)</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                activeTab === 'discussion' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'
              }`}>
                नयाँ
              </span>
            </button>

            {/* 3. 12+ Speaking Agents */}
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'agents'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>१०+ भ्वाइस एजेन्टहरू (Voices)</span>
            </button>

            {/* 4. Script Doctor */}
            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'doctor'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              <span>अडियो डाक्टर ("Audio Not Supported" Fix)</span>
            </button>

            {/* 5. Alternative TTS Tools Comparison */}
            <button
              onClick={() => setActiveTab('alternatives')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'alternatives'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>नेपाली TTS विकल्पहरू (Alternative Tools)</span>
            </button>

            {/* 6. 2-Person Dialogue */}
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'dialogue'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>दुई-पात्र सम्वाद (2-Speaker)</span>
            </button>

            {/* 7. Translator */}
            <button
              onClick={() => setActiveTab('translator')}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 transition-all whitespace-nowrap shadow-2xs ${
                activeTab === 'translator'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20 font-bold'
                  : 'bg-white/80 text-slate-600 hover:text-sky-800 hover:bg-sky-50 border border-sky-100'
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>अनुवाद र वाचन (Translate)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Error Notification with Helper Action */}
        {globalError && (
          <div className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 sm:flex-row sm:items-center sm:justify-between text-xs text-rose-800 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <span className="font-bold">सञ्चार सूचना (Synthesis Notice): </span>
                <span>{globalError}</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('doctor')}
              className="shrink-0 rounded-xl bg-rose-600 px-3.5 py-1.5 font-bold text-white shadow-xs hover:bg-rose-500 transition"
            >
              अडियो डाक्टर खोल्नुहोस्
            </button>
          </div>
        )}

        {/* Prominent Audio Player (Supports WAV & MP3) */}
        <section aria-label="Audio Visualizer Player">
          <AudioVisualizerPlayer item={currentAudio} />
        </section>

        {/* Tab Content Panels */}
        <div className="transition-all">
          {activeTab === 'single' && (
            <SingleSpeakerStudio
              onGenerate={handleGenerateSingle}
              isGenerating={isGenerating}
              initialText={transferredText}
              initialStyle={transferredStyle}
              initialVoice={transferredVoice}
              remainingQuota={quota.remainingChars}
              onOpenDoctorWithText={(txt) => {
                setTransferredText(txt);
                setActiveTab('doctor');
              }}
            />
          )}

          {activeTab === 'discussion' && (
            <FivePersonDiscussionStudio
              onGenerateDiscussion={handleGenerateDiscussion}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === 'agents' && (
            <SpeakingAgentsGallery
              onSelectAgent={handleSelectAgentFromGallery}
              onPreviewSpeak={(text, voiceBase, style, name) =>
                handleGenerateSingle(text, voiceBase, style, name)
              }
            />
          )}

          {activeTab === 'doctor' && (
            <AudioTroubleshooterDoctor
              onApplyScript={handleApplyScriptFromDoctor}
              onGenerateImmediately={handleSpeakImmediately}
            />
          )}

          {activeTab === 'alternatives' && <AlternativeTtsComparison />}

          {activeTab === 'dialogue' && (
            <DialogueStudio
              onGenerateDialogue={handleGenerateDialogue}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === 'translator' && (
            <TranslatorPanel
              onSendToStudio={(text) => {
                setTransferredText(text);
                setActiveTab('single');
              }}
              onSpeakImmediately={handleSpeakImmediately}
            />
          )}
        </div>

        {/* History of Generated Audios */}
        <section aria-label="Audio History">
          <HistoryDrawer
            items={history}
            onSelect={(item) => setCurrentAudio(item)}
            onClear={clearHistory}
            onDelete={deleteHistoryItem}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-sky-200/80 bg-white/80 py-5 text-center text-xs text-slate-500 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-devanagari">
            नेपाली पोडकास्ट भ्वाइस स्टुडियो • Gemini 3.8 Flash TTS Acoustic Engine
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>१२+ भ्वाइस एजेन्टहरू</span>
            <span>•</span>
            <span>५-पात्र छलफल</span>
            <span>•</span>
            <span>MP3 र WAV डाउनलोड</span>
            <span>•</span>
            <span className="text-sky-700 font-semibold">५०,००० दैनिक क्यारेक्टर कोटा</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
