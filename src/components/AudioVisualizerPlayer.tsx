import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Download, Volume2, VolumeX, Sparkles, FileAudio, Music2 } from 'lucide-react';
import { GeneratedAudioItem } from '../types';
import { downloadAsMp3 } from '../utils/audioConverter';

interface AudioVisualizerPlayerProps {
  item: GeneratedAudioItem | null;
  onClear?: () => void;
}

export const AudioVisualizerPlayer: React.FC<AudioVisualizerPlayerProps> = ({ item }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isConvertingMp3, setIsConvertingMp3] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize or update audio element when item changes
  useEffect(() => {
    if (!item?.audioData) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = item.audioData;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [item?.audioData, item?.id]);

  const togglePlay = () => {
    if (!audioRef.current || !item?.audioData) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play error:', err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const downloadWav = () => {
    if (!item?.audioData) return;
    const safeTitle = (item.title || 'nepali-ai-speech')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const link = document.createElement('a');
    link.href = item.audioData;
    link.download = `${safeTitle}-${Date.now()}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadMp3 = async () => {
    if (!item?.audioData) return;
    setIsConvertingMp3(true);
    try {
      const safeTitle = (item.title || 'nepali-ai-speech')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 30);
      await downloadAsMp3(item.audioData, `${safeTitle}-${Date.now()}.mp3`);
    } catch (err) {
      console.error('Failed to download MP3:', err);
    } finally {
      setIsConvertingMp3(false);
    }
  };

  // Canvas waveform visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBars = 52;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 6;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.28);
          const wave2 = Math.cos(phase * 1.5 + i * 0.15);
          const factor = Math.abs(wave1 * wave2);
          barHeight = Math.max(6, factor * (height * 0.88));
        } else {
          const factor = Math.sin(i * 0.25) * 0.3 + 0.35;
          barHeight = Math.max(5, factor * 22);
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#0284c7'); // sky-600
          gradient.addColorStop(0.5, '#4f46e5'); // indigo-600
          gradient.addColorStop(1, '#06b6d4'); // cyan-500
        } else {
          gradient.addColorStop(0, '#94a3b8');
          gradient.addColorStop(1, '#cbd5e1');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.12 * playbackRate;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackRate]);

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!item) {
    return (
      <div className="rounded-3xl border border-sky-200/90 bg-white/70 p-6 text-center shadow-lg shadow-sky-500/5 backdrop-blur-md">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm">
          <Music2 className="h-6 w-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 font-devanagari">
          कुनै अडियो तयार छैन (No Audio Ready)
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          तलबाट वाचक छान्नुहोस् वा आफ्नै नेपाली वाक्य लेखेर "अडियो सिर्जना गर्नुहोस्" मा क्लिक गर्नुहोस्।
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/90 bg-white/90 p-5 shadow-xl shadow-sky-500/10 backdrop-blur-xl">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration || item.durationEstimateSec || 0);
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Header Info Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 font-bold text-white shadow-md shadow-sky-500/25">
            {item.mode === 'discussion' ? '5P' : item.mode === 'dialogue' ? '2P' : 'TTS'}
          </div>
          <div>
            <h3 className="line-clamp-1 text-sm font-bold text-slate-800 sm:text-base font-devanagari">
              {item.title || 'नेपाली एआई वाचन'}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-800 border border-sky-200">
                gemini-3.8-flash-tts
              </span>
              <span>•</span>
              <span className="font-medium text-slate-700">
                {item.mode === 'discussion'
                  ? '५-पात्र गोलमेच छलफल (5-Person Panel)'
                  : item.mode === 'dialogue'
                  ? 'दुई-पात्र सम्वाद (2-Speaker)'
                  : `Voice: ${item.voiceName || 'Kore'}`}
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">24kHz Hi-Fi</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: MP3 and WAV */}
        <div className="flex items-center gap-2">
          {/* Prominent MP3 Button */}
          <button
            onClick={handleDownloadMp3}
            disabled={isConvertingMp3}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-sky-500/25 transition hover:brightness-105 disabled:opacity-50"
            title="Download compressed MP3 audio file"
          >
            {isConvertingMp3 ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>MP3 बन्दैछ...</span>
              </>
            ) : (
              <>
                <FileAudio className="h-4 w-4" />
                <span>MP3 डाउनलोड</span>
              </>
            )}
          </button>

          {/* WAV Button */}
          <button
            onClick={downloadWav}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            title="Download studio quality 24kHz WAV"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>WAV (24kHz)</span>
          </button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-50/70 to-blue-50/50 p-2.5 shadow-inner border border-sky-100">
        <canvas
          ref={canvasRef}
          width={640}
          height={68}
          className="h-16 w-full rounded-xl"
        />
      </div>

      {/* Timeline Scrubber */}
      <div className="mb-4">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || item.durationEstimateSec || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-sky-100 accent-sky-600 focus:outline-none"
          />
        </div>
        <div className="mt-1 flex justify-between font-mono-code text-[11px] text-slate-500">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(duration || item.durationEstimateSec || 0)}</span>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Play / Pause / Rewind / Speed */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-sky-100 hover:text-slate-800"
            title="सुरुबाट बजाउनुहोस्"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30 transition hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-white text-white" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
            )}
          </button>

          {/* Speed Presets */}
          <div className="ml-2 flex items-center rounded-xl border border-sky-200/80 bg-sky-50/80 p-0.5 text-[11px] font-semibold">
            {[0.8, 1, 1.2, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => changeSpeed(rate)}
                className={`rounded-lg px-2.5 py-1 transition ${
                  playbackRate === rate
                    ? 'bg-white text-sky-800 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="rounded-lg p-1.5 text-slate-500 transition hover:text-slate-800"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-rose-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-slate-600" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolume}
            className="h-1.5 w-20 cursor-pointer appearance-none rounded-lg bg-sky-100 accent-sky-600"
            title="Volume"
          />
        </div>
      </div>

      {/* Script snippet preview */}
      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50/50 p-3">
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-700 font-devanagari">
          "{item.text}"
        </p>
      </div>
    </div>
  );
};
