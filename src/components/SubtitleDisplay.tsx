import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { getActiveSubtitle } from '@/utils/subtitleParser';
import { SubtitleLine } from '@/types';

export function SubtitleDisplay() {
  const { currentSubtitle, playerState, subtitleOffset, subtitleMode } = usePlayerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const subtitles = currentSubtitle?.lines || [];

  const activeSubtitle = getActiveSubtitle(
    subtitles,
    playerState.currentTime,
    subtitleOffset
  );

  // Auto-scroll to active subtitle
  useEffect(() => {
    if (!activeLineRef.current || !containerRef.current || !activeSubtitle) return;
    
    const container = containerRef.current;
    const activeLine = activeLineRef.current;

    // Small delay to ensure layout is complete
    const scrollTimer = setTimeout(() => {
      const containerHeight = container.clientHeight;
      const lineOffsetTop = activeLine.offsetTop;
      const lineHeight = activeLine.clientHeight;
      
      // Calculate position to center the active line
      const targetScrollTop = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);
      
      console.log('Auto-scrolling to:', {
        lineOffsetTop,
        containerHeight,
        targetScrollTop,
        currentScrollTop: container.scrollTop
      });
      
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [activeSubtitle?.id]);

  const handleLineClick = (line: SubtitleLine) => {
    // Seek to subtitle start time
    const audio = (window as any).__audioElement as HTMLAudioElement;
    if (audio) {
      const seekTime = line.startTime - subtitleOffset / 1000;
      audio.currentTime = Math.max(0, seekTime);
      console.log('Seeking to:', seekTime);
    }
  };

  if (!currentSubtitle || subtitles.length === 0) {
    console.log('No subtitle to display', { currentSubtitle, subtitlesLength: subtitles.length });
    return null; // SubtitleInsertZone handles the empty state
  }

  console.log('Displaying subtitles:', subtitles.length, 'active:', activeSubtitle?.text, 'currentTime:', playerState.currentTime);

  // Single mode: only show active subtitle
  if (subtitleMode === 'single') {
    if (!activeSubtitle) {
      return (
        <div className="w-full min-h-[120px] flex items-center justify-center px-6 py-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
          <p className="text-white/30 text-lg">...</p>
        </div>
      );
    }

    return (
      <div className="w-full min-h-[120px] flex items-center justify-center px-6 py-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            key={activeSubtitle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
            onClick={() => handleLineClick(activeSubtitle)}
          >
            <p className="text-white text-3xl font-bold leading-relaxed whitespace-pre-wrap">
              {activeSubtitle.text}
            </p>
            <span className="text-sm text-white/40 mt-2 block">
              {Math.floor(activeSubtitle.startTime / 60)}:{String(Math.floor(activeSubtitle.startTime % 60)).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  // Full mode: show all subtitles with scroll
  return (
    <div
      ref={containerRef}
      className="w-full min-h-[400px] max-h-[500px] overflow-y-auto px-6 py-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {subtitles.map((line, index) => {
          const isActive = activeSubtitle?.id === line.id;

          return (
            <motion.div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: isActive ? 1 : 0.4,
                scale: isActive ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleLineClick(line)}
              className={`
                text-center cursor-pointer transition-all duration-300 p-3 rounded-lg
                ${isActive ? 'text-white text-2xl font-bold bg-purple-600/30' : 'text-white/50 text-base'}
                hover:bg-white/5
              `}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{line.text}</p>
              {isActive && (
                <span className="text-xs text-white/40 mt-1 block">
                  {Math.floor(line.startTime / 60)}:{String(Math.floor(line.startTime % 60)).padStart(2, '0')}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
