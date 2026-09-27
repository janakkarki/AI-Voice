import React, { useState } from 'react';
import { Languages, ArrowRight, Volume2, Sparkles, Copy, Check } from 'lucide-react';

interface TranslatorPanelProps {
  onSendToStudio: (nepaliText: string) => void;
  onSpeakImmediately: (nepaliText: string) => void;
}

export const TranslatorPanel: React.FC<TranslatorPanelProps> = ({
  onSendToStudio,
  onSpeakImmediately,
}) => {
  const [sourceText, setSourceText] = useState<string>(
    'Welcome to Nepal! The majestic Himalayas and the warm hospitality of the people make it an unforgettable journey.'
  );
  const [translatedText, setTranslatedText] = useState<string>('');
  const [romanized, setRomanized] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/tts/translate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText, targetLanguage: 'ne' }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        setRomanized(data.romanized || '');
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyResult = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 rounded-3xl border border-sky-200/90 bg-white/90 p-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-2xs">
          <Languages className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 font-devanagari">
            अंग्रेजीबाट प्राकृतिक नेपाली बोली अनुवाद (Translate & Speak)
          </h3>
          <p className="text-xs text-slate-500">
            कुनै पनि भाषाको वाक्यलाई नेपाली बोलीचालीको प्राकृतिक शैलीमा बदलेर सिधै आवाज निकाल्नुहोस्
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Source Text */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-700">
            स्रोत भाषा (English / Any Language):
          </label>
          <textarea
            rows={4}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type your English or other language text here..."
            className="w-full rounded-2xl border border-sky-200/80 bg-slate-50/60 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
            className="flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-sky-500 shadow-md shadow-sky-500/20 disabled:opacity-50"
          >
            {isTranslating ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>अनुवाद गर्दै... (Translating)</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>नेपालीमा अनुवाद गर्नुहोस् (Translate to Spoken Nepali)</span>
              </>
            )}
          </button>
        </div>

        {/* Target Nepali Text */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-sky-800">
              नेपाली आवाज-अनुकूल अनुवाद (Spoken Nepali Result):
            </label>
            {translatedText && (
              <button
                onClick={copyResult}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-700"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'कपी गरियो' : 'कपी'}</span>
              </button>
            )}
          </div>

          <div className="min-h-[110px] rounded-2xl border border-sky-100 bg-sky-50/40 p-4 font-devanagari text-sm leading-relaxed text-slate-800">
            {translatedText ? (
              <p>{translatedText}</p>
            ) : (
              <p className="text-xs text-slate-400 italic">
                बायाँ तर्फको बटन थिचेपछि यहाँ नेपाली अनुवाद देखिनेछ...
              </p>
            )}
          </div>

          {romanized && (
            <p className="font-mono-code text-[11px] text-sky-800 font-medium">
              फोनेटिक उच्चारण: {romanized}
            </p>
          )}

          {translatedText && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onSendToStudio(translatedText)}
                className="flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100"
              >
                <span>भ्वाइस स्टुडियोमा प्रयोग गर्नुहोस्</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onSpeakImmediately(translatedText)}
                className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-sky-500"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>तत्काल सुन्नुहोस् (Speak Now)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
