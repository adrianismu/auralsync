import { useEffect, useRef, useCallback } from 'react';
import { usePlayerStore } from '@/store/playerStore';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    tracks,
    currentTrackId,
    playerState,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    nextTrack,
  } = usePlayerStore();

  const currentTrack = currentTrackId 
    ? tracks.find(t => t.id === currentTrackId) ?? null 
    : null;

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Load track when current track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const wasPlaying = playerState.isPlaying;
    
    audio.src = currentTrack.audioUrl;
    audio.load();

    // Auto-play if player was playing before track change
    if (wasPlaying) {
      audio.play().catch((error) => {
        console.error('Playback error:', error);
        setIsPlaying(false);
      });
    }
  }, [currentTrack, currentTrackId]); // Removed playerState.isPlaying from deps

  // Sync player state with audio element
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = playerState.isMuted ? 0 : playerState.volume;
    audio.playbackRate = playerState.playbackRate;

    if (playerState.loop === 'track') {
      audio.loop = true;
    } else {
      audio.loop = false;
    }
  }, [
    playerState.volume,
    playerState.isMuted,
    playerState.playbackRate,
    playerState.loop,
  ]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (playerState.isPlaying && audio.paused) {
      audio.play().catch((error) => {
        console.error('Playback error:', error);
        setIsPlaying(false);
      });
    } else if (!playerState.isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [playerState.isPlaying, setIsPlaying]);

  // Time update listener
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (playerState.loop === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else if (playerState.loop === 'all') {
        nextTrack();
      } else {
        // Check if this is the last track
        const currentIndex = tracks.findIndex(t => t.id === currentTrackId);
        if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
        }
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
    };
  }, [
    setCurrentTime,
    setDuration,
    setIsPlaying,
    nextTrack,
    playerState.loop,
    currentTrackId,
    tracks,
  ]);

  // Seek to specific time
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [setCurrentTime]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(!playerState.isPlaying);
  }, [playerState.isPlaying, setIsPlaying]);

  // Expose audioRef globally for seek operations
  useEffect(() => {
    if (audioRef.current) {
      (window as any).__audioElement = audioRef.current;
    }
  }, []);

  return {
    audioRef,
    currentTrack,
    seek,
    togglePlay,
  };
}
