import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { formatTime } from '@/utils/audioUtils';

export function PlaylistSidebar() {
  const {
    tracks,
    currentTrackIndex,
    sidebarOpen,
    toggleSidebar,
    setCurrentTrack,
    removeTrack,
    clearPlaylist,
  } = usePlayerStore();

  const handleLoadSubtitle = async (trackIndex: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.srt,.vtt,.lrc';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await usePlayerStore.getState().loadSubtitleForTrack(trackIndex, file);
        } catch (error) {
          console.error('Failed to load subtitle:', error);
          alert('Failed to load subtitle file');
        }
      }
    };
    
    input.click();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-3 bg-immersive-surface/80 backdrop-blur-xl rounded-full hover:bg-immersive-hover transition-colors"
      >
        {sidebarOpen ? (
          <ChevronRight className="w-6 h-6" />
        ) : (
          <ChevronLeft className="w-6 h-6" />
        )}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-96 bg-immersive-surface/95 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Playlist</h2>
                <span className="text-sm text-immersive-muted">
                  {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                </span>
              </div>
              {tracks.length > 0 && (
                <button
                  onClick={clearPlaylist}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto">
              {tracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-immersive-muted p-8 text-center">
                  <Music className="w-16 h-16 mb-4 opacity-50" />
                  <p>No tracks in playlist</p>
                  <p className="text-sm mt-2">Drop audio files to get started</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {tracks.map((track, index) => {
                    const isActive = index === currentTrackIndex;

                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          group relative p-4 rounded-lg cursor-pointer transition-all
                          ${
                            isActive
                              ? 'bg-immersive-accent text-white'
                              : 'bg-immersive-hover/50 hover:bg-immersive-hover'
                          }
                        `}
                        onClick={() => setCurrentTrack(index)}
                      >
                        {/* Cover Art */}
                        <div className="flex items-start gap-3">
                          {track.metadata.coverArt ? (
                            <img
                              src={track.metadata.coverArt}
                              alt={track.metadata.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-immersive-bg flex items-center justify-center flex-shrink-0">
                              <Music className="w-6 h-6 opacity-50" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {track.metadata.title}
                            </h3>
                            <p
                              className={`text-sm truncate ${
                                isActive ? 'text-white/80' : 'text-immersive-muted'
                              }`}
                            >
                              {track.metadata.artist}
                            </p>

                            {/* Subtitle indicator */}
                            <div className="flex items-center gap-2 mt-1">
                              {track.subtitles ? (
                                <span
                                  className={`text-xs flex items-center gap-1 ${
                                    isActive ? 'text-white/80' : 'text-green-400'
                                  }`}
                                >
                                  <FileText className="w-3 h-3" />
                                  {track.subtitles.length} lines
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleLoadSubtitle(index);
                                  }}
                                  className={`text-xs hover:underline ${
                                    isActive ? 'text-white/60' : 'text-immersive-muted'
                                  }`}
                                >
                                  Load Subtitle
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTrack(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Duration */}
                        {track.metadata.duration && (
                          <div
                            className={`text-xs mt-2 ${
                              isActive ? 'text-white/60' : 'text-immersive-muted'
                            }`}
                          >
                            {formatTime(track.metadata.duration)}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
