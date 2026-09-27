import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EisenhowerQuadrant, Task } from '../types';
import {
  Grid2X2,
  Plus,
  Play,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  MoveRight,
} from 'lucide-react';

export const Eisenhower: React.FC = () => {
  const { tasks, toggleTaskCompletion, setTaskQuadrant, startFocusWithTask, createTask } = useApp();
  const [quickTitle, setQuickTitle] = useState('');
  const [targetQuadrant, setTargetQuadrant] = useState<EisenhowerQuadrant>('do_now');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    createTask({
      title: quickTitle.trim(),
      priority: targetQuadrant === 'do_now' ? 'urgent' : targetQuadrant === 'schedule' ? 'high' : 'medium',
      category: 'General',
      tags: ['matrix'],
      estimatedDuration: 30,
      subtasks: [],
      recurrence: 'none',
      status: 'todo',
      quadrant: targetQuadrant,
    });

    setQuickTitle('');
  };

  const quadrants: Array<{
    id: EisenhowerQuadrant;
    title: string;
    subtitle: string;
    accent: string;
    bgStyle: string;
    borderStyle: string;
    tagStyle: string;
  }> = [
    {
      id: 'do_now',
      title: 'Q1: DO NOW',
      subtitle: 'Urgent & Important — Execute immediately',
      accent: '#ef4444',
      bgStyle: 'bg-rose-950/20',
      borderStyle: 'border-rose-500/40',
      tagStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'schedule',
      title: 'Q2: SCHEDULE',
      subtitle: 'Not Urgent but Important — Strategic long-term leverage',
      accent: '#38bdf8',
      bgStyle: 'bg-sky-950/20',
      borderStyle: 'border-sky-500/40',
      tagStyle: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'delegate',
      title: 'Q3: DELEGATE',
      subtitle: 'Urgent but Not Important — Automate, streamline, or hand off',
      accent: '#f59e0b',
      bgStyle: 'bg-amber-950/20',
      borderStyle: 'border-amber-500/40',
      tagStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'eliminate',
      title: 'Q4: ELIMINATE',
      subtitle: 'Not Urgent & Not Important — Busywork and distractions',
      accent: '#64748b',
      bgStyle: 'bg-slate-900/40',
      borderStyle: 'border-slate-800',
      tagStyle: 'bg-slate-800 text-slate-400 border-slate-700',
    },
  ];

  const getQuadrantTasks = (q: EisenhowerQuadrant) => {
    return tasks.filter((t) => (t.quadrant || 'schedule') === q && t.status !== 'completed');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Eisenhower Decision Matrix</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Priority Framework
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Categorize tasks by urgency and importance to eliminate low-value friction
          </p>
        </div>
      </div>

      {/* Quick Add into Quadrant */}
      <form
        onSubmit={handleQuickAdd}
        className="flex flex-col sm:flex-row items-center gap-2.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md"
      >
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Quick Matrix Dispatch:
        </span>
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Type task title..."
          className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <select
          value={targetQuadrant}
          onChange={(e) => setTargetQuadrant(e.target.value as EisenhowerQuadrant)}
          className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="do_now">Q1: Do Now</option>
          <option value="schedule">Q2: Schedule</option>
          <option value="delegate">Q3: Delegate</option>
          <option value="eliminate">Q4: Eliminate</option>
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          Add to Quadrant
        </button>
      </form>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrants.map((q) => {
          const qTasks = getQuadrantTasks(q.id);

          return (
            <div
              key={q.id}
              className={`p-5 rounded-3xl border backdrop-blur-md shadow-lg flex flex-col justify-between min-h-[340px] ${q.bgStyle} ${q.borderStyle}`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: q.accent }} />
                      {q.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{q.subtitle}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${q.tagStyle}`}
                  >
                    {qTasks.length} Tasks
                  </span>
                </div>

                {/* Tasks in Quadrant */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {qTasks.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-500 italic">
                      No active tasks in this quadrant.
                    </div>
                  ) : (
                    qTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between group text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="text-slate-500 hover:text-amber-400 shrink-0"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-white truncate block">
                              {task.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Est: {task.estimatedDuration}m • {task.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => startFocusWithTask(task)}
                            className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          >
                            Focus
                          </button>

                          {/* Move to another quadrant selector */}
                          <select
                            value={task.quadrant}
                            onChange={(e) =>
                              setTaskQuadrant(task.id, e.target.value as EisenhowerQuadrant)
                            }
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-400 focus:outline-none"
                            title="Move quadrant"
                          >
                            <option value="do_now">Q1</option>
                            <option value="schedule">Q2</option>
                            <option value="delegate">Q3</option>
                            <option value="eliminate">Q4</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
