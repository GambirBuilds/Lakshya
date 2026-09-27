import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JournalEntry, MoodType } from '../types';
import { formatDateToYYYYMMDD } from '../utils/dates';
import { calculateDailyProductivityScore } from '../utils/productivity';
import {
  BookOpen,
  Plus,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Smile,
  X,
} from 'lucide-react';

export const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry, tasks, habits, focusSessions } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('great');
  const [accomplishmentsText, setAccomplishmentsText] = useState('');

  const todayStr = formatDateToYYYYMMDD(new Date());
  const productivity = calculateDailyProductivityScore(tasks, habits, focusSessions);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const accomps = accomplishmentsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addJournalEntry({
      date: todayStr,
      title: title.trim() || `Journal Entry — ${todayStr}`,
      content: content.trim(),
      mood,
      productivityScore: productivity.score,
      focusMinutes: productivity.focusMinutesToday,
      tasksCompleted: productivity.tasksCompletedToday,
      accomplishments: accomps,
    });

    setTitle('');
    setContent('');
    setAccomplishmentsText('');
    setIsModalOpen(false);
  };

  const getMoodEmoji = (m?: MoodType) => {
    switch (m) {
      case 'great': return '😀';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'low': return '😔';
      case 'exhausted': return '😫';
      default: return '🙂';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Productivity Journal</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {journalEntries.length} Reflections
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture cognitive reflections, lessons learned, and celebrate daily progress
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Write Reflection</span>
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {journalEntries.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No journal entries yet</h4>
            <p className="text-xs text-slate-400 mt-1">
              Reflect on your focus sessions, wins, and obstacles to build self-awareness.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
            >
              Write First Entry
            </button>
          </div>
        ) : (
          journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{entry.title}</h3>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {entry.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
                    Score: {entry.productivityScore}%
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-sky-400">
                    {entry.focusMinutes}m Focus
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                    {entry.tasksCompleted} Tasks
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>

              {entry.accomplishments && entry.accomplishments.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
                    Key Wins & Accomplishments:
                  </span>
                  {entry.accomplishments.map((win, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{win}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Write Productivity Journal</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Entry Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Conquered Database Capstone Architecture"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Today's Mindset</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="great">😀 Great — Peak Momentum</option>
                  <option value="good">🙂 Good — Steady Progress</option>
                  <option value="okay">😐 Okay — Neutral Cadence</option>
                  <option value="low">😔 Low — Low Energy</option>
                  <option value="exhausted">😫 Exhausted — Depleted Battery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reflection & Observations
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What breakthroughs happened? What caused friction? What will you calibrate tomorrow?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Accomplishments (One per line)
                </label>
                <textarea
                  rows={2}
                  value={accomplishmentsText}
                  onChange={(e) => setAccomplishmentsText(e.target.value)}
                  placeholder="Finished 3NF diagram&#10;Ran 5km sprint intervals"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
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
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
