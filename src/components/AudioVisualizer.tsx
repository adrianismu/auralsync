
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { usePlayerStore } from '@/store/playerStore';

export function AudioVisualizer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const { tracks, currentTrackIndex, playerState } = usePlayerStore();

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    if (!waveformRef.current || !currentTrack) return;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#808080',
      progressColor: '#6366f1',
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      height: 80,
      normalize: true,
      interact: false,
    });

    wavesurferRef.current = wavesurfer;

    // Load audio
    wavesurfer.load(currentTrack.audioUrl);

    return () => {
      wavesurfer.destroy();
    };
  }, [currentTrack]);

  // Sync with player time
  useEffect(() => {
    if (wavesurferRef.current && playerState.duration > 0) {
      const progress = playerState.currentTime / playerState.duration;
      wavesurferRef.current.seekTo(progress);
    }
  }, [playerState.currentTime, playerState.duration]);

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 opacity-60 pointer-events-none">
      <div ref={waveformRef} className="w-full h-full" />
    </div>
  );
}
