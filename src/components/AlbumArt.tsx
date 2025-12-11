import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export function AlbumArt() {
  const { tracks, currentTrackId, customCoverArt } = usePlayerStore();
  const currentTrack = currentTrackId 
    ? tracks.find(t => t.id === currentTrackId) ?? null
    : null;

  // Priority: custom cover art > track metadata cover > placeholder
  const coverArt = customCoverArt?.url || currentTrack?.metadata.coverArt;
  const aspectRatio = customCoverArt 
    ? customCoverArt.width / customCoverArt.height 
    : 1;

  // Calculate max dimensions while maintaining aspect ratio
  const maxSize = 900;
  const isWide = aspectRatio > 1;
  const width = isWide ? maxSize : maxSize * aspectRatio;
  const height = isWide ? maxSize / aspectRatio : maxSize;

  if (!currentTrack && !customCoverArt) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {coverArt ? (
        <motion.img
          key={customCoverArt?.url || currentTrack?.id}
          src={coverArt}
          alt={currentTrack?.metadata.title || 'Cover art'}
          className="w-full h-full rounded-2xl shadow-2xl object-cover border border-white/10"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ) : (
        <div className="w-full h-full rounded-2xl shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <Music className="w-24 h-24 text-white/20" />
        </div>
      )}
    </motion.div>
  );
}
