import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  Code2,
  ExternalLink,
  Zap,
  Scale,
  Sparkles,
  Layers,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ALTERNATIVE_TTS_TOOLS } from '../data/alternativeTtsTools';

export const AlternativeTtsComparison: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedCodeIndex, setExpandedCodeIndex] = useState<number | null>(0);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Research Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50 via-white to-blue-50/70 p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 shadow-2xs">
            <Scale className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-800 border border-sky-200">
                अनुसन्धान तथा तुलना प्रतिवेदन (TTS Research & Recommendations)
              </span>
              <span className="text-xs text-slate-500 font-medium">नेपाली भाषाका लागि प्रमुख वैकल्पिक उपकरणहरू</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl font-devanagari">
              गुगल टीटीएसको विकल्पमा नेपाली भाषालाई मजबुत समर्थन गर्ने प्रमुख ३+ उपकरणहरू
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              यदि तपाईंको उत्पादन (Production Application) मा Google को आधारभूत स्पिच एपीआईले देवनागरी लिपि वा "Audio not supported" को समस्या सिर्जना गरेको छ भने, 
              नेपाली भाषाका लागि उच्च शुद्धता र बलियो विकासकर्ता समर्थन भएका विश्वस्तरीय विकल्पहरू निम्न छन्:
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3 text-xs">
              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 shadow-2xs">
                <span className="font-bold text-sky-800 block mb-1">१. व्यावसायिक शुद्धतामा नम्बर १:</span>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Microsoft Azure AI Speech:</strong> आधिकारिक <code className="text-sky-700 bg-sky-50 px-1 py-0.5 rounded font-mono font-bold">ne-NP</code> मोडलहरू (हेमकला र सागर) सँग त्रुटिहीन देवनागरी उच्चारण।
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 shadow-2xs">
                <span className="font-bold text-emerald-800 block mb-1">२. खुला स्रोत र सार्वभौम एआई:</span>
                <p className="text-slate-600 leading-relaxed">
                  <strong>AI4Bharat Indic-TTS / Bhashini:</strong> आईआईटी मद्रासद्वारा भारतीय उपमहाद्वीपीय भाषा ध्वनिशास्त्रमा प्रशिक्षित पूर्ण निःशुल्क मोडल।
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/90 p-3.5 shadow-2xs">
                <span className="font-bold text-indigo-800 block mb-1">३. भावनात्मक र चलचित्र स्तर:</span>
                <p className="text-slate-600 leading-relaxed">
                  <strong>ElevenLabs Multilingual:</strong> मानवीय भावना, हाँसो, श्वासप्रश्वास र १-मिनेटमै नेपाली आवाज क्लोनिङ गर्ने क्षमता।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="overflow-hidden rounded-3xl border border-sky-200/90 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="border-b border-sky-100 p-4 sm:p-5">
          <h3 className="text-sm font-bold text-slate-800 font-devanagari sm:text-base">
            विस्तृत तुलना तालिका (Feature & Performance Comparison Matrix)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            नेपाली भाषाका लागि शुद्धता, मूल्य, एकीकरण सहजता र क्षमताको आधारमा मूल्याङ्कन
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sky-50/70 text-slate-700 border-b border-sky-100">
              <tr>
                <th className="p-3.5 font-bold">उपकरण / प्लेटफर्म</th>
                <th className="p-3.5 font-bold">नेपाली मूल्याङ्कन</th>
                <th className="p-3.5 font-bold">आधिकारिक नेपाली आवाज</th>
                <th className="p-3.5 font-bold">देवनागरी शुद्धता</th>
                <th className="p-3.5 font-bold">मूल्य / निःशुल्क टियर</th>
                <th className="p-3.5 font-bold">एकीकरण सहजता</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-slate-700">
              {ALTERNATIVE_TTS_TOOLS.map((tool, idx) => (
                <tr key={idx} className="hover:bg-sky-50/50 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div>{tool.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{tool.tagline}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block rounded-lg bg-sky-100 px-2 py-0.5 font-mono-code font-bold text-sky-800 border border-sky-200">
                      {tool.nepaliSupportRating}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700">
                    <ul className="list-inside list-disc text-[11px] space-y-0.5">
                      {tool.nepaliVoices.map((v, i) => (
                        <li key={i}>{v.split(' ')[0]}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-700 font-devanagari">
                    {tool.accuracyVerdict}
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-600 max-w-[180px]">
                    {tool.pricingModel}
                  </td>
                  <td className="p-3.5 text-[11px] text-sky-700 font-semibold">
                    {tool.integrationMethod.split(',')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Tool Deep Dives & Ready-to-use Code */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          प्रत्येक विकल्पको प्राविधिक विश्लेषण र कोड नमूना (Technical Analysis & Code):
        </h3>

        <div className="grid grid-cols-1 gap-5">
          {ALTERNATIVE_TTS_TOOLS.map((tool, index) => {
            const isCodeOpen = expandedCodeIndex === index;
            return (
              <div
                key={index}
                className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 backdrop-blur-md shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-800">{tool.name}</h4>
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
                        {tool.nepaliSupportRating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tool.tagline}</p>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-sky-800">सिफारिस: </span>
                    <span>{tool.recommendedFor}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>प्रमुख सबल पक्षहरू (Key Strengths)</span>
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                      {tool.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations & Integration */}
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-2">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span>ध्यान दिनुपर्ने पक्षहरू (Considerations)</span>
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside mb-3">
                      {tool.limitations.map((lim, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {lim}
                        </li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-slate-600 border-t border-amber-200/60 pt-2">
                      <strong className="text-slate-800">एकीकरण विधि:</strong> {tool.integrationMethod}
                    </div>
                  </div>
                </div>

                {/* Code Snippet Accordion */}
                <div className="mt-4 pt-3 border-t border-sky-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedCodeIndex(isCodeOpen ? null : index)}
                      className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
                    >
                      <Code2 className="h-4 w-4" />
                      <span>{isCodeOpen ? 'कोड लुकाउनुहोस्' : 'एकीकरण कोड हेर्नुहोस् (View Integration Code)'}</span>
                      {isCodeOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {isCodeOpen && (
                      <button
                        onClick={() => copyCode(tool.codeSnippet, index)}
                        className="flex items-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-sky-100"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-sky-600" />
                        )}
                        <span>{copiedIndex === index ? 'कपी गरियो' : 'कोड कपी गर्नुहोस्'}</span>
                      </button>
                    )}
                  </div>

                  {isCodeOpen && (
                    <div className="mt-2.5 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono-code text-xs text-slate-200">
                      <pre>{tool.codeSnippet}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
