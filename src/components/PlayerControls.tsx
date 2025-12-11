import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  List,
  Type,
} from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { formatTime } from '@/utils/audioUtils';
import { SubtitleInsertZone } from './SubtitleInsertZone';
import { CoverImageInsert } from './CoverImageInsert';

export function PlayerControls() {
  const {
    playerState,
    subtitleOffset,
    subtitleMode,
    setVolume,
    toggleMute,
    setLoop,
    toggleShuffle,
    setPlaybackRate,
    adjustSubtitleOffset,
    toggleSubtitleMode,
    nextTrack,
    previousTrack,
    setIsPlaying,
    setCurrentTime,
  } = usePlayerStore();

  const togglePlay = () => {
    setIsPlaying(!playerState.isPlaying);
  };

  const seek = (time: number) => {
    // Access the global audio element
    const audio = (window as any).__audioElement as HTMLAudioElement;
    if (audio) {
      audio.currentTime = time;
    }
    setCurrentTime(time);
  };

  const rewind5 = () => {
    const newTime = Math.max(0, playerState.currentTime - 5);
    seek(newTime);
  };

  const forward5 = () => {
    const newTime = Math.min(playerState.duration, playerState.currentTime + 5);
    seek(newTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const cycleLoop = () => {
    const loopStates: Array<'none' | 'track' | 'all'> = ['none', 'track', 'all'];
    const currentIndex = loopStates.indexOf(playerState.loop);
    const nextLoop = loopStates[(currentIndex + 1) % loopStates.length];
    setLoop(nextLoop);
  };

  return (
    <div className="bg-black/30 backdrop-blur-xl border-t border-white/10">
      {/* Progress Bar */}
      <div className="px-8 pt-4">
        <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
          <span>{formatTime(playerState.currentTime)}</span>
          <input
            type="range"
            min="0"
            max={playerState.duration || 0}
            value={playerState.currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:transition-transform"
          />
          <span>{formatTime(playerState.duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Left: Subtitle & Cover Controls */}
        <div className="flex items-center gap-4">
          <SubtitleInsertZone />
          
          <div className="h-6 w-px bg-white/20" />
          
          <CoverImageInsert />
          
          <div className="h-6 w-px bg-white/20" />
          
          <span className="text-sm text-white/60">Sync:</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => adjustSubtitleOffset(-100)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            title="Delay subtitles by 100ms"
          >
            <Minus className="w-4 h-4" />
          </motion.button>
          <span className="text-sm font-mono min-w-[80px] text-center text-white">
            {subtitleOffset > 0 ? '+' : ''}
            {subtitleOffset}ms
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => adjustSubtitleOffset(100)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            title="Advance subtitles by 100ms"
          >
            <Plus className="w-4 h-4" />
          </motion.button>

          <div className="h-6 w-px bg-white/20" />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSubtitleMode}
            className={`p-2 rounded-lg transition-colors ${
              subtitleMode === 'single'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-white/10 text-white'
            }`}
            title={subtitleMode === 'full' ? 'Switch to single line mode' : 'Switch to full list mode'}
          >
            {subtitleMode === 'full' ? (
              <Type className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={previousTrack}
            className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={rewind5}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors text-white"
            title={playerState.isPlaying ? 'Pause' : 'Play'}
          >
            {playerState.isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={forward5}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            title="Forward 5 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack}
            className="p-3 hover:bg-white/10 rounded-full transition-colors text-white"
            title="Next track"
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Right: Additional Controls */}
        <div className="flex items-center gap-4">
          {/* Playback Speed */}
          <select
            value={playerState.playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="bg-white/10 text-white text-sm px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>

          {/* Loop */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={cycleLoop}
            className={`p-2 rounded-lg transition-colors ${
              playerState.loop !== 'none'
                ? 'bg-purple-600 text-white'
                : 'hover:bg-white/10 text-white'
            }`}
            title={`Loop: ${playerState.loop}`}
          >
            {playerState.loop === 'track' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </motion.button>

          {/* Shuffle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              playerState.shuffle
                ? 'bg-purple-600 text-white'
                : 'hover:bg-white/10 text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </motion.button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={playerState.isMuted ? 0 : playerState.volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-white/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
