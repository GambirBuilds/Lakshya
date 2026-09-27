import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getGreeting } from '../../utils/dates';
import { MoodType } from '../../types';
import { fireConfetti } from '../../utils/confetti';
import {
  Sun,
  X,
  Target,
  Clock,
  Smile,
  ArrowRight,
  Check,
} from 'lucide-react';

export const MorningModeModal: React.FC = () => {
  const {
    isMorningModalOpen,
    setMorningModalOpen,
    settings,
    tasks,
    toggleDailyTop3,
    logTodayMood,
    addToast,
  } = useApp();

  const [focusGoal, setFocusGoal] = useState<number>(90);
  const [selectedMood, setSelectedMood] = useState<MoodType>('great');
  const [moodNote, setMoodNote] = useState('');

  if (!isMorningModalOpen) return null;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const top3Tasks = tasks.filter((t) => t.isDailyTop3);
  const availableTasks = tasks.filter((t) => t.status !== 'completed' && !t.isDailyTop3).slice(0, 8);

  const moods: Array<{ type: MoodType; emoji: string; label: string }> = [
    { type: 'great', emoji: '😀', label: 'Great' },
    { type: 'good', emoji: '🙂', label: 'Good' },
    { type: 'okay', emoji: '😐', label: 'Okay' },
    { type: 'low', emoji: '😔', label: 'Low' },
    { type: 'exhausted', emoji: '😫', label: 'Exhausted' },
  ];

  const handleStartDay = () => {
    logTodayMood(selectedMood, moodNote.trim() || undefined);
    fireConfetti(2500);
    setMorningModalOpen(false);
    addToast({
      type: 'success',
      title: 'Day Activated with Purpose!',
      message: `Aim high, ${settings.userName}. Your focus goal is ${focusGoal} minutes.`,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          onClick={() => setMorningModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun className="w-6 h-6 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {getGreeting(settings.userName)}
            </h3>
            <p className="text-xs text-amber-400/90 font-mono">{todayDate}</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 mb-6 italic">
          "Aim with clear intent. Focus without friction. Today is your canvas for mastery."
        </p>

        {/* Section 1: Mood */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-amber-400" />
            How is your mindset this morning?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.type}
                type="button"
                onClick={() => setSelectedMood(m.type)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                  selectedMood === m.type
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className="text-[10px] font-semibold">{m.label}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Optional quick thought about your energy today..."
            className="mt-3 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Section 2: Daily Top 3 */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" />
              Lock in Today's Top 3 Priorities ({top3Tasks.length}/3)
            </label>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Choose the 3 highest leverage tasks that would make today a triumph.
          </p>

          {/* Current Top 3 */}
          <div className="space-y-1.5 mb-3">
            {top3Tasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1">No Top 3 selected yet. Pick below:</p>
            ) : (
              top3Tasks.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white">{t.title}</span>
                  </div>
                  <button
                    onClick={() => toggleDailyTop3(t.id)}
                    className="text-amber-400 hover:text-amber-200 text-xs font-mono"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Available candidate tasks to add */}
          {top3Tasks.length < 3 && availableTasks.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                Suggested Tasks:
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {availableTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleDailyTop3(t.id)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs transition-colors"
                  >
                    <span className="text-slate-300 truncate max-w-[280px]">{t.title}</span>
                    <span className="text-amber-400 text-xs font-semibold hover:underline">+ Pin</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Focus Duration Target */}
        <div className="mb-8 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Today's Deep Work Commitment
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[45, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setFocusGoal(mins)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  focusGoal === mins
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mins} Mins
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartDay}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
        >
          <span>START MY DAY</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
