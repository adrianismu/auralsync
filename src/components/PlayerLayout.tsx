import { FileTreeComponent } from './FileTreeComponent';
import { AlbumArt } from './AlbumArt';
import { SubtitleDisplay } from './SubtitleDisplay';
import { PlayerControls } from './PlayerControls';
import { usePlayerStore } from '@/store/playerStore';
import { useDropZoneHandler, useFolderInput } from './DropZoneHandler';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export function PlayerLayout() {
  const { currentTrackId, tracks, fileTree } = usePlayerStore();
  const { handleDrop, handleDragOver } = useDropZoneHandler();
  const { handleFolderSelect } = useFolderInput();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const currentTrack = tracks.find((t) => t.id === currentTrackId);

  const handleAddFolder = () => {
    folderInputRef.current?.click();
  };

  // Generate breadcrumb path
  const breadcrumbs = currentTrack?.relativePath
    ? currentTrack.relativePath.split('/').slice(0, -1)
    : [];

  return (
    <div
      className="h-screen w-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      onDrop={(e) => handleDrop(e, { type: 'global' })}
      onDragOver={handleDragOver}
    >
      {/* Hidden folder input */}
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore - webkitdirectory is not in TypeScript definitions
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFolderSelect}
        className="hidden"
      />

      {/* Left Sidebar - Library */}
      <div className="w-80 h-full flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl">
        {/* Library Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Library</h2>
            <button
              onClick={handleAddFolder}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Add Folder"
            >
              <FolderOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto">
          {fileTree.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <FolderOpen className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-sm text-white/60 mb-2">No folders loaded</p>
              <button
                onClick={handleAddFolder}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Click to add a folder
              </button>
            </div>
          ) : (
            <FileTreeComponent tree={fileTree} />
          )}
        </div>
      </div>

      {/* Right Main Stage - Player */}
      <div className="flex-1 h-full flex flex-col">
        {/* Breadcrumb Path */}
        {currentTrack && breadcrumbs.length > 0 && (
          <div className="px-6 py-3 border-b border-white/10 bg-black/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm text-white/60">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="hover:text-white/80 transition-colors">
                    {crumb}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          {currentTrack ? (
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
              {/* Top Section: Album Art and Track Info */}
              <div className="flex flex-col items-center gap-3">
                <AlbumArt />
                
                {/* Track Info */}
                <div className="text-center space-y-1">
                  <h1 className="text-xl font-bold text-white">
                    {currentTrack.metadata.title}
                  </h1>
                  {currentTrack.metadata.artist && (
                    <p className="text-sm text-white/60">{currentTrack.metadata.artist}</p>
                  )}
                  {currentTrack.metadata.album && (
                    <p className="text-xs text-white/40">{currentTrack.metadata.album}</p>
                  )}
                </div>
              </div>

              {/* Subtitle Display */}
              <SubtitleDisplay />
            </div>
          ) : (
            // Empty State
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <FolderOpen className="w-16 h-16 text-white/20" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Welcome to AuralSync
                </h2>
                <p className="text-white/60">
                  Add a folder or drop audio files to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Player Controls - Fixed at Bottom */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-xl">
          <PlayerControls />
        </div>
      </div>
    </div>
  );
}
