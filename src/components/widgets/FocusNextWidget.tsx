import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateFocusNextTask } from '../../utils/productivity';
import { Sparkles, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const FocusNextWidget: React.FC = () => {
  const { tasks, startFocusWithTask, setCurrentPage } = useApp();

  const recommendation = calculateFocusNextTask(tasks);

  if (!recommendation) {
    return (
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
        <h4 className="text-sm font-bold text-white">All Clear!</h4>
        <p className="text-xs text-slate-400 mt-1">No active tasks in your queue right now.</p>
        <button
          onClick={() => setCurrentPage('tasks')}
          className="mt-3 text-xs text-amber-400 hover:underline font-semibold"
        >
          Add Tasks in Workspace →
        </button>
      </div>
    );
  }

  const { task, reasons } = recommendation;

  return (
    <div className="relative p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border border-amber-500/30 backdrop-blur-md shadow-lg overflow-hidden flex flex-col justify-between">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono tracking-wider uppercase border border-amber-500/30">
            <Sparkles className="w-3 h-3" />
            FOCUS NEXT RECOMMENDED
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {task.estimatedDuration}m block
          </span>
        </div>

        <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2 mt-1">
          {task.title}
        </h3>

        {/* Why this task? */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] text-amber-300/80 uppercase font-mono font-semibold block mb-1.5">
            Why this task now:
          </span>
          <ul className="space-y-1">
            {reasons.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => startFocusWithTask(task)}
        className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
      >
        <Play className="w-3.5 h-3.5 fill-slate-950 translate-x-0.5" />
        <span>START FOCUS NOW</span>
      </button>
    </div>
  );
};
