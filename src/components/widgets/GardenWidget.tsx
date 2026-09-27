import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sprout, TreePine, Droplets, ArrowRight } from 'lucide-react';

export const GardenWidget: React.FC = () => {
  const { plants, setCurrentPage, todayFocusMinutes } = useApp();

  const totalTrees = plants.filter((p) => p.stage === 'tree' || p.stage === 'ancient_tree').length;
  const totalMinutes = plants.reduce((acc, curr) => acc + curr.totalMinutes, 0);

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

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">Focus Garden</h3>
            <p className="text-[11px] text-slate-400">Living botanical record of deep work</p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          {totalTrees} Mature Trees
        </span>
      </div>

      {/* Visual Garden Meadow Grid */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-[#07130e] border border-emerald-900/40 mb-3">
        <div className="grid grid-cols-4 gap-2 text-center py-2">
          {plants.slice(0, 4).map((plant) => (
            <div
              key={plant.id}
              className="flex flex-col items-center p-2 rounded-xl bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-400 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-1">{getStageEmoji(plant.stage)}</span>
              <span className="text-[11px] font-bold text-white truncate max-w-full">
                {plant.species}
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">
                {plant.totalMinutes}m
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-emerald-400" />
          <span>Biomass: {totalMinutes}m deep work</span>
        </div>
        <button
          onClick={() => setCurrentPage('garden')}
          className="text-[11px] text-emerald-400 hover:underline font-semibold flex items-center gap-1"
        >
          <span>Open Full Garden</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
