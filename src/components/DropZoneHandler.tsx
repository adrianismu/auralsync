import { useCallback } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { isAudioFile, isSubtitleFile } from '@/utils/audioUtils';

export interface DropContext {
  type: 'library' | 'subtitle-insert' | 'global';
  targetElement?: HTMLElement;
}

export function useDropZoneHandler() {
  const { loadFolder, playAudioFile, loadSubtitle, currentTrackId } =
    usePlayerStore();

  const handleDrop = useCallback(
    async (e: React.DragEvent, context: DropContext = { type: 'global' }) => {
      e.preventDefault();
      e.stopPropagation();

      const items = Array.from(e.dataTransfer.items);
      const files: File[] = [];

      // Check if dropping a folder/directory
      const hasDirectory = items.some((item) => {
        const entry = item.webkitGetAsEntry();
        return entry?.isDirectory;
      });

      if (hasDirectory) {
        // Handle folder drop - use file input instead
        // WebKit doesn't allow reading directories from dataTransfer directly
        console.log('Folder detected - please use the folder input');
        return;
      }

      // Collect files
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length === 0) return;

      // Determine what to do based on context and file types
      const audioFiles = files.filter(isAudioFile);
      const subtitleFiles = files.filter(isSubtitleFile);

      console.log('Drop detected:', {
        context: context.type,
        audioFiles: audioFiles.length,
        subtitleFiles: subtitleFiles.length,
        currentTrackId,
      });

      // Context: Subtitle Insert Area
      if (context.type === 'subtitle-insert' && currentTrackId) {
        if (subtitleFiles.length > 0) {
          console.log('Loading subtitle from subtitle-insert drop zone');
          try {
            await loadSubtitle(subtitleFiles[0]);
            console.log('Subtitle loaded successfully from drop');
          } catch (error) {
            console.error('Failed to load subtitle:', error);
          }
        }
        return;
      }

      // Context: Global/Library
      if (audioFiles.length > 0) {
        // If single audio file, play immediately
        if (audioFiles.length === 1 && context.type === 'global') {
          console.log('Playing single audio file');
          await playAudioFile(audioFiles[0]);
        }
      }

      if (subtitleFiles.length > 0 && currentTrackId) {
        // Auto-attach subtitle to current track
        console.log('Loading subtitle from global drop');
        try {
          await loadSubtitle(subtitleFiles[0]);
          console.log('Subtitle loaded successfully from global drop');
        } catch (error) {
          console.error('Failed to load subtitle:', error);
        }
      }
    },
    [loadFolder, playAudioFile, loadSubtitle, currentTrackId]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return {
    handleDrop,
    handleDragOver,
  };
}

// Helper to handle folder input (for webkitdirectory)
export function useFolderInput() {
  const { loadFolder } = usePlayerStore();

  const handleFolderSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await loadFolder(files);
      }
      // Reset input
      e.target.value = '';
    },
    [loadFolder]
  );

  return { handleFolderSelect };
}
