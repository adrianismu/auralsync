import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export function DropZone() {
  const addTracks = usePlayerStore((state) => state.addTracks);
  const tracks = usePlayerStore((state) => state.tracks);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const items = Array.from(e.dataTransfer.items);
      const files: File[] = [];

      // Handle both files and directories
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await collectFiles(entry, files);
          }
        }
      }

      if (files.length > 0) {
        await addTracks(files);
      }
    },
    [addTracks]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await addTracks(files);
      }
    },
    [addTracks]
  );

  // Show drop zone only when playlist is empty
  if (tracks.length > 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-screen p-8"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label className="cursor-pointer">
        <input
          type="file"
          multiple
          accept="audio/*,.srt,.vtt,.lrc"
          onChange={handleFileInput}
          className="hidden"
        />
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-4 border-dashed border-immersive-accent/30 rounded-3xl p-16 text-center hover:border-immersive-accent/60 transition-colors"
        >
          <Upload className="w-24 h-24 mx-auto mb-6 text-immersive-accent" />
          <h2 className="text-3xl font-bold text-immersive-text mb-4">
            Drop Your Audio Files Here
          </h2>
          <p className="text-immersive-muted text-lg mb-2">
            Supports MP3, FLAC, WAV, and more
          </p>
          <p className="text-immersive-muted">
            Also drop subtitle files (.srt, .vtt, .lrc) for synchronized lyrics
          </p>
        </motion.div>
      </label>
    </motion.div>
  );
}

// Helper function to recursively collect files from directories
async function collectFiles(
  entry: FileSystemEntry,
  files: File[]
): Promise<void> {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve, reject) => {
      fileEntry.file(resolve, reject);
    });
    files.push(file);
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    for (const childEntry of entries) {
      await collectFiles(childEntry, files);
    }
  }
}
