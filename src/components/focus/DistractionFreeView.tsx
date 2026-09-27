import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SOUND_TRACKS } from '../../services/audio';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Minimize2,
  Headphones,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const DistractionFreeView: React.FC = () => {
  const {
    isDistractionFree,
    setDistractionFree,
    activeFocusTask,
    timerSecondsLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    sessionCount,
    todayFocusMinutes,
    isAudioPlaying,
    currentTrackId,
    toggleAudio,
    playTrack,
    audioVolume,
    setAudioVolume,
  } = useApp();

  // Escape to exit fullscreen mode
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDistractionFree) {
        setDistractionFree(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isDistractionFree, setDistractionFree]);

  if (!isDistractionFree) return null;

  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTrack = SOUND_TRACKS.find((t) => t.id === currentTrackId) || SOUND_TRACKS[0];

  return (
    <div className="fixed inset-0 z-[99999] bg-[#070a10] text-slate-100 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-extrabold text-sm">
            L
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Zen Focus Chamber
          </span>
        </div>

        {/* Ambient Audio pill */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md">
          <Headphones className="w-4 h-4 text-amber-400" />
          <select
            value={currentTrack.id}
            onChange={(e) => playTrack(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {SOUND_TRACKS.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={toggleAudio}
            className="p-1 rounded text-slate-300 hover:text-amber-400"
          >
            {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setAudioVolume(audioVolume > 0 ? 0 : 0.5)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            {audioVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setDistractionFree(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          title="Exit Zen Mode (Esc)"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="hidden sm:inline">Exit (Esc)</span>
        </button>
      </div>

      {/* Main Center Area */}
      <div className="flex flex-col items-center justify-center text-center my-auto">
        {/* Active Task Banner */}
        <div className="max-w-xl mb-8">
          <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Locked Intent
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            {activeFocusTask ? activeFocusTask.title : 'Deep Unbroken Flow State'}
          </h1>
          {activeFocusTask?.description && (
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto line-clamp-2">
              {activeFocusTask.description}
            </p>
          )}
        </div>

        {/* Huge Monospaced Timer */}
        <div className="relative flex items-center justify-center mb-8">
          <span className="font-mono text-7xl sm:text-9xl font-black tracking-tighter text-white tabular-nums select-none drop-shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            {timeFormatted}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all transform active:scale-95"
            title="Reset session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isTimerRunning ? pauseTimer : startTimer}
            className="px-8 py-4 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-lg shadow-2xl shadow-amber-500/30 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-6 h-6 fill-slate-950" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                <span>FLOW</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all transform active:scale-95"
            title="Complete & Skip"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Session Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-900 pt-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Completed Cycles: {sessionCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Total Focus Today: {todayFocusMinutes} mins</span>
        </div>
        <div className="hidden sm:block">
          <span>Ctrl + Shift + F to toggle</span>
        </div>
      </div>
    </div>
  );
};
