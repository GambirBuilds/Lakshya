import React from 'react';
import { useApp } from '../context/AppContext';
import { CopyCheck, Play, Plus, CheckSquare, Clock, Zap } from 'lucide-react';

export const Templates: React.FC = () => {
  const { templates, applyTemplate } = useApp();

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Workflow Blueprints & Templates</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {templates.length} Templates
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instantiate multi-step, structured workflows with one click
          </p>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold uppercase">
                  {tmpl.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {tmpl.tasks.length} Steps
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-1">{tmpl.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{tmpl.description}</p>

              {/* Task Steps Preview */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                  Standard Pipeline:
                </span>
                {tmpl.tasks.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-200 truncate">{step.title}</span>
                    </div>
                    <span className="text-[10px] text-amber-400/80 font-mono shrink-0 ml-2">
                      ~{step.estimatedDuration}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => applyTemplate(tmpl.id)}
              className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Instantiate Workflow</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
