import React from 'react';
import { History, Play, Trash2, Download, Clock, Music, FileAudio } from 'lucide-react';
import { GeneratedAudioItem } from '../types';
import { downloadAsMp3 } from '../utils/audioConverter';

interface HistoryDrawerProps {
  items: GeneratedAudioItem[];
  onSelect: (item: GeneratedAudioItem) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  items,
  onSelect,
  onClear,
  onDelete,
}) => {
  if (items.length === 0) {
    return null;
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDownloadWav = (e: React.MouseEvent, item: GeneratedAudioItem) => {
    e.stopPropagation();
    const safeTitle = (item.title || 'nepali-voice').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const link = document.createElement('a');
    link.href = item.audioData;
    link.download = `${safeTitle}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMp3 = async (e: React.MouseEvent, item: GeneratedAudioItem) => {
    e.stopPropagation();
    const safeTitle = (item.title || 'nepali-voice').toLowerCase().replace(/[^a-z0-9]/g, '-');
    await downloadAsMp3(item.audioData, `${safeTitle}.mp3`);
  };

  return (
    <div className="rounded-3xl border border-sky-200/90 bg-white/90 p-5 backdrop-blur-md shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-800 font-devanagari">
            हालसालै सिर्जना गरिएका अडियोहरू (Audio History)
          </h3>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-200">
            {items.length}
          </span>
        </div>

        <button
          onClick={onClear}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
        >
          सबै मेटाउनुहोस् (Clear All)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative cursor-pointer rounded-2xl border border-sky-100 bg-slate-50/70 p-4 transition hover:border-sky-300 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="line-clamp-1 text-xs font-bold text-slate-800 group-hover:text-sky-700">
                {item.title}
              </span>
              <span className="shrink-0 text-[10px] text-slate-400 font-mono-code">
                {formatTime(item.timestamp)}
              </span>
            </div>

            <p className="mt-1.5 line-clamp-2 text-xs font-devanagari text-slate-600">
              "{item.text}"
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-sky-100">
              <div className="flex items-center gap-1.5 text-[10px] text-sky-800 font-semibold">
                <Music className="h-3 w-3 text-sky-600" />
                <span>
                  {item.mode === 'discussion'
                    ? '५-पात्र छलफल'
                    : item.mode === 'dialogue'
                    ? '२-पात्र सम्वाद'
                    : item.voiceName || 'Kore'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleDownloadMp3(e, item)}
                  className="rounded-lg p-1 text-sky-700 hover:bg-sky-100"
                  title="Download MP3"
                >
                  <FileAudio className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => handleDownloadWav(e, item)}
                  className="rounded-lg p-1 text-slate-600 hover:bg-slate-200"
                  title="Download WAV"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
