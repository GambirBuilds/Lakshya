import React from 'react';
import { useApp } from '../../context/AppContext';
import { Keyboard, X } from 'lucide-react';

export const KeyboardHelpModal: React.FC = () => {
  const { isKeyboardHelpOpen, setKeyboardHelpOpen } = useApp();

  if (!isKeyboardHelpOpen) return null;

  const shortcuts = [
    { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette & Global Search' },
    { key: 'N', desc: 'Create a New Task' },
    { key: 'F', desc: 'Jump to Focus Mode & Pomodoro Chamber' },
    { key: 'T', desc: 'Jump to Today (Dashboard)' },
    { key: 'R', desc: 'Open Daily Shutdown & Night Review' },
    { key: 'M', desc: 'Toggle / Open Focus Soundscapes & Music' },
    { key: 'Ctrl + Shift + F', desc: 'Toggle Distraction-Free Zen Fullscreen' },
    { key: '?', desc: 'Toggle this Keyboard Shortcuts cheat-sheet' },
    { key: 'Esc', desc: 'Close any active modal or command palette' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setKeyboardHelpOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/40 border border-slate-800/80"
            >
              <span className="text-xs text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono font-bold text-amber-400 border border-slate-700 shadow-sm shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          Shortcuts are safely ignored while typing in text inputs and notes.
        </p>
      </div>
    </div>
  );
};
