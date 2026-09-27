import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getGreeting } from '../utils/dates';
import { calculateDailyProductivityScore } from '../utils/productivity';
import { calculateCurrentStreak } from '../utils/streaks';
import { isDateOverdue } from '../utils/dates';
import { DailyTop3Widget } from '../components/widgets/DailyTop3Widget';
import { FocusNextWidget } from '../components/widgets/FocusNextWidget';
import { DailyChallengesWidget } from '../components/widgets/DailyChallengesWidget';
import { ActivityHeatmap } from '../components/widgets/ActivityHeatmap';
import { WorldClockWidget } from '../components/widgets/WorldClockWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { StickyNotesWidget } from '../components/widgets/StickyNotesWidget';
import { GardenWidget } from '../components/widgets/GardenWidget';
import {
  Flame,
  Zap,
  Target,
  Clock,
  Sparkles,
  SlidersHorizontal,
  AlertTriangle,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  X,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    tasks,
    habits,
    focusSessions,
    xp,
    levelInfo,
    setMorningModalOpen,
    setNightModalOpen,
    setOverdueRecoveryOpen,
    setCurrentPage,
  } = useApp();

  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const productivity = calculateDailyProductivityScore(tasks, habits, focusSessions);
  const streak = calculateCurrentStreak(tasks, habits, focusSessions);

  const overdueCount = tasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'archived' && isDateOverdue(t.dueDate)
  ).length;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleWidget = (key: keyof typeof settings.dashboardWidgets) => {
    updateSettings({
      dashboardWidgets: {
        ...settings.dashboardWidgets,
        [key]: !settings.dashboardWidgets[key],
      },
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Overdue Recovery Banner (if any overdue) */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Attention Required: {overdueCount} Overdue {overdueCount === 1 ? 'Task' : 'Tasks'}
              </h4>
              <p className="text-xs text-rose-300/80">
                Clear cognitive bottlenecks with one-by-one Overdue Recovery Mode.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOverdueRecoveryOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-md"
          >
            <span>Launch Recovery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Welcome & Day Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/80 backdrop-blur-xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2 font-mono">
            {todayDate}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting(settings.userName)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            "Aim with intent. Focus without friction. Achieve with consistency."
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setMorningModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all shadow-sm"
          >
            <Sun className="w-4 h-4" />
            <span>Morning Protocol</span>
          </button>

          <button
            onClick={() => setNightModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold transition-all shadow-sm"
          >
            <Moon className="w-4 h-4" />
            <span>Daily Shutdown</span>
          </button>

          <button
            onClick={() => setIsCustomizeOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Customize Dashboard Widgets"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Key Metrics Bar */}
      {settings.dashboardWidgets.productivityStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Productivity Score */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Productivity Score</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {productivity.score}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {productivity.tasksCompletedToday} tasks • {productivity.focusMinutesToday}m focus
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 2: Current Streak */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Momentum Streak</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {streak.current}
                </span>
                <span className="text-xs text-slate-500 font-bold">Days</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Personal record: {streak.best} consecutive days
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Metric 3: Today's Deep Work */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Focus Time Today</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
                  {productivity.focusMinutesToday}
                </span>
                <span className="text-xs text-slate-500 font-bold">Mins</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target: {settings.workDuration * 3} mins
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Metric 4: Gamification Level & XP */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">
                Level {levelInfo.level} • {levelInfo.title}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                  {xp}
                </span>
                <span className="text-xs text-slate-500 font-bold">XP</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {levelInfo.progressPercent}% toward next tier
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Daily Top 3 & Focus Next */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {settings.dashboardWidgets.dailyTop3 && <DailyTop3Widget />}
        {settings.dashboardWidgets.focusNext && <FocusNextWidget />}
      </div>

      {/* Row 2: Daily Challenges & Focus Garden */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {settings.dashboardWidgets.dailyChallenges && <DailyChallengesWidget />}
        {settings.dashboardWidgets.focusGarden && <GardenWidget />}
      </div>

      {/* Row 3: Activity Heatmap */}
      {settings.dashboardWidgets.activityHeatmap && <ActivityHeatmap />}

      {/* Row 4: Chronometer, Weather, Sticky Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settings.dashboardWidgets.worldClock && <WorldClockWidget />}
        {settings.dashboardWidgets.weather && <WeatherWidget />}
        {settings.dashboardWidgets.stickyNotes && <StickyNotesWidget />}
      </div>

      {/* Customize Dashboard Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-base">Customize Workspace</h3>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2">
              {[
                { key: 'dailyTop3' as const, label: 'Daily Top 3 Priorities' },
                { key: 'focusNext' as const, label: 'Focus Next Recommendation' },
                { key: 'productivityStats' as const, label: 'Key Metrics Scorecard' },
                { key: 'activityHeatmap' as const, label: 'Activity Contribution Heatmap' },
                { key: 'focusGarden' as const, label: 'Focus Botanical Garden' },
                { key: 'dailyChallenges' as const, label: 'Daily Challenges Quests' },
                { key: 'worldClock' as const, label: 'World Chronometer' },
                { key: 'weather' as const, label: 'Meteorology Weather Feed' },
                { key: 'stickyNotes' as const, label: 'Pinned Sticky Notes' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs"
                >
                  <span className="font-semibold text-slate-200">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={settings.dashboardWidgets[item.key]}
                    onChange={() => toggleWidget(item.key)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => setIsCustomizeOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
            >
              Done Customizing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
