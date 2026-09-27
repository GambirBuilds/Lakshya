import React from 'react';
import { useApp } from '../context/AppContext';
import { isDateOverdue, formatDateToYYYYMMDD } from '../utils/dates';
import {
  Sparkles,
  AlertTriangle,
  Copy,
  CalendarX,
  Archive,
  Trash2,
  CheckCircle2,
  Calendar,
  Check,
} from 'lucide-react';

export const Cleanup: React.FC = () => {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion, addToast } = useApp();

  const now = Date.now();
  const todayStr = formatDateToYYYYMMDD(new Date());

  // 1. Overdue
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'archived' && isDateOverdue(t.dueDate)
  );

  // 2. Duplicate titles
  const titleCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    const norm = t.title.toLowerCase().trim();
    titleCounts[norm] = (titleCounts[norm] || 0) + 1;
  });
  const duplicateTasks = tasks.filter(
    (t) => t.status !== 'completed' && titleCounts[t.title.toLowerCase().trim()] > 1
  );

  // 3. Tasks without deadlines
  const noDeadlineTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'archived' && !t.dueDate
  );

  // 4. Old completed tasks (> 7 days)
  const oldCompleted = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    const diffDays = (now - new Date(t.completedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 7;
  });

  const totalClutter =
    overdueTasks.length + duplicateTasks.length + noDeadlineTasks.length + oldCompleted.length;

  const handleCleanAllCompleted = () => {
    oldCompleted.forEach((t) => updateTask(t.id, { status: 'archived' }));
    addToast({
      type: 'success',
      title: 'Cleanup Executed',
      message: `Archived ${oldCompleted.length} stale completed tasks.`,
    });
  };

  const handleRescheduleAllOverdue = () => {
    overdueTasks.forEach((t) => updateTask(t.id, { dueDate: todayStr }));
    addToast({
      type: 'success',
      title: 'Rescheduled Overdue Tasks',
      message: `Moved ${overdueTasks.length} overdue tasks to Today.`,
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Task Cleanup Center</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                totalClutter > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {totalClutter} Items for Triage
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detect and purge overdue friction, duplicates, missing deadlines, and stale archives
          </p>
        </div>

        {totalClutter > 0 && (
          <div className="flex gap-2">
            {overdueTasks.length > 0 && (
              <button
                onClick={handleRescheduleAllOverdue}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all"
              >
                Reschedule Overdue to Today
              </button>
            )}
            {oldCompleted.length > 0 && (
              <button
                onClick={handleCleanAllCompleted}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Archive Old Completed ({oldCompleted.length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Clutter Category Sections */}
      <div className="space-y-6">
        {/* Section 1: Overdue Tasks */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Overdue Commitments</h3>
                <p className="text-[11px] text-slate-400">Tasks with deadlines that have passed</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-400">
              {overdueTasks.length} Found
            </span>
          </div>

          <div className="space-y-2">
            {overdueTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No overdue tasks detected.</p>
            ) : (
              overdueTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs gap-2"
                >
                  <div>
                    <span className="font-semibold text-white">{t.title}</span>
                    <span className="text-[11px] text-rose-400 font-mono ml-2">
                      Due: {t.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => updateTask(t.id, { dueDate: todayStr })}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-[11px] font-semibold"
                    >
                      Move to Today
                    </button>
                    <button
                      onClick={() => toggleTaskCompletion(t.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateTask(t.id, { status: 'archived' })}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[11px]"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 2: Tasks without Deadlines */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <CalendarX className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Tasks Without Due Dates</h3>
                <p className="text-[11px] text-slate-400">
                  Open items without time bounds tend to linger indefinitely
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {noDeadlineTasks.length} Found
            </span>
          </div>

          <div className="space-y-2">
            {noDeadlineTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">All tasks have scheduled dates.</p>
            ) : (
              noDeadlineTasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-white truncate max-w-[280px]">
                    {t.title}
                  </span>
                  <button
                    onClick={() => updateTask(t.id, { dueDate: todayStr })}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold"
                  >
                    + Set Due Today
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Duplicate Task Titles */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Copy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Potential Duplicate Tasks</h3>
                <p className="text-[11px] text-slate-400">Tasks sharing identical titles</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">
              {duplicateTasks.length} Found
            </span>
          </div>

          <div className="space-y-2">
            {duplicateTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No duplicate titles detected.</p>
            ) : (
              duplicateTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="font-semibold text-white">{t.title}</span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-semibold"
                  >
                    Delete Duplicate
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
