import React, { useState } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  CalendarDays,
  Target,
  Grid2X2,
  Hourglass,
  Sprout,
  Flame,
  Trophy,
  BarChart3,
  BookOpen,
  Brain,
  Lightbulb,
  StickyNote,
  CopyCheck,
  Sparkles,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    tasks,
    habits,
    levelInfo,
    xp,
    setMorningModalOpen,
    setNightModalOpen,
    setKeyboardHelpOpen,
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const activeHabitsCount = habits.length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, badge: pendingTasksCount },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals & Roadmap', icon: <Target className="w-4 h-4" /> },
    { id: 'eisenhower', label: 'Eisenhower Matrix', icon: <Grid2X2 className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus Mode', icon: <Hourglass className="w-4 h-4" /> },
    { id: 'garden', label: 'Focus Garden', icon: <Sprout className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Flame className="w-4 h-4" />, badge: activeHabitsCount },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'braindump', label: 'Brain Dump', icon: <Brain className="w-4 h-4" /> },
    { id: 'ideavault', label: 'Idea Vault', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'notes', label: 'Sticky Notes', icon: <StickyNote className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <CopyCheck className="w-4 h-4" /> },
    { id: 'cleanup', label: 'Cleanup Center', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl h-screen sticky top-0 transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/60">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-md shadow-amber-500/20">
              L
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Lakshya
              </h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase font-mono">
                Aim. Focus. Achieve.
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-md shadow-amber-500/20">
            L
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800/60 transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Daily Rituals Buttons */}
      <div className="px-3 pt-3 pb-2 flex gap-1.5 border-b border-slate-800/40">
        <button
          onClick={() => setMorningModalOpen(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all ${
            isCollapsed ? 'p-2' : ''
          }`}
          title="Start Morning Mode"
        >
          <Sun className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Morning</span>}
        </button>

        <button
          onClick={() => setNightModalOpen(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all ${
            isCollapsed ? 'p-2' : ''
          }`}
          title="Daily Night Shutdown Review"
        >
          <Moon className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Shutdown</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              } ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Rank Card */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-950/50">
        {!isCollapsed ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
                  {levelInfo.level}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">
                    Gambir Jung Karki
                  </p>
                  <p className="text-[10px] text-amber-400 font-mono">
                    Lvl {levelInfo.level} • {levelInfo.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setKeyboardHelpOpen(true)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                title="Keyboard Shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
            {/* XP Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
              <span>{xp} XP</span>
              <span>{levelInfo.progressPercent}% to next</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400" title={`Level ${levelInfo.level}: ${levelInfo.title} (${xp} XP)`}>
              {levelInfo.level}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
