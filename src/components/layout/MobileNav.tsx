import React, { useState } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Hourglass,
  Flame,
  Menu,
  Plus,
  X,
  FolderKanban,
  CalendarDays,
  Target,
  Grid2X2,
  Sprout,
  Trophy,
  BarChart3,
  BookOpen,
  Brain,
  Lightbulb,
  StickyNote,
  CopyCheck,
  Sparkles,
  Settings,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, setTaskModalOpen, setSelectedTaskForEdit } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const moreItems: Array<{ id: AppPage; label: string; icon: React.ReactNode }> = [
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals & Roadmap', icon: <Target className="w-5 h-5" /> },
    { id: 'eisenhower', label: 'Eisenhower Matrix', icon: <Grid2X2 className="w-5 h-5" /> },
    { id: 'garden', label: 'Focus Garden', icon: <Sprout className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'braindump', label: 'Brain Dump', icon: <Brain className="w-5 h-5" /> },
    { id: 'ideavault', label: 'Idea Vault', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'notes', label: 'Sticky Notes', icon: <StickyNote className="w-5 h-5" /> },
    { id: 'templates', label: 'Templates', icon: <CopyCheck className="w-5 h-5" /> },
    { id: 'cleanup', label: 'Cleanup Center', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Slide-over menu for "More" */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-base">Lakshya Workspaces</h3>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsMoreMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    currentPage === item.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-amber-400">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentPage === 'dashboard' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('tasks')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentPage === 'tasks' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Tasks</span>
        </button>

        {/* Floating Quick Add */}
        <button
          onClick={() => {
            setSelectedTaskForEdit(null);
            setTaskModalOpen(true);
          }}
          className="-mt-5 w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transform active:scale-95"
          aria-label="Create Task"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setCurrentPage('focus')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentPage === 'focus' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Hourglass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Focus</span>
        </button>

        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            isMoreMenuOpen ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </>
  );
};
