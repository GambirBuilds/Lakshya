import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isDateOverdue, formatDateToYYYYMMDD } from '../../utils/dates';
import { Task } from '../../types';
import {
  AlertTriangle,
  X,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Archive,
  Zap,
} from 'lucide-react';

export const OverdueRecoveryModal: React.FC = () => {
  const {
    isOverdueRecoveryOpen,
    setOverdueRecoveryOpen,
    tasks,
    updateTask,
    toggleTaskCompletion,
    startFocusWithTask,
  } = useApp();

  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'archived' && isDateOverdue(t.dueDate)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [rescheduleDate, setRescheduleDate] = useState('');

  if (!isOverdueRecoveryOpen) return null;

  const currentTask: Task | undefined = overdueTasks[currentIndex];

  const handleNext = () => {
    if (currentIndex < overdueTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setOverdueRecoveryOpen(false);
      setCurrentIndex(0);
    }
  };

  const handleDoNow = () => {
    if (!currentTask) return;
    const today = formatDateToYYYYMMDD(new Date());
    updateTask(currentTask.id, {
      dueDate: today,
      priority: 'urgent',
      quadrant: 'do_now',
      isDailyTop3: true,
    });
    startFocusWithTask(currentTask);
    setOverdueRecoveryOpen(false);
  };

  const handleMoveToTomorrow = () => {
    if (!currentTask) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateTask(currentTask.id, {
      dueDate: formatDateToYYYYMMDD(tomorrow),
    });
    handleNext();
  };

  const handleReschedule = () => {
    if (!currentTask || !rescheduleDate) return;
    updateTask(currentTask.id, {
      dueDate: rescheduleDate,
    });
    setRescheduleDate('');
    handleNext();
  };

  const handleComplete = () => {
    if (!currentTask) return;
    toggleTaskCompletion(currentTask.id);
    handleNext();
  };

  const handleArchive = () => {
    if (!currentTask) return;
    updateTask(currentTask.id, { status: 'archived' });
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Overdue Recovery Protocol</h3>
              <p className="text-[11px] text-slate-400">
                Triage {overdueTasks.length} pending commitments one at a time
              </p>
            </div>
          </div>
          <button
            onClick={() => setOverdueRecoveryOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {overdueTasks.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Clean Slate Achieved!</h4>
            <p className="text-xs text-slate-400 mt-1">You have zero overdue tasks. Outstanding momentum!</p>
            <button
              onClick={() => setOverdueRecoveryOpen(false)}
              className="mt-6 px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        ) : currentTask ? (
          <div className="mt-5 space-y-5">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Task {currentIndex + 1} of {overdueTasks.length}
              </span>
              <span className="font-mono text-rose-400 font-semibold">
                Due date was: {currentTask.dueDate}
              </span>
            </div>

            {/* Task Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold uppercase">
                {currentTask.priority} PRIORITY
              </span>
              <h4 className="text-base font-bold text-white mt-1.5">{currentTask.title}</h4>
              {currentTask.description && (
                <p className="text-xs text-slate-400 mt-1">{currentTask.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span>⏱ Est: {currentTask.estimatedDuration}m</span>
                <span>📂 {currentTask.category}</span>
              </div>
            </div>

            {/* Recovery Actions */}
            <div className="space-y-2">
              <button
                onClick={handleDoNow}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Do Right Now (Lock into Focus Mode)</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleMoveToTomorrow}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Move to Tomorrow</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleReschedule}
                  disabled={!rescheduleDate}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40"
                >
                  Reschedule
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleComplete}
                  className="py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20"
                >
                  Mark Completed
                </button>

                <button
                  onClick={handleArchive}
                  className="py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-medium hover:bg-slate-800"
                >
                  Archive Task
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
