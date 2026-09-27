import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModalInfo, setLevelUpModalInfo } = useApp();

  if (!levelUpModalInfo || !levelUpModalInfo.show) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-5 animate-bounce">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Ascension Achieved
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight">Level Up!</h2>
          <p className="text-xl font-bold text-amber-400 mt-1">
            Level {levelUpModalInfo.level} — {levelUpModalInfo.title}
          </p>

          <p className="text-slate-400 text-sm mt-3 max-w-xs leading-relaxed">
            Your persistence has deepened. You have unlocked elevated focus endurance and new rank honors in Lakshya.
          </p>

          <button
            onClick={() => setLevelUpModalInfo(null)}
            className="mt-8 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Continue Aiming</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
