import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SOUND_TRACKS, SoundTrack } from '../../services/audio';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Headphones,
  Shuffle,
  Heart,
  Sparkles,
  Zap,
  CloudRain,
  Waves,
  Trees,
  Coffee,
  Flame,
  Music,
  Radio,
  Compass,
} from 'lucide-react';

export const FocusMusicModal: React.FC = () => {
  const {
    isMusicModalOpen,
    setMusicModalOpen,
    isAudioPlaying,
    currentTrackId,
    playTrack,
    toggleAudio,
    audioVolume,
    setAudioVolume,
  } = useApp();

  const [favorites, setFavorites] = useState<string[]>(['deep-focus', 'rain', 'lo-fi']);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isMusicModalOpen) return null;

  const currentTrack = SOUND_TRACKS.find((t) => t.id === currentTrackId) || SOUND_TRACKS[0];

  const categories = ['All', ...Array.from(new Set(SOUND_TRACKS.map((t) => t.category)))];

  const filteredTracks = activeCategory === 'All'
    ? SOUND_TRACKS
    : SOUND_TRACKS.filter((t) => t.category === activeCategory);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const currIdx = SOUND_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (currIdx + 1) % SOUND_TRACKS.length;
    playTrack(SOUND_TRACKS[nextIdx].id);
  };

  const handlePrev = () => {
    const currIdx = SOUND_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (currIdx - 1 + SOUND_TRACKS.length) % SOUND_TRACKS.length;
    playTrack(SOUND_TRACKS[prevIdx].id);
  };

  const handleShuffle = () => {
    const otherTracks = SOUND_TRACKS.filter((t) => t.id !== currentTrack.id);
    const randomTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];
    playTrack(randomTrack.id);
  };

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'Waves': return <Waves className="w-5 h-5 text-teal-400" />;
      case 'Trees': return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-indigo-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Music': return <Music className="w-5 h-5 text-purple-400" />;
      case 'Radio': return <Radio className="w-5 h-5 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-yellow-300" />;
      case 'Compass': return <Compass className="w-5 h-5 text-blue-400" />;
      default: return <Headphones className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Lakshya Focus Soundscapes
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Synthesized Audio
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Procedurally generated acoustic environments designed for deep cognitive flow
              </p>
            </div>
          </div>
          <button
            onClick={() => setMusicModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close sound panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category filter */}
        <div className="px-6 py-3 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {filteredTracks.map((track: SoundTrack) => {
            const isCurrent = currentTrack.id === track.id;
            const isPlayingThis = isCurrent && isAudioPlaying;
            const isFav = favorites.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isCurrent) {
                    toggleAudio();
                  } else {
                    playTrack(track.id);
                  }
                }}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform ${
                      isCurrent ? 'bg-amber-500/20 scale-105' : 'bg-slate-800 group-hover:scale-105'
                    }`}
                  >
                    {getTrackIcon(track.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {track.name}
                      </h4>
                      {isCurrent && isAudioPlaying && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{track.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(track.id, e)}
                    className={`p-2 rounded-lg transition-colors ${
                      isFav ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    aria-label="Toggle favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) toggleAudio();
                      else playTrack(track.id);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isPlayingThis
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-slate-700 text-slate-200 group-hover:bg-amber-500 group-hover:text-slate-950'
                    }`}
                    aria-label={isPlayingThis ? 'Pause' : 'Play'}
                  >
                    {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Player Deck */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                {getTrackIcon(currentTrack.icon)}
              </div>
              <div>
                <p className="text-xs font-mono text-amber-400 uppercase tracking-wider">Now Playing</p>
                <h4 className="text-sm font-bold text-white">{currentTrack.name}</h4>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleShuffle}
                className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrev}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={toggleAudio}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all"
                title={isAudioPlaying ? 'Pause' : 'Play'}
              >
                {isAudioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 text-slate-300 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 w-32">
              <button
                onClick={() => setAudioVolume(audioVolume > 0 ? 0 : 0.5)}
                className="text-slate-400 hover:text-white"
              >
                {audioVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioVolume}
                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
