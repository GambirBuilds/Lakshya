import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { buildActivityHeatmap, calculateCurrentStreak, HeatmapDay } from '../../utils/streaks';
import { Flame, Calendar } from 'lucide-react';

export const ActivityHeatmap: React.FC = () => {
  const { tasks, habits, focusSessions } = useApp();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  const days = buildActivityHeatmap(tasks, habits, focusSessions, 16);
  const streak = calculateCurrentStreak(tasks, habits, focusSessions);

  // Group into columns of 7 days (weeks)
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColorClass = (level: number) => {
    switch (level) {
      case 1: return 'bg-amber-950/60 border-amber-900/60';
      case 2: return 'bg-amber-700/70 border-amber-600/70';
      case 3: return 'bg-amber-500 border-amber-400';
      case 4: return 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
      default: return 'bg-slate-800/40 border-slate-800/60';
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Productivity Activity Matrix</h3>
            <p className="text-[11px] text-slate-400">Continuous execution heatmap across 16 weeks</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{streak.current} Days Streak (Best: {streak.best}d)</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="inline-flex gap-1.5 min-w-max">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3.5 h-3.5 rounded-sm border cursor-pointer transition-all duration-150 hover:scale-125 ${getColorClass(
                    day.level
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip / Status Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/60 font-mono gap-2">
        <div>
          {hoveredDay ? (
            <span className="text-slate-200">
              <strong className="text-amber-400">{hoveredDay.date}</strong>: {hoveredDay.tasksCompleted} tasks,{' '}
              {hoveredDay.focusMinutes}m focus, {hoveredDay.habitsChecked} habits
            </span>
          ) : (
            <span>Hover over any day node to view full productivity breakdown</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-800/40 border border-slate-800" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-950/60 border border-amber-900" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-700/70 border border-amber-600" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-400" />
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 border border-amber-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
