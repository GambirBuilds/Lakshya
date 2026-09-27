import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Habit } from '../types';
import { getTodayDateString } from '../services/storage';
import { formatDateToYYYYMMDD } from '../utils/dates';
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Trophy,
  X,
  Compass,
  Zap,
  Activity,
  Moon,
} from 'lucide-react';

export const Habits: React.FC = () => {
  const { habits, addHabit, toggleHabitToday, deleteHabit, updateHabit } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f59e0b');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');

  const today = getTodayDateString();

  // Last 7 days for the weekly habit grid
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(formatDateToYYYYMMDD(d));
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      description: description.trim(),
      color,
      icon: 'Flame',
      frequency,
      targetDaysPerWeek: frequency === 'weekdays' ? 5 : 7,
    });

    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const completedTodayCount = habits.filter((h) => !!h.logs[today]).length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Habit Matrix & Streaks</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {completedTodayCount}/{habits.length} Done Today
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build unshakeable daily rituals: atomic consistency produces exponential mastery
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const isDoneToday = !!habit.logs[today];

          return (
            <div
              key={habit.id}
              className={`p-5 rounded-3xl border backdrop-blur-md shadow-lg transition-all ${
                isDoneToday
                  ? 'bg-slate-900/80 border-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Info & Big Toggle Checkbox */}
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 shrink-0 transition-transform active:scale-90"
                    title={isDoneToday ? 'Completed today! Click to undo' : 'Mark done for today'}
                  >
                    {isDoneToday ? (
                      <CheckCircle2 className="w-8 h-8 text-amber-400 fill-amber-400/20" />
                    ) : (
                      <Circle className="w-8 h-8 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white truncate">{habit.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-slate-800 text-slate-300">
                        {habit.frequency}
                      </span>
                    </div>
                    {habit.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Streak & 7-Day History Nodes */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* Streak Card */}
                  <div className="flex items-center gap-2 font-mono">
                    <Flame
                      className={`w-5 h-5 ${
                        habit.currentStreak > 0
                          ? 'text-amber-400 fill-amber-400 animate-pulse'
                          : 'text-slate-600'
                      }`}
                    />
                    <div>
                      <span className="text-sm font-black text-amber-400 block leading-tight">
                        {habit.currentStreak}d Streak
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        Best: {habit.bestStreak}d
                      </span>
                    </div>
                  </div>

                  {/* Last 7 Days Mini Tracker */}
                  <div className="flex items-center gap-1.5">
                    {last7Days.map((dStr) => {
                      const done = !!habit.logs[dStr];
                      const dObj = new Date(dStr);
                      const isTodayItem = dStr === today;

                      return (
                        <div key={dStr} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500 uppercase">
                            {dObj.toLocaleDateString('en-US', { weekday: 'narrow' })}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-bold ${
                              done
                                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm'
                                : isTodayItem
                                ? 'border-amber-500/50 bg-slate-950 text-slate-500'
                                : 'bg-slate-950 border-slate-800 text-slate-600'
                            }`}
                          >
                            {done ? '✓' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Initialize New Habit</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 90-Minute Unbroken Deep Work"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Cue & Routine
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What trigger prompts this habit?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="daily">Daily (Every Day)</option>
                  <option value="weekdays">Weekdays (Mon - Fri)</option>
                  <option value="weekly">Weekly Target</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
