import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Volume2,
  Sparkles,
  MessageSquare,
  Play,
  RotateCcw,
} from 'lucide-react';
import { VoiceName, SpeakerConfig } from '../types';
import { AVAILABLE_VOICES, SAMPLE_DIALOGUES, DialoguePreset } from '../data/sampleScripts';

interface DialogueStudioProps {
  onGenerateDialogue: (
    dialogueParts: Array<{ speaker: string; text: string; style?: string }>,
    speakerConfigs: SpeakerConfig[],
    title: string
  ) => Promise<void>;
  isGenerating: boolean;
}

export const DialogueStudio: React.FC<DialogueStudioProps> = ({
  onGenerateDialogue,
  isGenerating,
}) => {
  const [speaker1, setSpeaker1] = useState<SpeakerConfig>({
    speaker: 'Ramesh',
    voiceName: 'Puck',
    style: 'Enthusiastic young Nepali speaker with lively, natural cadence',
  });

  const [speaker2, setSpeaker2] = useState<SpeakerConfig>({
    speaker: 'Sunita',
    voiceName: 'Kore',
    style: 'Warm, articulate, and friendly Nepali speaker with gentle smile',
  });

  const [turns, setTurns] = useState<Array<{ id: string; speaker: string; text: string }>>([
    {
      id: 'turn-1',
      speaker: 'Ramesh',
      text: 'सुनिता, नमस्ते! के तिमी आगामी हप्ता पोखरा र अन्नपूर्ण पदयात्रामा जान तयार छौ?',
    },
    {
      id: 'turn-2',
      speaker: 'Sunita',
      text: '|हो| रमेश, म त एकदमै उत्साहित छु! <breath> तर उच्च हिमाली क्षेत्रको लागि न्यानो ज्याकेट नबिर्स है।',
    },
    {
      id: 'turn-3',
      speaker: 'Ramesh',
      text: 'चिन्तै नगर, क्यामरा र तातो लुगा दुवै ठिक्क पारेको छु। पोखरामा भेटौँला है त!',
    },
    {
      id: 'turn-4',
      speaker: 'Sunita',
      text: 'हुन्छ, पोखराको फेवाताल किनारमा भेटौँला। यात्रा निकै रमाइलो हुनेछ! <laugh>',
    },
  ]);

  const [title, setTitle] = useState<string>('अन्नपूर्ण पदयात्रा सम्वाद (Annapurna Trek)');

  const handleLoadPreset = (preset: DialoguePreset) => {
    setTitle(preset.titleNe);
    setSpeaker1({
      speaker: preset.speaker1.name,
      voiceName: preset.speaker1.voice,
      style: preset.speaker1.style,
    });
    setSpeaker2({
      speaker: preset.speaker2.name,
      voiceName: preset.speaker2.voice,
      style: preset.speaker2.style,
    });
    setTurns(
      preset.turns.map((t, i) => ({
        id: `preset-turn-${i}`,
        speaker: t.speaker,
        text: t.text,
      }))
    );
  };

  const addTurn = (defaultSpeaker?: string) => {
    const nextSpeaker = defaultSpeaker || (turns[turns.length - 1]?.speaker === speaker1.speaker ? speaker2.speaker : speaker1.speaker);
    setTurns((prev) => [
      ...prev,
      {
        id: `turn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        speaker: nextSpeaker,
        text: '',
      },
    ]);
  };

  const removeTurn = (id: string) => {
    if (turns.length <= 1) return;
    setTurns((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTurnText = (id: string, newText: string) => {
    setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const toggleTurnSpeaker = (id: string) => {
    setTurns((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              speaker: t.speaker === speaker1.speaker ? speaker2.speaker : speaker1.speaker,
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
    const validParts = turns
      .filter((t) => t.text.trim())
      .map((t) => ({
        speaker: t.speaker,
        text: t.text.trim(),
        style: t.speaker === speaker1.speaker ? speaker1.style : speaker2.style,
      }));

    if (validParts.length === 0 || isGenerating) return;

    onGenerateDialogue(validParts, [speaker1, speaker2], title);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Dialogues Header */}
      <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span>तयारी दुई-पात्र सम्वादहरू (Dual-Speaker Templates):</span>
          </div>
          <span className="text-[11px] text-sky-700 font-semibold">gemini-3.8-flash-tts Multi-Speaker</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_DIALOGUES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="flex items-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-950"
            >
              <span className="text-sky-600 font-bold">✦</span>
              <span>{preset.titleNe}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speaker Configs (2 Speakers Required by Gemini TTS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Speaker 1 */}
        <div className="rounded-3xl border border-amber-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-100 text-xs font-bold text-amber-800">
                P1
              </div>
              <input
                type="text"
                value={speaker1.speaker}
                onChange={(e) => {
                  const val = e.target.value;
                  const oldName = speaker1.speaker;
                  setSpeaker1((prev) => ({ ...prev, speaker: val }));
                  setTurns((prev) =>
                    prev.map((t) => (t.speaker === oldName ? { ...t, speaker: val } : t))
                  );
                }}
                className="rounded-xl border border-amber-200 bg-amber-50/50 px-2.5 py-1 text-xs font-bold text-amber-900 focus:outline-none focus:border-amber-400"
                placeholder="पात्र १ को नाम"
              />
            </div>
            <select
              value={speaker1.voiceName}
              onChange={(e) =>
                setSpeaker1((prev) => ({ ...prev, voiceName: e.target.value as VoiceName }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/60 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {AVAILABLE_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={speaker1.style}
            onChange={(e) => setSpeaker1((prev) => ({ ...prev, style: e.target.value }))}
            placeholder="पात्र १ को शैली (उदा: Lively, young Nepali)"
            className="w-full rounded-xl border border-sky-100 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-300"
          />
        </div>

        {/* Speaker 2 */}
        <div className="rounded-3xl border border-sky-200 bg-white/90 p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100 text-xs font-bold text-sky-800">
                P2
              </div>
              <input
                type="text"
                value={speaker2.speaker}
                onChange={(e) => {
                  const val = e.target.value;
                  const oldName = speaker2.speaker;
                  setSpeaker2((prev) => ({ ...prev, speaker: val }));
                  setTurns((prev) =>
                    prev.map((t) => (t.speaker === oldName ? { ...t, speaker: val } : t))
                  );
                }}
                className="rounded-xl border border-sky-200 bg-sky-50/50 px-2.5 py-1 text-xs font-bold text-sky-900 focus:outline-none focus:border-sky-400"
                placeholder="पात्र २ को नाम"
              />
            </div>
            <select
              value={speaker2.voiceName}
              onChange={(e) =>
                setSpeaker2((prev) => ({ ...prev, voiceName: e.target.value as VoiceName }))
              }
              className="rounded-xl border border-sky-200 bg-sky-50/60 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {AVAILABLE_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={speaker2.style}
            onChange={(e) => setSpeaker2((prev) => ({ ...prev, style: e.target.value }))}
            placeholder="पात्र २ को शैली (उदा: Warm, gentle storyteller)"
            className="w-full rounded-xl border border-sky-100 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-300"
          />
        </div>
      </div>

      {/* Script Screenplay Rows */}
      <div className="space-y-3 rounded-3xl border border-sky-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-800 font-devanagari">
              सम्वादका हरफहरू (Screenplay Lines)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            {turns.length} हरफहरू | &lt;laugh&gt;, &lt;breath&gt;, |हो|, |mhm| समर्थित
          </span>
        </div>

        <div className="space-y-3">
          {turns.map((turn, index) => {
            const isSp1 = turn.speaker === speaker1.speaker;
            return (
              <div
                key={turn.id}
                className={`rounded-2xl border p-3.5 transition ${
                  isSp1
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-sky-200 bg-sky-50/30'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleTurnSpeaker(turn.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                        isSp1
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}
                      title="Click to toggle speaker"
                    >
                      <span>{turn.speaker}</span>
                      <span className="text-[10px] opacity-70">⇄ परिवर्तन</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono-code">#{index + 1}</span>
                  </div>

                  {/* Vocal burst tags */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '<breath>')}
                      className="rounded-lg border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-mono-code text-sky-700 hover:bg-sky-100"
                    >
                      &lt;breath&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '<laugh>')}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-mono-code text-amber-700 hover:bg-amber-100"
                    >
                      &lt;laugh&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '|हो|')}
                      className="rounded-lg border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono-code text-emerald-700 hover:bg-emerald-100"
                    >
                      |हो|
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTagToTurn(turn.id, '|mhm|')}
                      className="rounded-lg border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[10px] font-mono-code text-purple-700 hover:bg-purple-100"
                    >
                      |mhm|
                    </button>
                    {turns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTurn(turn.id)}
                        className="ml-2 text-slate-400 hover:text-rose-500"
                        title="Delete line"
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
                  placeholder={`${turn.speaker} को भनाइ यहाँ लेख्नुहोस्...`}
                  className="w-full rounded-xl border border-sky-100 bg-white p-3 font-devanagari text-sm text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => addTurn()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-300 py-3 text-xs font-bold text-sky-700 transition hover:border-sky-500 hover:bg-sky-50"
        >
          <Plus className="h-4 w-4" />
          <span>नयाँ सम्वाद हरफ थप्नुहोस् (Add Dialogue Turn)</span>
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-xs text-slate-500 font-medium">
          मोडल: <span className="font-semibold text-sky-800">gemini-3.8-flash-tts</span> (Dual Speaker Screenplay)
        </div>

        <button
          type="submit"
          disabled={isGenerating || turns.every((t) => !t.text.trim())}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-500 disabled:opacity-50 sm:w-auto"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>दुई-पात्र सम्वाद सिर्जना गर्दै... (Synthesizing Dialogue)</span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" />
              <span>सम्वाद अडियो सिर्जना गर्नुहोस् (Generate Dialogue Audio)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
