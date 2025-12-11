// Subtitle line structure
export interface SubtitleLine {
  id: string;
  startTime: number; // in seconds
  endTime: number;
  text: string;
}

// Track metadata
export interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  coverArt?: string; // base64 or blob URL
  duration?: number;
}

// Audio track (no longer paired with subtitle)
export interface AudioTrack {
  id: string;
  audioFile: File;
  audioUrl: string; // Blob URL
  relativePath: string; // Full path from dropped folder
  metadata: TrackMetadata;
}

// File tree node types
export type FileTreeNodeType = 'folder' | 'audio' | 'subtitle' | 'other';

export interface FileTreeNode {
  id: string;
  name: string;
  type: FileTreeNodeType;
  path: string; // Full relative path
  file?: File; // Actual file object for audio/subtitle
  children?: FileTreeNode[]; // For folders
  isExpanded?: boolean; // UI state for folders
}

// Loaded subtitle (late-bound to current track)
export interface LoadedSubtitle {
  file: File;
  lines: SubtitleLine[];
  trackId: string; // Associated track ID
}

// Player state
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  loop: 'none' | 'track' | 'all';
  shuffle: boolean;
}

// App state with decoupled subtitle
export interface AppState {
  fileTree: FileTreeNode[]; // Root level nodes
  tracks: AudioTrack[]; // Flat list of all audio tracks
  currentTrackId: string | null;
  currentSubtitle: LoadedSubtitle | null; // Decoupled from track
  playerState: PlayerState;
  subtitleOffset: number; // in milliseconds
  libraryOpen: boolean;
  autoMatchSubtitles: boolean; // Toggle for auto-matching
}
