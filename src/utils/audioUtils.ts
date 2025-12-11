import { TrackMetadata } from '@/types';

/**
 * Extract metadata from audio file including cover art
 * This is a simplified version that extracts basic info
 * For full ID3 tag support, consider using music-metadata package
 */
export async function extractMetadata(file: File): Promise<TrackMetadata> {
  // For now, we'll create a simple implementation
  // You can enhance this with a proper metadata library later
  
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  
  // Try to extract audio duration using HTML5 Audio
  let duration: number | undefined;
  try {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    
    await new Promise<void>((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve();
      });
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve();
      });
    });
  } catch (error) {
    console.error('Failed to extract duration:', error);
  }

  return {
    title: fileName,
    artist: 'Unknown Artist',
    duration,
  };
}

/**
 * Pair audio files with subtitle files based on filename
 */
export function pairAudioWithSubtitles(
  audioFiles: File[],
  subtitleFiles: File[]
): Map<File, File | undefined> {
  const pairs = new Map<File, File | undefined>();

  for (const audioFile of audioFiles) {
    const baseName = audioFile.name.replace(/\.[^/.]+$/, '');
    const matchingSubtitle = subtitleFiles.find((subFile) => {
      const subBaseName = subFile.name.replace(/\.[^/.]+$/, '');
      return subBaseName === baseName;
    });

    pairs.set(audioFile, matchingSubtitle);
  }

  return pairs;
}

/**
 * Check if file is an audio file
 */
export function isAudioFile(file: File): boolean {
  const audioExtensions = ['mp3', 'flac', 'wav', 'ogg', 'm4a', 'aac', 'opus'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  return audioExtensions.includes(extension || '');
}

/**
 * Check if file is a subtitle file
 */
export function isSubtitleFile(file: File): boolean {
  const subtitleExtensions = ['srt', 'vtt', 'lrc'];
  const extension = file.name.split('.').pop()?.toLowerCase();
  return subtitleExtensions.includes(extension || '');
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extract dominant color from image for background
 */
export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#1a1a2e');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      // Darken the color for background
      r = Math.floor(r * 0.3);
      g = Math.floor(g * 0.3);
      b = Math.floor(b * 0.3);

      resolve(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => {
      resolve('#1a1a2e');
    };
  });
}
