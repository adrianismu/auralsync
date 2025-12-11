import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { extractDominantColor } from '@/utils/audioUtils';

export function DynamicBackground() {
  const { tracks, currentTrackIndex, setBackgroundColor } = usePlayerStore();
  const [bgImage, setBgImage] = useState<string | null>(null);

  const currentTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  useEffect(() => {
    if (currentTrack?.metadata.coverArt) {
      setBgImage(currentTrack.metadata.coverArt);

      // Extract and set dominant color
      extractDominantColor(currentTrack.metadata.coverArt).then(
        setBackgroundColor
      );
    } else {
      setBgImage(null);
      setBackgroundColor('#1a1a2e');
    }
  }, [currentTrack, setBackgroundColor]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient base */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-immersive-bg via-immersive-surface to-immersive-bg"
        style={{
          background: bgImage
            ? `linear-gradient(135deg, ${usePlayerStore.getState().backgroundColor}ee, #0a0a0fee)`
            : undefined,
        }}
      />

      {/* Blurred cover art */}
      <AnimatePresence mode="wait">
        {bgImage ? (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url(${bgImage})`,
                filter: 'blur(80px)',
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Music className="w-64 h-64 text-immersive-muted" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
