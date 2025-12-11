import { create } from 'zustand';
import { AudioTrack, PlayerState, LoadedSubtitle, FileTreeNode } from '@/types';
import { parseSubtitleFile } from '@/utils/subtitleParser';
import { extractMetadata } from '@/utils/audioUtils';
import {
  buildFileTree,
  extractAudioTracks,
  toggleNodeExpansion,
} from '@/utils/fileTree';

interface PlayerStore {
  // State
  fileTree: FileTreeNode[];
  tracks: AudioTrack[];
  currentTrackId: string | null;
  currentSubtitle: LoadedSubtitle | null;
  customCoverArt: { url: string; width: number; height: number } | null;
  playerState: PlayerState;
  subtitleOffset: number;
  subtitleMode: 'full' | 'single';
  libraryOpen: boolean;
  backgroundColor: string;
  autoMatchSubtitles: boolean;

  // Actions - Library
  loadFolder: (files: FileList) => Promise<void>;
  toggleFolder: (nodeId: string) => void;
  clearLibrary: () => void;

  // Actions - Playback
  playTrack: (trackId: string) => void;
  playAudioFile: (file: File) => Promise<void>;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  setLoop: (loop: 'none' | 'track' | 'all') => void;
  toggleShuffle: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Actions - Subtitle (Late-binding)
  loadSubtitle: (file: File) => Promise<void>;
  removeSubtitle: () => void;
  setSubtitleOffset: (offset: number) => void;
  adjustSubtitleOffset: (delta: number) => void;
  toggleAutoMatch: () => void;
  toggleSubtitleMode: () => void;
  
  // Actions - Cover Art
  loadCoverImage: (file: File) => Promise<void>;
  removeCoverImage: () => void;
  
  // Actions - UI
  toggleLibrary: () => void;
  setBackgroundColor: (color: string) => void;
}

