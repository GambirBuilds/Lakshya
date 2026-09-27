import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  Hourglass,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const Achievements: React.FC = () => {
  const { achievements, personalBests, levelInfo, xp } = useApp();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Hall of Fame & Records</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
              {unlockedCount}/{achievements.length} Badges Unlocked
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track your personal productivity milestones, mastery rank, and records
          </p>
        </div>
      </div>

      {/* Level Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 shrink-0">
            {levelInfo.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Rank: {levelInfo.title} Productive
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                Tier {levelInfo.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total Accumulated Momentum: <strong className="text-amber-400">{xp} XP</strong>
            </p>
          </div>
        </div>

        <div className="w-full md:w-64">
          <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
            <span>Next Level Progress</span>
            <span className="text-amber-400 font-bold">{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1.5 block text-right">
            {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP in tier
          </span>
        </div>
      </div>

      {/* Feature 31: Personal Bests Showcase */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Personal Records & All-Time Highs
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Flame className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Longest Momentum Streak
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.longestStreak} Days
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Hourglass className="w-6 h-6 text-sky-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Longest Single Focus Block
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.longestFocusSessionMinutes} Mins
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Most Tasks Conquered (1 Day)
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.mostTasksInOneDay} Tasks
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <TrendingUp className="w-6 h-6 text-teal-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Max Focus Time in 1 Day
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.mostFocusTimeInOneDayMinutes} Mins
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Most XP Earned in 1 Day
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.mostXpInOneDay} XP
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Best Weekly Productivity Score
            </span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              {personalBests.mostProductiveWeekScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Achievement Badges Grid */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-purple-400" />
          Achievement Badges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border backdrop-blur-md flex items-center justify-between gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-slate-900/80 border-amber-500/40 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {ach.unlocked ? <Sparkles className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{ach.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                  {ach.unlockedAt && (
                    <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">
                      Unlocked on {ach.unlockedAt.split('T')[0]}
                    </span>
                  )}
                </div>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold shrink-0 ${
                  ach.unlocked
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {ach.unlocked ? 'CLAIMED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
