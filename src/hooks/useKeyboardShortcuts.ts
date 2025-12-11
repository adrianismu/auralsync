import { useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';

export function useKeyboardShortcuts(
  togglePlay: () => void,
  seek: (time: number) => void
) {
  const {
    playerState,
    setVolume,
    toggleMute,
    setLoop,
    toggleShuffle,
    nextTrack,
    previousTrack,
  } = usePlayerStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, playerState.currentTime - 5));
          break;

        case 'ArrowRight':
          e.preventDefault();
          seek(playerState.currentTime + 5);
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, playerState.volume + 0.1));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, playerState.volume - 0.1));
          break;

        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;

        case 'KeyL':
          e.preventDefault();
          const loopStates: Array<'none' | 'track' | 'all'> = ['none', 'track', 'all'];
          const currentIndex = loopStates.indexOf(playerState.loop);
          const nextLoop = loopStates[(currentIndex + 1) % loopStates.length];
          setLoop(nextLoop);
          break;

        case 'KeyS':
          e.preventDefault();
          toggleShuffle();
          break;

        case 'KeyN':
          e.preventDefault();
          nextTrack();
          break;

        case 'KeyP':
          e.preventDefault();
          previousTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    togglePlay,
    seek,
    playerState,
    setVolume,
    toggleMute,
    setLoop,
    toggleShuffle,
    nextTrack,
    previousTrack,
  ]);
}
