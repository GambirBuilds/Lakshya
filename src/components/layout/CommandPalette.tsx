import React, { useState, useEffect, useRef } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  Search,
  CheckSquare,
  FolderKanban,
  Target,
  Hourglass,
  BookOpen,
  Brain,
  Lightbulb,
  StickyNote,
  Settings,
  Plus,
  Moon,
  Sun,
  Flame,
  X,
  Volume2,
  Sparkles,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentPage,
    tasks,
    projects,
    goals,
    ideas,
    stickyNotes,
    habits,
    setTaskModalOpen,
    setSelectedTaskForEdit,
    setMusicModalOpen,
    settings,
    updateSettings,
    startFocusWithTask,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Build searchable items
  interface CommandItem {
    id: string;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    category: 'Actions' | 'Navigation' | 'Tasks' | 'Projects' | 'Goals' | 'Ideas' | 'Notes';
    action: () => void;
  }

  const items: CommandItem[] = [
    // Core Actions
    {
      id: 'act-new-task',
      title: 'Create New Task',
      subtitle: 'Add a new action item or checklist',
      icon: <Plus className="w-4 h-4 text-amber-400" />,
      category: 'Actions',
      action: () => {
        setSelectedTaskForEdit(null);
        setTaskModalOpen(true);
      },
    },
    {
      id: 'act-start-focus',
      title: 'Start Focus Session',
      subtitle: 'Enter deep work chamber with Pomodoro timer',
      icon: <Hourglass className="w-4 h-4 text-sky-400" />,
      category: 'Actions',
      action: () => setCurrentPage('focus'),
    },
    {
      id: 'act-music',
      title: 'Open Focus Soundscapes',
      subtitle: 'Procedural Lo-Fi, Rain, Ocean, and Ambient Drones',
      icon: <Volume2 className="w-4 h-4 text-purple-400" />,
      category: 'Actions',
      action: () => setMusicModalOpen(true),
    },
    {
      id: 'act-toggle-theme',
      title: `Switch to ${settings.themeMode === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle application contrast palette',
      icon: settings.themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      category: 'Actions',
      action: () => updateSettings({ themeMode: settings.themeMode === 'dark' ? 'light' : 'dark' }),
    },

    // Navigation Pages
    { id: 'nav-dash', title: 'Open Dashboard', icon: <CheckSquare className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('dashboard') },
    { id: 'nav-tasks', title: 'Open Tasks Workspace', icon: <CheckSquare className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('tasks') },
    { id: 'nav-projects', title: 'Open Projects', icon: <FolderKanban className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('projects') },
    { id: 'nav-goals', title: 'Open Goals & Roadmap', icon: <Target className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('goals') },
    { id: 'nav-habits', title: 'Open Habit Matrix', icon: <Flame className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('habits') },
    { id: 'nav-journal', title: 'Open Journal', icon: <BookOpen className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('journal') },
    { id: 'nav-brain', title: 'Open Brain Dump', icon: <Brain className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('braindump') },
    { id: 'nav-vault', title: 'Open Idea Vault', icon: <Lightbulb className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('ideavault') },
    { id: 'nav-notes', title: 'Open Sticky Notes', icon: <StickyNote className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('notes') },
    { id: 'nav-cleanup', title: 'Open Cleanup Center', icon: <Sparkles className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('cleanup') },
    { id: 'nav-settings', title: 'Open Settings', icon: <Settings className="w-4 h-4" />, category: 'Navigation', action: () => setCurrentPage('settings') },

    // Tasks search
    ...tasks.slice(0, 15).map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      subtitle: `Task • Priority: ${t.priority.toUpperCase()} • Status: ${t.status}`,
      icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
      category: 'Tasks' as const,
      action: () => startFocusWithTask(t),
    })),

    // Projects search
    ...projects.map((p) => ({
      id: `proj-${p.id}`,
      title: p.name,
      subtitle: `Project • ${p.description}`,
      icon: <FolderKanban className="w-4 h-4 text-amber-400" />,
      category: 'Projects' as const,
      action: () => setCurrentPage('projects'),
    })),

    // Goals search
    ...goals.map((g) => ({
      id: `goal-${g.id}`,
      title: g.title,
      subtitle: `Goal • ${g.category}`,
      icon: <Target className="w-4 h-4 text-rose-400" />,
      category: 'Goals' as const,
      action: () => setCurrentPage('goals'),
    })),

    // Ideas search
    ...ideas.map((i) => ({
      id: `idea-${i.id}`,
      title: i.title,
      subtitle: `Idea • ${i.category} [${i.status}]`,
      icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
      category: 'Ideas' as const,
      action: () => setCurrentPage('ideavault'),
    })),

    // Notes search
    ...stickyNotes.map((n) => ({
      id: `note-${n.id}`,
      title: n.title,
      subtitle: `Note • ${n.content.slice(0, 40)}...`,
      icon: <StickyNote className="w-4 h-4 text-sky-400" />,
      category: 'Notes' as const,
      action: () => setCurrentPage('notes'),
    })),
  ];

  const filteredItems = query.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : items.slice(0, 14);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, page, task, goal, or idea..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching commands or items found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{item.title}</p>
                      {item.subtitle && <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 ml-2">
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-amber-400 font-bold">Lakshya</span>
        </div>
      </div>
    </div>
  );
};
