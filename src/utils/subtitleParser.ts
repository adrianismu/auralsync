import { SubtitleLine } from '@/types';

/**
 * Parse SRT subtitle format
 * Format:
 * 1
 * 00:00:20,000 --> 00:00:24,400
 * Subtitle text here
 */
export function parseSRT(content: string): SubtitleLine[] {
  const lines = content.trim().split(/\r?\n\r?\n/);
  const subtitles: SubtitleLine[] = [];

  for (const block of lines) {
    const blockLines = block.trim().split(/\r?\n/);
    if (blockLines.length < 3) continue;

    const timeMatch = blockLines[1].match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
    );

    if (!timeMatch) continue;

    const startTime =
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;

    const endTime =
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;

    const text = blockLines.slice(2).join('\n');

    subtitles.push({
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      text,
    });
  }

  return subtitles;
}

/**
 * Parse VTT subtitle format
 * Format:
 * WEBVTT
 *
 * 00:00:20.000 --> 00:00:24.400
 * Subtitle text here
 */
export function parseVTT(content: string): SubtitleLine[] {
  // Remove WEBVTT header and any metadata
  let cleanContent = content.replace(/^WEBVTT[^\n]*\n+/, '').trim();
  
  // Split by double newlines or single newlines (more flexible)
  const blocks = cleanContent.split(/\n\s*\n/);
  const subtitles: SubtitleLine[] = [];

  console.log('VTT blocks found:', blocks.length);

  for (const block of blocks) {
    const blockLines = block.trim().split(/\n/);
    if (blockLines.length === 0) continue;

    // Find the line with -->
    let timeLineIndex = -1;
    for (let i = 0; i < blockLines.length; i++) {
      if (blockLines[i].includes('-->')) {
        timeLineIndex = i;
        break;
      }
    }

    if (timeLineIndex === -1) continue;

    // More flexible regex - handles with or without hours, with milliseconds
    const timeLine = blockLines[timeLineIndex];
    
    // Try different time formats
    let timeMatch = timeLine.match(
      /(\d{2}):(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[.,](\d{3})/
    );
    
    // Try without hours (00:20.000 --> 00:24.400)
    if (!timeMatch) {
      timeMatch = timeLine.match(
        /(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(\d{2}):(\d{2})[.,](\d{3})/
      );
      
      if (timeMatch) {
        // Convert to include hours
        const startTime =
          parseInt(timeMatch[1]) * 60 +
          parseInt(timeMatch[2]) +
          parseInt(timeMatch[3]) / 1000;

        const endTime =
          parseInt(timeMatch[4]) * 60 +
          parseInt(timeMatch[5]) +
          parseInt(timeMatch[6]) / 1000;

        const text = blockLines.slice(timeLineIndex + 1).join('\n').trim();
        
        if (text) {
          subtitles.push({
            id: `${startTime}-${endTime}`,
            startTime,
            endTime,
            text,
          });
        }
        continue;
      }
    }

    if (!timeMatch) {
      console.warn('Could not parse time line:', timeLine);
      continue;
    }

    const startTime =
      parseInt(timeMatch[1]) * 3600 +
      parseInt(timeMatch[2]) * 60 +
      parseInt(timeMatch[3]) +
      parseInt(timeMatch[4]) / 1000;

    const endTime =
      parseInt(timeMatch[5]) * 3600 +
      parseInt(timeMatch[6]) * 60 +
      parseInt(timeMatch[7]) +
      parseInt(timeMatch[8]) / 1000;

    const text = blockLines.slice(timeLineIndex + 1).join('\n').trim();

    if (text) {
      subtitles.push({
        id: `${startTime}-${endTime}`,
        startTime,
        endTime,
        text,
      });
    }
  }

  console.log('VTT parsed subtitles:', subtitles.length);
  return subtitles;
}

/**
 * Parse LRC lyrics format
 * Format:
 * [00:12.00]Line one lyrics
 * [00:17.20]Line two lyrics
 */
export function parseLRC(content: string): SubtitleLine[] {
  const lines = content.trim().split(/\r?\n/);
  const subtitles: SubtitleLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);

    if (!match) continue;

    const startTime =
      parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3]) / 100;

    const text = match[4].trim();

    // Calculate end time (next line's start time or +5 seconds)
    let endTime = startTime + 5;
    for (let j = i + 1; j < lines.length; j++) {
      const nextMatch = lines[j].match(/\[(\d{2}):(\d{2})\.(\d{2})\]/);
      if (nextMatch) {
        endTime =
          parseInt(nextMatch[1]) * 60 +
          parseInt(nextMatch[2]) +
          parseInt(nextMatch[3]) / 100;
        break;
      }
    }

    subtitles.push({
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      text,
    });
  }

  return subtitles;
}

/**
 * Parse subtitle file based on extension
 */
export async function parseSubtitleFile(file: File): Promise<SubtitleLine[]> {
  const content = await file.text();
  const extension = file.name.split('.').pop()?.toLowerCase();

  console.log('Parsing subtitle file:', file.name, 'extension:', extension);
  console.log('Content preview:', content.substring(0, 200));

  let lines: SubtitleLine[];
  
  switch (extension) {
    case 'srt':
      lines = parseSRT(content);
      break;
    case 'vtt':
      lines = parseVTT(content);
      break;
    case 'lrc':
      lines = parseLRC(content);
      break;
    default:
      throw new Error(`Unsupported subtitle format: ${extension}`);
  }

  console.log('Parsed lines:', lines.length, 'first line:', lines[0]);
  return lines;
}

/**
 * Get the active subtitle line at a given time
 */
export function getActiveSubtitle(
  subtitles: SubtitleLine[],
  currentTime: number,
  offset: number = 0
): SubtitleLine | null {
  const adjustedTime = currentTime + offset / 1000;
  return (
    subtitles.find(
      (sub) => sub.startTime <= adjustedTime && sub.endTime >= adjustedTime
    ) || null
  );
}
