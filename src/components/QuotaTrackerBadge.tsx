import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap, Info, Clock, RotateCcw, Sparkles } from 'lucide-react';
import { QuotaUsage } from '../types';
import { resetQuotaUsage } from '../utils/quotaManager';

interface QuotaTrackerBadgeProps {
  quota: QuotaUsage;
  onQuotaUpdated: (quota: QuotaUsage) => void;
  pendingChars?: number;
}

export const QuotaTrackerBadge: React.FC<QuotaTrackerBadgeProps> = ({
  quota,
  onQuotaUpdated,
  pendingChars = 0,
}) => {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const percentUsed = Math.min(
    100,
    Math.round((quota.usedCharsToday / quota.dailyCharLimit) * 100)
  );

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  const handleManualReset = () => {
    if (window.confirm('के तपाईं आजको कोटा तथ्याङ्क रिसेट गर्न चाहनुहुन्छ?')) {
      const fresh = resetQuotaUsage();
      onQuotaUpdated(fresh);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetailModal(true)}
        className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-200/90 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md transition hover:border-sky-400 hover:shadow-md"
        title="क्लिक गरी दैनिक क्यारेक्टर लिमिट र कोटा विवरण हेर्नुहोस्"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/20">
          <Activity className="h-4 w-4" />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-800 font-devanagari">
              दैनिक कोटा: {quota.remainingChars.toLocaleString('ne-NP')} बाँकी
            </span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                percentUsed > 80
                  ? 'bg-rose-100 text-rose-700'
                  : percentUsed > 50
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {percentUsed}% खर्च
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentUsed > 80
                    ? 'bg-rose-500'
                    : percentUsed > 50
                    ? 'bg-amber-500'
                    : 'bg-sky-500'
                }`}
                style={{ width: `${Math.max(4, percentUsed)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono-code">
              {quota.usedCharsToday.toLocaleString()} / {quota.dailyCharLimit.toLocaleString()}
            </span>
          </div>
        </div>

        {pendingChars > 0 && (
          <div className="hidden sm:block border-l border-sky-100 pl-2 text-[10px] text-sky-700 font-medium">
            + {pendingChars} अक्षर
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-devanagari">
                    दैनिक कोटा तथा प्रयोग विवरण
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daily Character & TTS Usage Quota Tracker
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Progress Card */}
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50/50 p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>आजको कुल क्यारेक्टर सीमा:</span>
                  <span className="font-bold text-slate-800 font-mono-code">
                    {quota.dailyCharLimit.toLocaleString()} अक्षर
                  </span>
                </div>

                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white shadow-inner border border-sky-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentUsed > 80
                        ? 'bg-rose-500'
                        : percentUsed > 50
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-sky-500 to-blue-600'
                    }`}
                    style={{ width: `${Math.max(2, percentUsed)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    खर्च: <strong className="text-slate-700">{quota.usedCharsToday.toLocaleString()}</strong> अक्षर
                  </span>
                  <span className="font-bold text-sky-700">
                    बाँकी: {quota.remainingChars.toLocaleString()} अक्षर
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>सफल स्पिच अनुरोध:</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-slate-800 font-mono-code">
                    {quota.requestsCountToday} पटक
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="h-3.5 w-3.5 text-sky-500" />
                    <span>कुल सिर्जित अडियो:</span>
                  </div>
                  <div className="mt-1 text-base font-bold text-slate-800 font-mono-code">
                    {formatAudioTime(quota.totalAudioSecondsGenerated)}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-[11px] leading-relaxed text-sky-900">
                <div className="flex items-center gap-1 font-bold text-sky-950 mb-0.5">
                  <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                  <span>स्वचालित रिसेट प्रणाली (Daily Reset)</span>
                </div>
                प्रत्येक दिन मध्यरात (00:00 AM) मा तपाईंको क्यारेक्टर कोटा स्वतः पुनः ५०,००० अक्षरमा ताजा हुन्छ।
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleManualReset}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>रिसेट गर्नुहोस्</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="rounded-xl bg-sky-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-500"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
