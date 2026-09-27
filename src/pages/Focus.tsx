import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SOUND_TRACKS } from '../services/audio';
import {
  Hourglass,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Headphones,
  CheckCircle2,
  Flame,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const Focus: React.FC = () => {
  const {
    activeFocusTask,
    setActiveFocusTask,
    tasks,
    timerMode,
    timerSecondsLeft,
    isTimerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    setCustomTimer,
    sessionCount,
    todayFocusMinutes,
    isAudioPlaying,
    currentTrackId,
    playTrack,
    toggleAudio,
    audioVolume,
    setAudioVolume,
    setDistractionFree,
    settings,
  } = useApp();

  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const minutes = Math.floor(timerSecondsLeft / 60);
  const seconds = timerSecondsLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSecs = timerMode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;
  const progressPercent = totalSecs > 0 ? Math.min(100, Math.round(((totalSecs - timerSecondsLeft) / totalSecs) * 100)) : 0;

  const currentTrack = SOUND_TRACKS.find((t) => t.id === currentTrackId) || SOUND_TRACKS[0];

  const openTasks = tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Focus Chamber 2.0</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Deep Work Engine
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pomodoro flow, ambient procedural acoustic environments, and gamified progress
          </p>
        </div>

        <button
          onClick={() => setDistractionFree(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
          <span>Zen Fullscreen (Ctrl+Shift+F)</span>
        </button>
      </div>

      {/* Main Focus Chamber Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Indicator & Presets */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6">
          {[
            { label: '25 / 5 Standard', w: 25, b: 5 },
            { label: '50 / 10 Deep', w: 50, b: 10 },
            { label: '90 / 20 Ultradian', w: 90, b: 20 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setCustomTimer(preset.w, preset.b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                settings.workDuration === preset.w
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            Custom
          </button>
        </div>

        {/* Task Attachment Pill */}
        <div className="relative z-10 w-full max-w-md mb-6">
          <label className="text-[11px] text-slate-400 font-mono block mb-1">
            CURRENT ANCHOR OBJECTIVE:
          </label>
          <select
            value={activeFocusTask?.id || ''}
            onChange={(e) => {
              const t = tasks.find((item) => item.id === e.target.value);
              setActiveFocusTask(t || null);
            }}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer shadow-md truncate"
          >
            <option value="">No task linked (Open Flow Session)</option>
            {openTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.estimatedDuration}m)
              </option>
            ))}
          </select>
        </div>

        {/* Big Circular Progress & Timer */}
        <div className="relative z-10 my-4 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center border-4 border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-950/60">
            {/* SVG circle track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-slate-800/40 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-amber-400 fill-none transition-all duration-700"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={`${283 - (283 * progressPercent) / 100}`}
                strokeLinecap="round"
              />
            </svg>

            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
                {timerMode === 'work' ? 'Deep Work Flow' : 'Restorative Break'}
              </span>
              <span className="font-mono text-5xl sm:text-6xl font-black text-white tracking-tighter">
                {timeDisplay}
              </span>
              <span className="text-xs text-slate-500 font-mono mt-1">
                Cycle #{sessionCount + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all transform active:scale-95"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isTimerRunning ? pauseTimer : startTimer}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                <span>START FOCUS</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all transform active:scale-95"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Soundscape Integration Deck */}
        <div className="relative z-10 w-full max-w-lg mt-8 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                Soundscape
              </p>
              <h4 className="text-xs font-bold text-white">{currentTrack.name}</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentTrack.id}
              onChange={(e) => playTrack(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              {SOUND_TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={toggleAudio}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
            >
              {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Metrics Footer */}
        <div className="relative z-10 grid grid-cols-3 gap-4 w-full max-w-md mt-6 pt-6 border-t border-slate-800/80 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">TODAY FOCUS</span>
            <span className="text-lg font-bold text-amber-400">{todayFocusMinutes}m</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">COMPLETED</span>
            <span className="text-lg font-bold text-sky-400">{sessionCount} Blocks</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">REWARD</span>
            <span className="text-lg font-bold text-purple-400">+35 XP</span>
          </div>
        </div>
      </div>

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold text-white text-base mb-3">Custom Timer Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Work Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={customWork}
                  onChange={(e) => setCustomWork(parseInt(e.target.value, 10) || 25)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Break Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(parseInt(e.target.value, 10) || 5)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setCustomTimer(customWork, customBreak);
                    setShowCustomModal(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
