import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, X } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export function CoverImageInsert() {
  const { customCoverArt, loadCoverImage, removeCoverImage } = usePlayerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      await loadCoverImage(file);
    } catch (error) {
      console.error('Failed to load cover image:', error);
      alert('Failed to load cover image');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    removeCoverImage();
  };

  if (!customCoverArt) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
        title="Load cover image"
      >
        <ImageIcon className="w-4 h-4" />
        <span>Load Cover</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-sm">
      <ImageIcon className="w-4 h-4 text-green-400" />
      <span className="text-green-300 font-medium">
        {customCoverArt.width} × {customCoverArt.height}
      </span>
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRemove}
        className="p-1 hover:bg-red-500/20 rounded transition-colors text-red-400"
        title="Remove cover image"
      >
        <X className="w-3 h-3" />
      </motion.button>
    </div>
  );
}
