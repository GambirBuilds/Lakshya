import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, CheckCircle2, Gift } from 'lucide-react';

export const DailyChallengesWidget: React.FC = () => {
  const { dailyChallenges, claimChallengeReward } = useApp();

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Daily Challenges</h3>
            <p className="text-[11px] text-slate-400">Resets every 24 hours</p>
          </div>
        </div>
        <span className="text-[10px] text-purple-400 font-mono font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
          Daily Quests
        </span>
      </div>

      <div className="space-y-2.5">
        {dailyChallenges.map((ch) => {
          const progress = Math.min(100, Math.round((ch.current / ch.target) * 100));

          return (
            <div
              key={ch.id}
              className={`p-3 rounded-2xl border transition-all ${
                ch.completed
                  ? 'bg-purple-500/10 border-purple-500/40'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-white">{ch.title}</span>
                <span className="font-mono text-[11px] text-purple-300 font-bold">
                  +{ch.xpReward} XP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">{ch.description}</p>

              {/* Progress and claim */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-amber-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {ch.current}/{ch.target}
                </span>

                {ch.completed && (
                  <button
                    onClick={() => claimChallengeReward(ch.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-amber-400 text-slate-950 text-[10px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Claim</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
