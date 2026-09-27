import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  BookOpen,
  Radio,
  Zap,
  HelpCircle,
  RotateCcw,
  Check,
  ChevronDown,
  UserCheck,
  Sliders,
  Play,
  Activity,
  FileText,
} from 'lucide-react';
import { VoiceName, SpeakingAgent } from '../types';
import { AVAILABLE_VOICES, VOICE_PRESETS, SAMPLE_SCRIPTS, SampleScript } from '../data/sampleScripts';
import { SPEAKING_AGENTS } from '../data/speakingAgents';

interface SingleSpeakerStudioProps {
  onGenerate: (text: string, voiceName: VoiceName, style: string, title: string) => Promise<void>;
  isGenerating: boolean;
  initialText?: string;
  initialStyle?: string;
  initialVoice?: VoiceName;
  onOpenDoctorWithText?: (text: string) => void;
  remainingQuota?: number;
}

export const SingleSpeakerStudio: React.FC<SingleSpeakerStudioProps> = ({
  onGenerate,
  isGenerating,
  initialText,
  initialStyle,
  initialVoice,
  onOpenDoctorWithText,
  remainingQuota = 50000,
}) => {
  const [text, setText] = useState<string>(
    initialText ||
      'नमस्ते! यो नेपाली भाषाको लागि अत्याधुनिक जेमिनाई एआई पोडकास्ट तथा भ्वाइस स्टुडियो हो। अब तपाईं आफ्ना लेख, समाचार, वा कथाहरूलाई प्राकृतिक र स्पष्ट नेपाली आवाजमा रूपान्तरण गर्न सक्नुहुन्छ।'
  );
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(initialVoice || 'Kore');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('samiksha-storyteller');
  const [agentFilter, setAgentFilter] = useState<'All' | 'Female' | 'Male'>('All');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('storyteller');
  const [customStyle, setCustomStyle] = useState<string>(
    initialStyle ||
      'Warm, expressive and melodic Nepali speaker with authentic Kathmandu accent and clear, natural enunciation'
  );
  const [showAdvancedStyle, setShowAdvancedStyle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('नेपाली वाचन (Nepali Voice)');

  // Selected agent detail
  const currentAgent = SPEAKING_AGENTS.find((a) => a.id === selectedAgentId) || SPEAKING_AGENTS[0];

  // Update text/style when parent passes updated props (e.g. from Script Doctor or Gallery)
  React.useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  React.useEffect(() => {
    if (initialStyle) setCustomStyle(initialStyle);
  }, [initialStyle]);

  React.useEffect(() => {
    if (initialVoice) {
      setSelectedVoice(initialVoice);
      const matched = SPEAKING_AGENTS.find((a) => a.voiceBase === initialVoice);
      if (matched) setSelectedAgentId(matched.id);
    }
  }, [initialVoice]);

  const handleSelectAgent = (agent: SpeakingAgent) => {
    setSelectedAgentId(agent.id);
    setSelectedVoice(agent.voiceBase);
    setCustomStyle(agent.stylePrompt);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = VOICE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedVoice(preset.recommendedVoice);
      setCustomStyle(preset.stylePrompt);
      const matched = SPEAKING_AGENTS.find((a) => a.voiceBase === preset.recommendedVoice);
      if (matched) setSelectedAgentId(matched.id);
    }
  };

  const handleLoadSample = (sample: SampleScript) => {
    setText(sample.text);
    setTitle(sample.titleNe);
    setSelectedVoice(sample.voice);
    setCustomStyle(sample.style);
    const matched = SPEAKING_AGENTS.find((a) => a.voiceBase === sample.voice);
    if (matched) setSelectedAgentId(matched.id);
  };

  const insertTag = (tag: string) => {
    setText((prev) => `${prev} ${tag} `);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isGenerating) return;
    onGenerate(text, selectedVoice, customStyle, title);
  };

  const filteredAgents = SPEAKING_AGENTS.filter((a) => {
    if (agentFilter === 'All') return true;
    return a.gender === agentFilter;
  });

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estSeconds = Math.round(wordCount / 2.4);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sample Scripts Quick Selector Pills */}
      <div className="rounded-3xl border border-sky-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-md">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <BookOpen className="h-4 w-4 text-sky-600" />
            <span>तयारी नेपाली पोडकास्ट तथा स्क्रिप्टहरू (Quick Sample Scripts):</span>
          </div>
          <span className="text-[11px] text-sky-800 font-medium">१-क्लिकमा लोड गर्नुहोस्</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_SCRIPTS.map((script) => (
            <button
              key={script.id}
              type="button"
              onClick={() => handleLoadSample(script)}
              className="flex items-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-100/80 hover:text-sky-950"
            >
              <span className="text-sky-600 font-bold">✦</span>
              <span className="font-devanagari">{script.titleNe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Left Script & Right Persona */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Script Editor (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 shadow-lg shadow-sky-500/5 backdrop-blur-md">
            {/* Top Bar with Vocal Tags */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                  <Mic className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 font-devanagari">
                  नेपाली वाचन पाठ (Podcast Text)
                </h3>
              </div>

              {/* Vocal Bursts / Cues */}
              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-[10px] text-slate-400 font-medium">ट्याग थप्नुहोस्:</span>
                <button
                  type="button"
                  onClick={() => insertTag('<breath>')}
                  className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-mono-code text-sky-700 hover:bg-sky-100"
                  title="स्वाभाविक श्वास फेर्ने विराम"
                >
                  &lt;breath&gt;
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('<laugh>')}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-mono-code text-amber-700 hover:bg-amber-100"
                  title="हाँसोको भाव"
                >
                  &lt;laugh&gt;
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('।')}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                  title="नेपाली पूर्णविराम"
                >
                  । (पूर्णविराम)
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('|हो|')}
                  className="rounded-lg border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-mono-code text-purple-700 hover:bg-purple-100"
                  title="स्वीकारोक्ति / सहमति"
                >
                  |हो|
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={7}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="यहाँ नेपालीमा लेख्नुहोस्..."
                className="w-full rounded-2xl border border-sky-100 bg-slate-50/60 p-4 font-devanagari text-base leading-relaxed text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
              />

              {/* Character and Quota Live Status Bar */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-sky-50 pt-2 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="font-medium text-slate-700">
                    {charCount} अक्षरहरू
                  </span>
                  <span>•</span>
                  <span>~{wordCount} शब्दहरू</span>
                  <span>•</span>
                  <span>अनुमानित समय: ~{estSeconds} सेकेन्ड</span>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenDoctorWithText && (
                    <button
                      type="button"
                      onClick={() => onOpenDoctorWithText(text)}
                      className="flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-100"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>अडियो डाक्टर जाँच</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="text-[11px] text-slate-400 hover:text-rose-500"
                  >
                    खाली गर्नुहोस्
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Audio Modifiers & Tone Box */}
          <div className="rounded-3xl border border-sky-200/90 bg-white/80 p-4 shadow-sm backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-700">वाचन गति तथा लवज शैली:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedStyle(!showAdvancedStyle)}
                className="text-[11px] font-semibold text-sky-700 hover:underline"
              >
                {showAdvancedStyle ? 'सरल बनाउनुहोस्' : 'कस्टम पर्सोना प्रम्प्ट'}
              </button>
            </div>

            {/* Persona presets pills */}
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VOICE_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 text-sky-950 font-bold shadow-sm'
                        : 'border-slate-100 bg-slate-50/70 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">
                      {preset.id === 'storyteller' && '📖'}
                      {preset.id === 'news' && '📡'}
                      {preset.id === 'podcast' && '🎙️'}
                      {preset.id === 'calm' && '🧘'}
                      {preset.id === 'commercial' && '⚡'}
                    </span>
                    <span className="text-[11px] font-devanagari truncate">{preset.labelNe.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {showAdvancedStyle && (
              <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-3">
                <label className="text-[11px] font-bold text-sky-900 block mb-1">
                  विस्तृत उच्चारण प्रम्प्ट (Detailed Speech Prompt):
                </label>
                <input
                  type="text"
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  className="w-full rounded-xl border border-sky-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  placeholder="उदा: Melodic Kathmandu accent, gentle pauses, warm friendly tone"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Voice Agents Showcase & 10+ Selector (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Active Speaker Card */}
          <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 p-5 shadow-lg shadow-sky-500/5 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm border border-sky-100">
                  {currentAgent.avatarEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-800 font-devanagari">
                      {currentAgent.nameNe}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">{currentAgent.nameEn}</p>
                  <p className="text-xs font-semibold text-sky-700 font-devanagari mt-0.5">
                    {currentAgent.roleNe}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
                {currentAgent.badge}
              </span>
            </div>

            <div className="mt-3 rounded-2xl border border-sky-100 bg-white/90 p-3 text-xs leading-relaxed text-slate-600">
              <span className="text-[10px] font-bold text-sky-900 block mb-1 uppercase tracking-wider">
                लवज तथा विशेष शैली:
              </span>
              <p className="font-devanagari text-slate-700">
                {currentAgent.accent} • {currentAgent.stylePrompt.slice(0, 100)}...
              </p>
            </div>
          </div>

          {/* 10+ Speaking Agents Selector */}
          <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 shadow-lg shadow-sky-500/5 backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-sky-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  १२+ भ्वाइस एजेन्टहरू (Voice Agents)
                </h4>
              </div>

              {/* Filter */}
              <div className="flex rounded-lg border border-slate-100 bg-slate-50 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setAgentFilter('All')}
                  className={`rounded px-2 py-0.5 font-bold transition ${
                    agentFilter === 'All' ? 'bg-sky-600 text-white' : 'text-slate-500'
                  }`}
                >
                  सबै ({SPEAKING_AGENTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAgentFilter('Female')}
                  className={`rounded px-2 py-0.5 font-bold transition ${
                    agentFilter === 'Female' ? 'bg-sky-600 text-white' : 'text-slate-500'
                  }`}
                >
                  महिला
                </button>
                <button
                  type="button"
                  onClick={() => setAgentFilter('Male')}
                  className={`rounded px-2 py-0.5 font-bold transition ${
                    agentFilter === 'Male' ? 'bg-sky-600 text-white' : 'text-slate-500'
                  }`}
                >
                  पुरुष
                </button>
              </div>
            </div>

            {/* Agents Grid List */}
            <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => handleSelectAgent(agent)}
                    className={`flex items-start gap-2 rounded-2xl border p-2.5 text-left transition ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 text-sky-950 font-bold shadow-sm'
                        : 'border-slate-100 bg-slate-50/60 text-slate-700 hover:border-sky-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-xl shrink-0">{agent.avatarEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold font-devanagari truncate">
                        {agent.nameNe}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {agent.roleNe}
                      </div>
                      <div className="mt-0.5 text-[9px] font-mono-code text-sky-700">
                        {agent.voiceBase}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Audio Generation Button */}
          <button
            type="submit"
            disabled={isGenerating || !text.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-sky-500/25 transition hover:brightness-105 active:scale-98 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>नेपाली बोली तयार गर्दै... (Synthesizing)</span>
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5" />
                <span>अडियो सिर्जना गर्नुहोस् (Generate Speech)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