const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  isMuted: false,
  loop: 'none',
  shuffle: false,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  fileTree: [],
  tracks: [],
  currentTrackId: null,
  currentSubtitle: null,
  customCoverArt: null,
  playerState: initialPlayerState,
  subtitleOffset: 0,
  subtitleMode: 'full',
  libraryOpen: true,
  backgroundColor: '#1a1a2e',
  autoMatchSubtitles: false,

  // Load folder structure
  loadFolder: async (files: FileList) => {
    console.log('Loading folder with files:', files.length);
    
    const tree = buildFileTree(files);
    console.log('Built file tree:', tree);
    
    const audioNodes = extractAudioTracks(tree);
    console.log('Extracted audio nodes:', audioNodes.length);
    
    const newTracks: AudioTrack[] = [];

    for (const node of audioNodes) {
      if (!node.file) continue;
      
      const metadata = await extractMetadata(node.file);
      const audioUrl = URL.createObjectURL(node.file);

      const track: AudioTrack = {
        id: node.id,
        audioFile: node.file,
        audioUrl,
        relativePath: node.path,
        metadata,
      };

      newTracks.push(track);
    }

    console.log('Created tracks:', newTracks.length);

    set((state) => ({
      fileTree: tree,
      tracks: [...state.tracks, ...newTracks],
      currentTrackId: state.currentTrackId ?? (newTracks.length > 0 ? newTracks[0].id : null),
    }));
  },

  toggleFolder: (nodeId: string) => {
    set((state) => ({
      fileTree: toggleNodeExpansion(state.fileTree, nodeId),
    }));
  },

  clearLibrary: () => {
    const { tracks } = get();
    tracks.forEach((track) => URL.revokeObjectURL(track.audioUrl));
    set({
      fileTree: [],
      tracks: [],
      currentTrackId: null,
      currentSubtitle: null,
      playerState: initialPlayerState,
      subtitleOffset: 0,
    });
  },

  // Play specific track by ID
  playTrack: (trackId: string) => {
    const { tracks, autoMatchSubtitles } = get();
    const track = tracks.find((t) => t.id === trackId);
    
    if (track) {
      set({
        currentTrackId: trackId,
        subtitleOffset: 0,
        playerState: { ...get().playerState, currentTime: 0, isPlaying: true },
      });

      // Clear subtitle unless auto-match is on
      if (!autoMatchSubtitles) {
        set({ currentSubtitle: null });
      }
    }
  },

  // Play a single audio file (dropped directly)
  playAudioFile: async (file: File) => {
    const metadata = await extractMetadata(file);
    const audioUrl = URL.createObjectURL(file);
    const id = crypto.randomUUID();

    const track: AudioTrack = {
      id,
      audioFile: file,
      audioUrl,
      relativePath: file.name,
      metadata,
    };

    set((state) => ({
      tracks: [...state.tracks, track],
      currentTrackId: id,
      currentSubtitle: null,
      subtitleOffset: 0,
      playerState: { ...state.playerState, currentTime: 0, isPlaying: true },
    }));
  },

  // Playback controls
  setIsPlaying: (playing: boolean) => {
    set((state) => ({
      playerState: { ...state.playerState, isPlaying: playing },
    }));
  },

  setCurrentTime: (time: number) => {
    set((state) => ({
      playerState: { ...state.playerState, currentTime: time },
    }));
  },

  setDuration: (duration: number) => {
    set((state) => ({
      playerState: { ...state.playerState, duration },
    }));
  },

  setVolume: (volume: number) => {
    set((state) => ({
      playerState: { ...state.playerState, volume: Math.max(0, Math.min(1, volume)) },
    }));
  },

  setPlaybackRate: (rate: number) => {
    set((state) => ({
      playerState: { ...state.playerState, playbackRate: rate },
    }));
  },

  toggleMute: () => {
    set((state) => ({
      playerState: { ...state.playerState, isMuted: !state.playerState.isMuted },
    }));
  },

  setLoop: (loop: 'none' | 'track' | 'all') => {
    set((state) => ({
      playerState: { ...state.playerState, loop },
    }));
  },

  toggleShuffle: () => {
    set((state) => ({
      playerState: { ...state.playerState, shuffle: !state.playerState.shuffle },
    }));
  },

  // Navigation
  nextTrack: () => {
    const { tracks, currentTrackId, playerState } = get();
    if (!currentTrackId || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    if (currentIndex === -1) return;

    let nextTrack: AudioTrack | undefined;

    if (playerState.shuffle) {
      const availableTracks = tracks.filter((t) => t.id !== currentTrackId);
      if (availableTracks.length > 0) {
        nextTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
      }
    } else if (playerState.loop === 'all') {
      const nextIndex = (currentIndex + 1) % tracks.length;
      nextTrack = tracks[nextIndex];
    } else if (currentIndex < tracks.length - 1) {
      nextTrack = tracks[currentIndex + 1];
    }

    if (nextTrack) {
      get().playTrack(nextTrack.id);
    }
  },

  previousTrack: () => {
    const { tracks, currentTrackId, playerState } = get();
    if (!currentTrackId || tracks.length === 0) return;

    const currentIndex = tracks.findIndex((t) => t.id === currentTrackId);
    if (currentIndex === -1) return;

    // If we're more than 3 seconds into the track, restart it
    if (playerState.currentTime > 3) {
      set((state) => ({
        playerState: { ...state.playerState, currentTime: 0 },
      }));
      return;
    }

    let prevTrack: AudioTrack | undefined;

    if (playerState.shuffle) {
      const availableTracks = tracks.filter((t) => t.id !== currentTrackId);
      if (availableTracks.length > 0) {
        prevTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
      }
    } else if (playerState.loop === 'all') {
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      prevTrack = tracks[prevIndex];
    } else if (currentIndex > 0) {
      prevTrack = tracks[currentIndex - 1];
    }

    if (prevTrack) {
      get().playTrack(prevTrack.id);
    }
  },

  // Subtitle late-binding
  loadSubtitle: async (file: File) => {
    const { currentTrackId } = get();
    console.log('loadSubtitle called with:', file.name, 'currentTrackId:', currentTrackId);
    
    if (!currentTrackId) {
      console.warn('No current track, cannot load subtitle');
      return;
    }

    try {
      const lines = await parseSubtitleFile(file);
      console.log('Parsed subtitle lines:', lines.length, lines);
      
      set({
        currentSubtitle: {
          file,
          lines,
          trackId: currentTrackId,
        },
        subtitleOffset: 0,
      });
      
      console.log('Subtitle loaded successfully');
    } catch (error) {
      console.error('Failed to load subtitle:', error);
      throw error;
    }
  },

  removeSubtitle: () => {
    set({ currentSubtitle: null, subtitleOffset: 0 });
  },

  setSubtitleOffset: (offset: number) => {
    set({ subtitleOffset: offset });
  },

  adjustSubtitleOffset: (delta: number) => {
    set((state) => ({
      subtitleOffset: state.subtitleOffset + delta,
    }));
  },

  toggleAutoMatch: () => {
    set((state) => ({
      autoMatchSubtitles: !state.autoMatchSubtitles,
    }));
  },

  toggleSubtitleMode: () => {
    set((state) => ({
      subtitleMode: state.subtitleMode === 'full' ? 'single' : 'full',
    }));
  },

  // Cover Art
  loadCoverImage: async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      
      // Load image to get dimensions
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      set({
        customCoverArt: {
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
        },
      });
      
      console.log('Cover image loaded:', img.naturalWidth, 'x', img.naturalHeight);
    } catch (error) {
      console.error('Failed to load cover image:', error);
      throw error;
    }
  },

  removeCoverImage: () => {
    const { customCoverArt } = get();
    if (customCoverArt) {
      URL.revokeObjectURL(customCoverArt.url);
    }
    set({ customCoverArt: null });
  },

  // UI
  toggleLibrary: () => {
    set((state) => ({ libraryOpen: !state.libraryOpen }));
  },

  setBackgroundColor: (color: string) => {
    set({ backgroundColor: color });
  },
}));
