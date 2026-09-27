import React from 'react';
import { useApp } from '../../context/AppContext';
import { Target, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export const DailyTop3Widget: React.FC = () => {
  const { tasks, toggleTaskCompletion, toggleDailyTop3, setCurrentPage, startFocusWithTask } = useApp();

  const top3 = tasks.filter((t) => t.isDailyTop3);
  const completedCount = top3.filter((t) => t.status === 'completed').length;
  const progressPercent = top3.length > 0 ? Math.round((completedCount / top3.length) * 100) : 0;

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Daily Top 3</h3>
              <p className="text-[11px] text-slate-400">Non-negotiable priorities for today</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {completedCount} / {top3.length} Done
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden mb-4">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top 3 list */}
        <div className="space-y-2">
          {top3.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500">
              <p>No Top 3 selected yet.</p>
              <button
                onClick={() => setCurrentPage('tasks')}
                className="mt-1.5 text-amber-400 hover:underline font-semibold"
              >
                Select from Task Workspace →
              </button>
            </div>
          ) : (
            top3.map((task, idx) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="text-slate-400 hover:text-amber-400 shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {idx + 1}. {task.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {task.estimatedDuration}m • {task.category}
                      </span>
                    </div>
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => startFocusWithTask(task)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500 hover:text-slate-950 transition-all ml-2 shrink-0"
                    >
                      Focus
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
