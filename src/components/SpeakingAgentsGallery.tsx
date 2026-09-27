import React, { useState } from 'react';
import {
  Mic,
  Play,
  Volume2,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  UserCheck,
  Search,
} from 'lucide-react';
import { SpeakingAgent } from '../types';
import { SPEAKING_AGENTS } from '../data/speakingAgents';

interface SpeakingAgentsGalleryProps {
  onSelectAgent: (agent: SpeakingAgent) => void;
  onPreviewSpeak: (text: string, voiceBase: any, style: string, name: string) => void;
  activeVoiceId?: string;
}

export const SpeakingAgentsGallery: React.FC<SpeakingAgentsGalleryProps> = ({
  onSelectAgent,
  onPreviewSpeak,
  activeVoiceId,
}) => {
  const [filterGender, setFilterGender] = useState<'All' | 'Female' | 'Male'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const filteredAgents = SPEAKING_AGENTS.filter((agent) => {
    const matchesGender = filterGender === 'All' || agent.gender === filterGender;
    const matchesQuery =
      agent.nameNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.roleNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.roleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesQuery;
  });

  const handlePreview = (agent: SpeakingAgent) => {
    setPreviewingId(agent.id);
    onPreviewSpeak(
      agent.sampleNepaliLine,
      agent.voiceBase,
      agent.stylePrompt,
      `${agent.nameNe} - नमूना वाचन`
    );
    setTimeout(() => setPreviewingId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner in Soft Sky theme */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-r from-sky-50 via-white to-blue-50/70 p-6 shadow-lg shadow-sky-500/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-800 border border-sky-200">
                १२+ नेपाली भ्वाइस एजेन्टहरू (12+ Speaking Personas)
              </span>
              <span className="text-xs text-slate-500 font-medium">gemini-3.8-flash-tts Acoustic Personas</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl font-devanagari">
              नेपाली लवज र विशिष्ट भूमिका भएका एआई वाचकहरू
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              कथा वाचक, पोडकास्टर, समाचार प्रस्तोता, हजुरबुवा, रेडियो जक्की, ध्यान गुरुदेखि खेलकुद कमेन्टेटरसम्म —
              प्रत्येक पात्रको आफ्नै पृथक उच्चारण, भाव र लय छ।
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl border border-sky-200 bg-white p-1 text-xs shadow-xs">
              <button
                onClick={() => setFilterGender('All')}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  filterGender === 'All'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                सबै ({SPEAKING_AGENTS.length})
              </button>
              <button
                onClick={() => setFilterGender('Female')}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  filterGender === 'Female'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                महिला (Female)
              </button>
              <button
                onClick={() => setFilterGender('Male')}
                className={`rounded-xl px-3 py-1.5 font-bold transition ${
                  filterGender === 'Male'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                पुरुष (Male)
              </button>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="पात्रको नाम, भूमिका वा शैली खोज्नुहोस् (उदा: कथा, पोडकास्ट, समाचार, ध्यान)..."
            className="w-full rounded-2xl border border-sky-200 bg-white/90 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => {
          const isSelected = activeVoiceId === agent.id;
          return (
            <div
              key={agent.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-sky-200/90 bg-white/95 p-5 shadow-sm transition-all hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10"
            >
              <div>
                {/* Top Row: Avatar & Badge */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl shadow-xs border border-sky-100">
                      {agent.avatarEmoji}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 font-devanagari group-hover:text-sky-700 transition">
                        {agent.nameNe}
                      </h3>
                      <p className="text-[11px] text-slate-400">{agent.nameEn}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
                    {agent.badge}
                  </span>
                </div>

                {/* Role and Accent */}
                <div className="space-y-1 pt-1">
                  <div className="text-xs font-semibold text-slate-700 font-devanagari">
                    {agent.roleNe}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>लवज: {agent.accent}</span>
                    <span>•</span>
                    <span className="font-mono-code text-sky-700 font-semibold">{agent.voiceBase} Base</span>
                  </div>
                </div>

                {/* Sample Nepali line */}
                <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
                  <span className="text-[10px] font-bold text-sky-900 uppercase tracking-wider block mb-1">
                    नमूना वाचन (Sample Voice):
                  </span>
                  <p className="line-clamp-2 text-xs font-devanagari text-slate-700 italic">
                    "{agent.sampleNepaliLine}"
                  </p>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-sky-50 pt-3">
                <button
                  type="button"
                  onClick={() => handlePreview(agent)}
                  className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 transition hover:bg-sky-100"
                  title="Listen to this agent preview"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>{previewingId === agent.id ? 'बज्दैछ...' : 'सुन्नुहोस्'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectAgent(agent)}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105"
                >
                  <span>यो आवाज प्रयोग गर्नुहोस्</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
