import { usePlayerStore } from '@/store/playerStore';
import { useDropZoneHandler } from './DropZoneHandler';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

export function SubtitleInsertZone() {
  const { currentSubtitle, removeSubtitle, currentTrackId } = usePlayerStore();
  const { handleDrop, handleDragOver } = useDropZoneHandler();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name, 'currentTrackId:', currentTrackId);
    if (file && currentTrackId) {
      try {
        await usePlayerStore.getState().loadSubtitle(file);
        console.log('Subtitle loaded from file input');
      } catch (error) {
        console.error('Error loading subtitle from file input:', error);
      }
    } else {
      console.warn('Missing file or currentTrackId');
    }
    e.target.value = '';
  };

  if (!currentTrackId) {
    return null; // Only show when audio is playing
  }

  return (
    <AnimatePresence mode="wait">
      {currentSubtitle ? (
        // Subtitle loaded - show compact info with eject button
        <motion.div
          key="loaded"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 backdrop-blur-md rounded-lg border border-green-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <p className="text-xs text-green-300 font-medium">
              {currentSubtitle.file.name}
            </p>
          </div>
          <motion.button
            onClick={removeSubtitle}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-colors"
            title="Remove subtitle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ) : (
        // No subtitle - show icon button
        <motion.div
          key="empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt,.ass,.ssa"
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.button
            onClick={handleClick}
            onDrop={(e) => handleDrop(e, { type: 'subtitle-insert' })}
            onDragOver={handleDragOver}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 transition-all"
            title="Load subtitle file"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Load Subtitle</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
