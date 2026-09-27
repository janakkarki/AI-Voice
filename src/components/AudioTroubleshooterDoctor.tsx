import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Copy,
  Check,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  FileText,
  Volume2,
} from 'lucide-react';
import { ScriptOptimizationResult } from '../types';

interface AudioTroubleshooterDoctorProps {
  onApplyScript: (optimizedText: string, style: string) => void;
  onGenerateImmediately?: (text: string, style: string) => void;
}

export const AudioTroubleshooterDoctor: React.FC<AudioTroubleshooterDoctorProps> = ({
  onApplyScript,
  onGenerateImmediately,
}) => {
  const [inputText, setInputText] = useState<string>(
    'यदि तपाईंले Google को AI voice-over / text-to-speech tool मा नेपाली राख्दा "Audio not supported" जस्तो देखाइरहेको कुरा गर्नुभएको हो भने, यो केवल तपाईंको setting को समस्या नहुन सक्छ। बरु यसको मुख्य कारण नेपाली भाषाको लागि API को सीमितता हुन सक्छ।'
  );
  const [tone, setTone] = useState<string>('conversational');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [result, setResult] = useState<ScriptOptimizationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimized' | 'romanized'>('optimized');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!inputText.trim()) return;
    setIsOptimizing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/tts/optimize-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: inputText, targetTone: tone }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze script');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Optimization error:', err);
      setErrorMsg(err.message || 'Script optimization failed. Please check network.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner addressing the exact question */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50 via-white to-amber-50/60 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm border border-amber-200">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                नेपाली अडियो समस्या समाधान (Audio Not Supported Fix)
              </span>
              <span className="text-xs text-slate-500 font-medium">
                API Script Analysis & Phonetic Engineering
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl font-devanagari">
              गुगल टीटीएसमा “Audio not supported” किन आउँछ र कसरी समाधान गर्ने?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              तपाईंले बिल्कुलै सही भन्नुभएको हो — Google को धेरैजसो साधारण AI voice-over वा परम्परागत TTS उपकरणहरूमा
              नेपाली भाषाका केही जटिल देवनागरी संयुक्त अक्षर, अङ्क (Numbers), र प्रतीकहरू सिधै राख्दा{' '}
              <strong className="text-amber-800">“Audio not supported”</strong> वा त्रुटि आउने गर्छ। यो तपाईंको
              डिभाइस वा सेटिङको गल्ती होइन, बरु सामान्य API को नेपाली G2P (Grapheme-to-Phoneme) सीमितता हो।
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800">1</span>
                  अङ्क र विशेष प्रतीकहरू
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-normal">
                  "२०२६", "५०%" जस्ता अङ्कहरूलाई सिधै अक्षरमा (उदा: "दुई हजार छब्बीस") रूपान्तरण गर्दा समस्या हट्छ।
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-800">2</span>
                  विराम चिन्ह र श्वास (Pacing)
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-normal">
                  देवनागरी पूर्णविराम (।) र अल्पविराम (,) लाई सही स्थानमा राख्दा मोडलले प्राकृतिक रूपमा सास फेर्छ।
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">3</span>
                  gemini-3.8-flash-tts मोडल
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-normal">
                  हाम्रो एपले नयाँ <strong>gemini-3.8-flash-tts</strong> प्रयोग गर्छ, जसले नेपाली लवजलाई सहजै आवाजमा बदल्छ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Script Doctor Tool */}
      <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 shadow-2xs">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 font-devanagari">
                स्क्रिप्ट डाक्टर (Smart TTS Optimizer)
              </h3>
              <p className="text-xs text-slate-500">
                तपाईंको नेपाली वाक्य यहाँ राख्नुहोस् — एआईले "Audio not supported" हटाएर ध्वनि-अनुकूल बनाइदिनेछ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">लवज / शैली:</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-xl border border-sky-200 bg-sky-50/60 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none"
            >
              <option value="conversational">स्वाभाविक कुराकानी (Conversational)</option>
              <option value="news">औपचारिक समाचार (Formal News)</option>
              <option value="storytelling">रोचक कथा वाचन (Storytelling)</option>
              <option value="calm">शान्त तथा ध्यान (Calm & Soft)</option>
            </select>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="यहाँ आफ्नो नेपाली वाक्य राख्नुहोस्..."
              className="w-full rounded-2xl border border-sky-200/80 bg-slate-50/60 p-4 font-devanagari text-sm leading-relaxed text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-mono-code">
              {inputText.length} अक्षरहरू
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>
                यसले अङ्कहरूलाई नेपाली शब्दमा बदल्छ र विराम चिन्हलाई सास फेर्न अनुकूल बनाउँछ।
              </span>
            </div>

            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !inputText.trim()}
              className="flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-500 disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>विश्लेषण गर्दै... (Analyzing)</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>निदान र सुधार गर्नुहोस् (Diagnose & Fix)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="mt-6 space-y-5 border-t border-sky-100 pt-6">
            {/* Diagnostics Summary */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>निदान प्रतिवेदन (Diagnostic Findings & Fixes)</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 font-devanagari">
                {result.diagnostics.nepaliExplanation}
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-100 bg-white/90 p-3">
                  <span className="text-[11px] font-bold text-amber-800">फेला परेका चुनौतीहरू (Detected Issues):</span>
                  <ul className="mt-1 list-inside list-disc text-xs text-slate-600">
                    {result.diagnostics.issuesDetected.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white/90 p-3">
                  <span className="text-[11px] font-bold text-emerald-800">लागू गरिएका सुधारहरू (Fixes Applied):</span>
                  <ul className="mt-1 list-inside list-disc text-xs text-slate-600">
                    {result.diagnostics.improvementsApplied.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Output Tabs: Optimized Devanagari vs Romanized Phonetic */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('optimized')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === 'optimized'
                        ? 'bg-sky-600 text-white shadow-2xs font-bold'
                        : 'bg-sky-50 text-slate-600 hover:text-sky-800'
                    }`}
                  >
                    सुधारिएको देवनागरी (Optimized Devanagari)
                  </button>
                  <button
                    onClick={() => setActiveTab('romanized')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === 'romanized'
                        ? 'bg-sky-600 text-white shadow-2xs font-bold'
                        : 'bg-sky-50 text-slate-600 hover:text-sky-800'
                    }`}
                  >
                    रोमनाइज्ड / फोनेटिक (Romanized - 100% Safe)
                  </button>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      activeTab === 'optimized' ? result.optimizedText : result.phoneticRomanizedText,
                      'tab-copy'
                    )
                  }
                  className="flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-sky-100"
                >
                  {copiedKey === 'tab-copy' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-sky-600" />}
                  <span>कपी गर्नुहोस्</span>
                </button>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-slate-50/80 p-4 font-devanagari text-sm leading-relaxed text-slate-800">
                {activeTab === 'optimized' ? (
                  <p>{result.optimizedText}</p>
                ) : (
                  <p className="font-mono-code text-xs text-sky-800">{result.phoneticRomanizedText}</p>
                )}
              </div>

              {/* Translation preview */}
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-3 text-xs text-slate-600">
                <span className="font-bold text-slate-800">English Meaning: </span>
                {result.englishTranslation}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onApplyScript(result.optimizedText, result.voiceStyleSuggestion)}
                  className="flex items-center gap-2 rounded-2xl border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-800 transition hover:bg-sky-100"
                >
                  <span>भ्वाइस स्टुडियोमा राख्नुहोस् (Use in Studio)</span>
                  <ArrowRight className="h-4 w-4 text-sky-600" />
                </button>

                {onGenerateImmediately && (
                  <button
                    onClick={() => onGenerateImmediately(result.optimizedText, result.voiceStyleSuggestion)}
                    className="flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-500"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>सिधै अडियो बजाउनुहोस् (Generate Speech Now)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
