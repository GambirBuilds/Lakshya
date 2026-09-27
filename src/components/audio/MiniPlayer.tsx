import React from 'react';
import { useApp } from '../../context/AppContext';
import { SOUND_TRACKS } from '../../services/audio';
import { Play, Pause, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    isAudioPlaying,
    currentTrackId,
    toggleAudio,
    playTrack,
    audioVolume,
    setAudioVolume,
    setMusicModalOpen,
  } = useApp();

  const currentTrack = SOUND_TRACKS.find((t) => t.id === currentTrackId) || SOUND_TRACKS[0];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = SOUND_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (currIdx + 1) % SOUND_TRACKS.length;
    playTrack(SOUND_TRACKS[nextIdx].id);
  };

  const handleVolumeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAudioVolume(audioVolume > 0 ? 0 : 0.5);
  };

  return (
    <div
      onClick={() => setMusicModalOpen(true)}
      className="cursor-pointer group flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 backdrop-blur-md shadow-md transition-all duration-200"
      title="Click to open Focus Soundscape & Music"
    >
      <div className="relative flex items-center justify-center">
        <Disc3
          className={`w-5 h-5 text-amber-400 transition-transform ${
            isAudioPlaying ? 'animate-spin' : 'group-hover:rotate-45'
          }`}
          style={{ animationDuration: '4s' }}
        />
        {isAudioPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
        )}
      </div>

      <div className="hidden sm:flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
          {currentTrack.name}
        </span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
          {currentTrack.category}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleAudio();
          }}
          className="p-1 rounded-full text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          aria-label={isAudioPlaying ? 'Pause sound' : 'Play sound'}
        >
          {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleNext}
          className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Next sound"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleVolumeToggle}
          className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden md:block"
          aria-label="Toggle mute"
        >
          {audioVolume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
