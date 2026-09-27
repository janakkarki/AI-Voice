import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Volume2,
  Sparkles,
  MessageSquare,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Radio,
} from 'lucide-react';
import { PanelistConfig, DiscussionTurn, VoiceName } from '../types';
import { FIVE_PERSON_DISCUSSIONS, FivePersonDiscussionPreset } from '../data/fivePersonDiscussions';
import { SPEAKING_AGENTS } from '../data/speakingAgents';

interface FivePersonDiscussionStudioProps {
  onGenerateDiscussion: (
    panelists: PanelistConfig[],
    turns: DiscussionTurn[],
    title: string
  ) => Promise<void>;
  isGenerating: boolean;
}

export const FivePersonDiscussionStudio: React.FC<FivePersonDiscussionStudioProps> = ({
  onGenerateDiscussion,
  isGenerating,
}) => {
  const defaultPreset = FIVE_PERSON_DISCUSSIONS[0];

  const [panelists, setPanelists] = useState<PanelistConfig[]>(defaultPreset.panelists);
  const [turns, setTurns] = useState<DiscussionTurn[]>(defaultPreset.turns);
  const [title, setTitle] = useState<string>(defaultPreset.titleNe);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);

  const handleSelectPreset = (preset: FivePersonDiscussionPreset) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.titleNe);
    setPanelists(preset.panelists);
    setTurns(preset.turns);
  };

  const updatePanelist = (index: number, updates: Partial<PanelistConfig>) => {
    setPanelists((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleAgentSelectForPanelist = (index: number, agentId: string) => {
    const agent = SPEAKING_AGENTS.find((a) => a.id === agentId);
    if (agent) {
      updatePanelist(index, {
        agentId: agent.id,
        name: agent.nameNe,
        role: agent.roleNe,
        voiceBase: agent.voiceBase,
        style: agent.stylePrompt,
      });
    }
  };

  const addTurn = (defaultPanelistId?: string) => {
    const targetPanelist =
      panelists.find((p) => p.id === defaultPanelistId) ||
      panelists[turns.length % panelists.length];

    const newTurn: DiscussionTurn = {
      id: `turn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      panelistId: targetPanelist.id,
      speakerName: targetPanelist.name,
      text: '',
      vocalReaction: '',
    };

    setTurns((prev) => [...prev, newTurn]);
  };

  const removeTurn = (id: string) => {
    if (turns.length <= 1) return;
    setTurns((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTurnText = (id: string, text: string) => {
    setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const updateTurnSpeaker = (id: string, panelistId: string) => {
    const p = panelists.find((item) => item.id === panelistId);
    setTurns((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              panelistId,
              speakerName: p ? p.name : t.speakerName,
            }
          : t
      )
    );
  };

  const insertTagToTurn = (id: string, tag: string) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: `${t.text} ${tag} ` } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTurns = turns.filter((t) => t.text.trim());
    if (validTurns.length === 0 || isGenerating) return;

    onGenerateDiscussion(panelists, validTurns, title);
  };

  const getPanelistBadge = (idx: number) => {
    const styles = [
      'border-sky-200 bg-sky-50 text-sky-800',
      'border-purple-200 bg-purple-50 text-purple-800',
      'border-amber-200 bg-amber-50 text-amber-800',
      'border-rose-200 bg-rose-50 text-rose-800',
      'border-blue-200 bg-blue-50 text-blue-800',
    ];
    return styles[idx % styles.length];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Educational Banner in Soft Sky theme */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-r from-sky-50/90 via-white to-blue-50/80 p-6 shadow-lg shadow-sky-500/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-800 border border-sky-200">
                ५-पात्र गोलमेच सम्वाद (5-Person Discussion)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Multi-Speaker Screenplay Studio
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl font-devanagari">
              पाँच जना वक्ताहरू बीचको जीवन्त नेपाली पोडकास्ट तथा छलफल
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              मध्यस्थकर्ता (Host) र ४ जना विज्ञ प्यानलिस्टहरू बीच सहजै प्रश्न-उत्तर र बहस सिर्जना गर्नुहोस्।
              सबै संवादलाई स्वचालित रूपमा मिलाएर उच्च गुणस्तरको MP3 र WAV अडियो डाउनलोड गर्नुहोस्।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">तयारी विषय:</span>
            {FIVE_PERSON_DISCUSSIONS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  selectedPresetId === preset.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
                }`}
              >
                {preset.id === 'ai-nepal-future' ? 'एआई र प्रविधि' : 'सगरमाथा र पर्यटन'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Panelist Configuration Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            ५ जना प्यानलिस्ट तथा वक्ताहरू (5 Configured Panelists):
          </h3>
          <span className="text-[11px] text-sky-700 font-medium">
            १२+ नेपाली एजेन्ट आवाजबाट छान्नुहोस्
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {panelists.map((panelist, idx) => (
            <div
              key={panelist.id}
              className={`rounded-2xl border p-3.5 shadow-sm bg-white flex flex-col justify-between ${getPanelistBadge(
                idx
              )}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-xs text-xs font-bold">
                    P{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono-code font-bold opacity-75">
                    {panelist.voiceBase}
                  </span>
                </div>

                <input
                  type="text"
                  value={panelist.name}
                  onChange={(e) => updatePanelist(idx, { name: e.target.value })}
                  placeholder="वक्ताको नाम"
                  className="w-full rounded-xl border border-sky-100 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 mb-1.5 focus:outline-none focus:ring-1 focus:ring-sky-300"
                />

                <input
                  type="text"
                  value={panelist.role}
                  onChange={(e) => updatePanelist(idx, { role: e.target.value })}
                  placeholder="भूमिका / पद"
                  className="w-full rounded-xl border border-slate-100 bg-slate-50/80 px-2 py-1 text-[11px] text-slate-600 mb-2 focus:outline-none"
                />
              </div>

              {/* Agent Voice Selector */}
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">आवाज एजेन्ट:</label>
                <select
                  value={panelist.agentId}
                  onChange={(e) => handleAgentSelectForPanelist(idx, e.target.value)}
                  className="w-full rounded-xl border border-sky-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:outline-none"
                >
                  {SPEAKING_AGENTS.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.nameNe} ({agent.voiceBase})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion Screenplay Turns */}
      <div className="space-y-3 rounded-3xl border border-sky-200/90 bg-white/90 p-5 shadow-lg shadow-sky-500/5 backdrop-blur-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 font-devanagari">
              छलफलका सम्वादहरू (Roundtable Screenplay Turns)
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            कुल हरफहरू: <span className="font-bold text-sky-700">{turns.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {turns.map((turn, index) => {
            const panelistIndex = panelists.findIndex((p) => p.id === turn.panelistId);
            const currentPanelist = panelists[panelistIndex >= 0 ? panelistIndex : 0];

            return (
              <div
                key={turn.id}
                className="rounded-2xl border border-sky-100 bg-slate-50/60 p-3.5 transition hover:border-sky-300 hover:bg-white"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white border border-slate-200 text-[10px] text-slate-600 font-bold">
                      #{index + 1}
                    </span>

                    {/* Speaker Selector */}
                    <select
                      value={turn.panelistId}
                      onChange={(e) => updateTurnSpeaker(turn.id, e.target.value)}
                      className="rounded-xl border border-sky-200 bg-white px-2.5 py-1 text-xs font-bold text-sky-800 focus:outline-none"
                    >
                      {panelists.map((p, pIdx) => (
                        <option key={p.id} value={p.id}>
                          P{pIdx + 1}: {p.name} ({p.role.slice(0, 18)})
                        </option>
                      ))}
                    </select>

                    <span className="text-[11px] text-slate-500 font-devanagari">
                      {currentPanelist?.role}
                    </span>
                  </div>

                  {/* Vocal reaction tag helpers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '<breath>')}
                      className="rounded-md border border-sky-100 bg-white px-1.5 py-0.5 text-[10px] font-mono-code text-sky-700 hover:bg-sky-50"
                    >
                      &lt;breath&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '<laugh>')}
                      className="rounded-md border border-amber-100 bg-white px-1.5 py-0.5 text-[10px] font-mono-code text-amber-700 hover:bg-amber-50"
                    >
                      &lt;laugh&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '|हो|')}
                      className="rounded-md border border-purple-100 bg-white px-1.5 py-0.5 text-[10px] font-mono-code text-purple-700 hover:bg-purple-50"
                    >
                      |हो|
                    </button>

                    {turns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTurn(turn.id)}
                        className="ml-2 text-slate-400 hover:text-rose-500 p-1"
                        title="Delete turn"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={turn.text}
                  onChange={(e) => updateTurnText(turn.id, e.target.value)}
                  placeholder={`${currentPanelist?.name || 'वक्ता'} को भनाइ यहाँ लेख्नुहोस्...`}
                  className="w-full rounded-xl border border-sky-100 bg-white p-2.5 font-devanagari text-sm text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
              </div>
            );
          })}
        </div>

        {/* Quick Add Turn by Panelist */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span>सिधै वक्ता थप्नुहोस्:</span>
            {panelists.map((p, pIdx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addTurn(p.id)}
                className="rounded-xl border border-sky-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-sky-400 hover:bg-sky-50"
              >
                + P{pIdx + 1} ({p.name.split(' ')[0]})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addTurn()}
            className="flex items-center gap-1.5 rounded-xl border border-dashed border-sky-300 bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-100"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>नयाँ हरफ थप्नुहोस् (Add Turn)</span>
          </button>
        </div>
      </div>

      {/* Synthesis Submission Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-sky-200/90 bg-white/90 p-5 sm:flex-row shadow-xl shadow-sky-500/5">
        <div>
          <h4 className="text-xs font-bold text-slate-800">
            ५-पात्र पूर्ण छलफल संश्लेषण (Synthesize 5-Person Panel)
          </h4>
          <p className="text-[11px] text-slate-500">
            प्रत्येक वक्ताको पृथक आवाजमा वाचन गरी क्रमिक रूपमा एउटै 24kHz अडियोमा संयोजन गरिन्छ।
          </p>
        </div>

        <button
          type="submit"
          disabled={isGenerating || turns.every((t) => !t.text.trim())}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-sky-500/25 transition hover:brightness-105 active:scale-98 disabled:opacity-50 sm:w-auto"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>५-पात्र छलफल अडियो तयार गर्दै...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              <span>५-पात्र छलफल अडियो सिर्जना गर्नुहोस् (Generate Panel Audio)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
