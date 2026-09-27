import React from 'react';
import { useApp } from '../../context/AppContext';
import { MiniPlayer } from '../audio/MiniPlayer';
import { calculateCurrentStreak } from '../../utils/streaks';
import {
  Search,
  Plus,
  Mic,
  Maximize2,
  Flame,
  Zap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPage,
    tasks,
    habits,
    focusSessions,
    setCommandPaletteOpen,
    setTaskModalOpen,
    setSelectedTaskForEdit,
    setVoiceModalOpen,
    setDistractionFree,
  } = useApp();

  const streak = calculateCurrentStreak(tasks, habits, focusSessions);

  const getPageMeta = () => {
    switch (currentPage) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Command center for focus, habits, and daily progress' };
      case 'tasks':
        return { title: 'Task Workspace', subtitle: 'High-leverage tasks organized with structured priorities' };
      case 'projects':
        return { title: 'Projects', subtitle: 'Strategic initiatives with linked milestones and objectives' };
      case 'calendar':
        return { title: 'Calendar & Schedule', subtitle: 'Temporal timeline and scheduled commitments' };
      case 'goals':
        return { title: 'Goals & Roadmap', subtitle: 'Long-term milestones: from ambition to execution' };
      case 'eisenhower':
        return { title: 'Eisenhower Matrix', subtitle: 'Decide priority quadrants: Urgent vs. Important' };
      case 'focus':
        return { title: 'Focus Chamber', subtitle: 'Deep work timer with ambient soundscapes and gamified flow' };
      case 'garden':
        return { title: 'Focus Garden', subtitle: 'Living botanical record of your deep work sessions' };
      case 'habits':
        return { title: 'Habit Matrix', subtitle: 'Build unshakeable daily rituals and maintain streaks' };
      case 'achievements':
        return { title: 'Achievements & Hall of Fame', subtitle: 'Milestone badges, personal records, and honors' };
      case 'analytics':
        return { title: 'Productivity Analytics', subtitle: 'Objective empirical reports on your time and focus' };
      case 'journal':
        return { title: 'Daily Journal', subtitle: 'Evening reflections, mental clarity, and gratitude' };
      case 'braindump':
        return { title: 'Brain Dump Scratchpad', subtitle: 'Capture raw thoughts and convert them into actionable items' };
      case 'ideavault':
        return { title: 'Idea Vault', subtitle: 'Repository for creative apps, startups, and tactical projects' };
      case 'notes':
        return { title: 'Sticky Notes', subtitle: 'Color-coded micro-notes pinned to your workspace' };
      case 'templates':
        return { title: 'Task Templates', subtitle: 'Battle-tested workflow blueprints for instant execution' };
      case 'cleanup':
        return { title: 'Task Cleanup Center', subtitle: 'Sweep overdue, stale, and duplicate clutter' };
      case 'settings':
        return { title: 'System Settings', subtitle: 'Preferences, audio defaults, themes, and data backup' };
      default:
        return { title: 'Lakshya', subtitle: 'Aim. Focus. Achieve.' };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      {/* Page Title */}
      <div className="flex flex-col">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          {meta.title}
        </h2>
        <p className="text-xs text-slate-400 hidden sm:block">{meta.subtitle}</p>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
          <span>Quick find & commands...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Ambient Sound MiniPlayer */}
        <MiniPlayer />

        {/* Streak indicator */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-xs font-bold shadow-sm"
          title={`${streak.current} Day Streak! Best: ${streak.best} Days`}
        >
          <Flame className="w-4 h-4 fill-amber-400 animate-pulse text-amber-400" />
          <span>{streak.current}d</span>
        </div>

        {/* Voice Task Button */}
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all shadow-sm"
          title="Create task via Voice (Web Speech API)"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Distraction Free Mode */}
        <button
          onClick={() => setDistractionFree(true)}
          className="hidden sm:flex p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-all shadow-sm"
          title="Distraction-Free Zen Mode (Ctrl+Shift+F)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Quick Add Task */}
        <button
          onClick={() => {
            setSelectedTaskForEdit(null);
            setTaskModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  );
};
