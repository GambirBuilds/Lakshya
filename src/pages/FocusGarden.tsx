import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, TreePine, Droplets, Sun, Sparkles, ArrowRight, Play } from 'lucide-react';

export const FocusGarden: React.FC = () => {
  const { plants, todayFocusMinutes, focusSessions, setCurrentPage } = useApp();

  const totalTrees = plants.filter((p) => p.stage === 'tree' || p.stage === 'ancient_tree').length;
  const totalBiomassMinutes = plants.reduce((sum, p) => sum + p.totalMinutes, 0);

  const getStageEmoji = (stage: string) => {
    switch (stage) {
      case 'ancient_tree': return '🌳';
      case 'tree': return '🌲';
      case 'sapling': return '🌿';
      case 'plant': return '🪴';
      case 'flower': return '🌸';
      case 'sprout': return '🌱';
      default: return '🌰';
    }
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'ancient_tree': return 'Ancient Master Tree (200m+)';
      case 'tree': return 'Mature Canopy (120m+)';
      case 'sapling': return 'Young Sapling (60m+)';
      case 'plant': return 'Flourishing Bush (35m+)';
      case 'flower': return 'Blooming Flower (25m+)';
      case 'sprout': return 'Early Sprout (15m+)';
      default: return 'Fresh Seedling (0m)';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Focus Botanical Garden</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Biomass Arboretum
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Focus sessions transform into living organic foliage: Seeds → Plants → Ancient Trees
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('focus')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 self-start sm:self-auto transition-all transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Water Garden via Focus</span>
        </button>
      </div>

      {/* Arboretum Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TreePine className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Mature Trees</span>
            <h4 className="text-2xl font-black text-white font-mono mt-0.5">{totalTrees} Trees</h4>
            <span className="text-[10px] text-emerald-400 font-mono">Full canopy achieved</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Hydrated Biomass</span>
            <h4 className="text-2xl font-black text-white font-mono mt-0.5">{totalBiomassMinutes}m</h4>
            <span className="text-[10px] text-teal-400 font-mono">Minutes converted to sap</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Today's Solar Absorption</span>
            <h4 className="text-2xl font-black text-white font-mono mt-0.5">{todayFocusMinutes}m</h4>
            <span className="text-[10px] text-amber-400 font-mono">Sunlight absorbed today</span>
          </div>
        </div>
      </div>

      {/* Main Sanctuary Meadow Canvas */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-950 via-[#07130e] to-slate-950 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Sanctuary Meadow
            </span>
            <h3 className="text-xl font-bold text-white mt-2">Active Specimen Canopy</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Each 25m Focus Block waters your garden
          </span>
        </div>

        {/* Specimen Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {plants.map((p) => {
            const pct = Math.min(100, Math.round((p.totalMinutes / 200) * 100));

            return (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md hover:border-emerald-400/60 transition-all duration-300 hover:scale-105 flex flex-col items-center text-center shadow-lg group"
              >
                {/* Visual Avatar */}
                <div className="w-20 h-20 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-4xl mb-3 shadow-inner group-hover:rotate-6 transition-transform">
                  {getStageEmoji(p.stage)}
                </div>

                <h4 className="text-sm font-bold text-white">{p.species}</h4>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5 capitalize">
                  {p.stage.replace('_', ' ')}
                </p>

                {/* Progress bar to ancient tree */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden my-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between w-full text-[10px] text-slate-400 font-mono">
                  <span>{p.sessionCount} Sessions</span>
                  <span>{p.totalMinutes}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evolution Stages Guide */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Botanical Evolution Protocol
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { stage: 'seed', emoji: '🌰', req: '0 - 15m' },
            { stage: 'sprout', emoji: '🌱', req: '15 - 35m' },
            { stage: 'plant', emoji: '🪴', req: '35 - 60m' },
            { stage: 'sapling', emoji: '🌿', req: '60 - 120m' },
            { stage: 'tree', emoji: '🌲', req: '120 - 200m' },
            { stage: 'ancient_tree', emoji: '🌳', req: '200m+' },
          ].map((item) => (
            <div
              key={item.stage}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center"
            >
              <span className="text-2xl block mb-1">{item.emoji}</span>
              <span className="text-xs font-bold text-white capitalize block">
                {item.stage.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                {item.req}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
