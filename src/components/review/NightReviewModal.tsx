import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateDailyProductivityScore } from '../../utils/productivity';
import { formatDateToYYYYMMDD } from '../../utils/dates';
import { Task } from '../../types';
import {
  Moon,
  X,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ArrowRight,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const NightReviewModal: React.FC = () => {
  const {
    isNightModalOpen,
    setNightModalOpen,
    tasks,
    habits,
    focusSessions,
    xp,
    saveDailyReview,
    updateTask,
  } = useApp();

  const [reflection, setReflection] = useState('');
  const [tomorrowFocus, setTomorrowFocus] = useState('');

  if (!isNightModalOpen) return null;

  const todayStr = formatDateToYYYYMMDD(new Date());

  const productivity = calculateDailyProductivityScore(tasks, habits, focusSessions);

  // Unfinished tasks for today
  const unfinishedTasks = tasks.filter(
    (t) => (t.status === 'todo' || t.status === 'in_progress') && t.dueDate === todayStr
  );

  const completedToday = tasks.filter(
    (t) => t.status === 'completed' && t.completedAt && t.completedAt.startsWith(todayStr)
  );

  const handleMoveToTomorrow = (taskId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateTask(taskId, { dueDate: formatDateToYYYYMMDD(tomorrow) });
  };

  const handleArchiveTask = (taskId: string) => {
    updateTask(taskId, { status: 'archived' });
  };

  const handleFinishShutdown = () => {
    const habitDoneCount = habits.filter((h) => !!h.logs[todayStr]).length;
    const habitRate = habits.length > 0 ? Math.round((habitDoneCount / habits.length) * 100) : 100;

    saveDailyReview({
      date: todayStr,
      tasksCompletedCount: completedToday.length,
      focusTimeMinutes: productivity.focusMinutesToday,
      habitCompletionRate: habitRate,
      productivityScore: productivity.score,
      xpEarned: completedToday.length * 30 + Math.round(productivity.focusMinutesToday * 1.5),
      reflection: reflection.trim() || 'Consistent effort invested across high leverage priorities.',
      tomorrowFocus: tomorrowFocus.trim() || 'Execute morning priorities without delay.',
    });

    setNightModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          onClick={() => setNightModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Daily Shutdown & Evening Review
            </h3>
            <p className="text-xs text-indigo-300 font-mono">
              Close open cognitive loops and restore mental peace
            </p>
          </div>
        </div>

        {/* Today's Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
              Productivity
            </span>
            <span className="text-2xl font-black text-amber-400">{productivity.score}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
              Completed Tasks
            </span>
            <span className="text-2xl font-black text-emerald-400">{completedToday.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
              Focus Time
            </span>
            <span className="text-2xl font-black text-sky-400">{productivity.focusMinutesToday}m</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
              Total XP
            </span>
            <span className="text-2xl font-black text-purple-400">{xp}</span>
          </div>
        </div>

        {/* Unfinished Tasks Triage */}
        {unfinishedTasks.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
            <h4 className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Unfinished Today ({unfinishedTasks.length}) — Triage for Tomorrow
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Clear your mind before rest. Move them forward so tomorrow is already arranged.
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {unfinishedTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className="text-slate-200 truncate max-w-[240px]">{t.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToTomorrow(t.id)}
                      className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-semibold"
                    >
                      → Tomorrow
                    </button>
                    <button
                      onClick={() => handleArchiveTask(t.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px]"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reflection & Tomorrow's Intent */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Evening Reflection / What went well today?
            </label>
            <textarea
              rows={2}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g., Kept deep focus during the database assignment; interval training restored my energy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Tomorrow's Primary Lakshya (Single Most Important Focus)
            </label>
            <input
              type="text"
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              placeholder="e.g., Deliver full-stack evaluation project to Prashant Bhattarai Sir"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Complete Shutdown Button */}
        <button
          onClick={handleFinishShutdown}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>COMPLETE DAILY SHUTDOWN</span>
        </button>
      </div>
    </div>
  );
};
