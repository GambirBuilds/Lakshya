import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Zap,
  Calendar,
  PieChart,
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { tasks, habits, focusSessions, xp, personalBests } = useApp();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const now = new Date();
  const daysLimit = timeRange === 'week' ? 7 : 30;

  // Filter tasks completed in time range
  const completedInPeriod = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    const diff = (now.getTime() - new Date(t.completedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= daysLimit;
  });

  // Filter focus sessions in time range
  const sessionsInPeriod = focusSessions.filter((s) => {
    const diff = (now.getTime() - new Date(s.completedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= daysLimit;
  });

  const totalFocusMins = sessionsInPeriod.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    const cat = t.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Estimated vs actual
  let totalEstimated = 0;
  let totalActual = 0;
  tasks.forEach((t) => {
    totalEstimated += t.estimatedDuration || 0;
    totalActual += t.actualDuration || 0;
  });

  // Day of week distribution for completed tasks
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  completedInPeriod.forEach((t) => {
    if (t.completedAt) {
      const d = new Date(t.completedAt).getDay();
      weekdayCounts[d] += 1;
    }
  });

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxDayCount = Math.max(1, ...weekdayCounts);
  const bestDayIdx = weekdayCounts.indexOf(Math.max(...weekdayCounts));
  const mostProductiveDay = weekdayNames[bestDayIdx];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Productivity Analytics & Reports</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              Empirical Real Data
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Grounded metrics calculated directly from your stored task, focus, and habit activity
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'week' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 'month' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
          <span className="text-xs text-slate-400 font-mono block">TASKS CONQUERED</span>
          <span className="text-3xl font-black text-white font-mono mt-1 block">
            {completedInPeriod.length}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            in last {daysLimit} days
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <Clock className="w-5 h-5 text-sky-400 mb-2" />
          <span className="text-xs text-slate-400 font-mono block">DEEP WORK FOCUS</span>
          <span className="text-3xl font-black text-white font-mono mt-1 block">
            {totalFocusMins}m
          </span>
          <span className="text-[10px] text-sky-400 font-mono mt-1 block">
            {sessionsInPeriod.length} dedicated sessions
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <TrendingUp className="w-5 h-5 text-amber-400 mb-2" />
          <span className="text-xs text-slate-400 font-mono block">PEAK OUTPUT DAY</span>
          <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">
            {mostProductiveDay}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            highest task execution
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
          <Zap className="w-5 h-5 text-purple-400 mb-2" />
          <span className="text-xs text-slate-400 font-mono block">TOTAL ACCUMULATED XP</span>
          <span className="text-3xl font-black text-purple-400 font-mono mt-1 block">
            {xp}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            all-time momentum points
          </span>
        </div>
      </div>

      {/* Charts Grid: Weekly distribution & Estimated vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Execution Volume Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Day-of-Week Output Cadence
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Distribution of completed deliverables across days of the week
            </p>

            <div className="flex items-end justify-between gap-3 h-44 pt-4 px-2">
              {weekdayNames.map((name, i) => {
                const count = weekdayCounts[i];
                const heightPct = Math.max(12, Math.round((count / maxDayCount) * 100));
                const isMax = count === maxDayCount && count > 0;

                return (
                  <div key={name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono font-bold text-slate-300">
                      {count}
                    </span>
                    <div className="w-full bg-slate-800/60 rounded-xl overflow-hidden flex flex-col justify-end h-28">
                      <div
                        className={`w-full rounded-xl transition-all duration-700 ${
                          isMax
                            ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-md shadow-amber-500/20'
                            : 'bg-slate-700'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-mono uppercase ${
                        isMax ? 'text-amber-400 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature 32: Estimated vs Actual Time Tracking Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Estimation Accuracy & Time Spent
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Comparison between estimated duration and actual logged focus duration
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Planned Estimate</span>
                  <span className="text-sky-400 font-bold">{totalEstimated} mins</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-sky-500 h-3 rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Actual Logged Focus</span>
                  <span className="text-amber-400 font-bold">{totalActual} mins</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-amber-400 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${totalEstimated > 0 ? Math.min(100, Math.round((totalActual / totalEstimated) * 100)) : 50}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mt-4 space-y-1">
                <p className="font-semibold text-white">Estimation Variance Insight:</p>
                <p>
                  {totalActual <= totalEstimated
                    ? 'You are executing tasks well within your estimated parameters. Strong discipline!'
                    : 'Actual time exceeds planned estimates. Consider adding 15-20% buffer to complex tasks.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-400" />
          Task Domain Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const pct = Math.round((count / Math.max(1, tasks.length)) * 100);
            return (
              <div key={cat} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-white block truncate">{cat}</span>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-xl font-black text-amber-400">{count}</span>
                  <span className="text-[10px] text-slate-400">tasks ({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
