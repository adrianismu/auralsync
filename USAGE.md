# AuralSync - Usage Guide

## 🎵 Welcome to AuralSync!

AuralSync is an immersive local audio and subtitle player designed for ASMR, audiobooks, audio dramas, and music with lyrics. Everything runs in your browser - no server needed!

## 🚀 Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### First Time Use

1. **Drop Your Files**: When you first open AuralSync, you'll see a clean drop zone. Simply drag and drop:

   - Audio files (MP3, FLAC, WAV, M4A, OGG, etc.)
   - Subtitle files (SRT, VTT, LRC)
   - You can drop entire folders containing audio and subtitle files!

2. **Smart Pairing**: AuralSync automatically pairs subtitle files with audio files if they share the same filename:
   - `my-audio.mp3` + `my-audio.srt` = Perfectly paired!
   - `song.flac` + `song.lrc` = Lyrics synchronized!

## 🎮 Controls & Features

### Playback Controls (Bottom Bar)

- **Play/Pause**: Large center button or press `Space`
- **Previous/Next**: Skip between tracks or press `P` / `N`
- **Progress Bar**: Click anywhere to seek to that position
- **Playback Speed**: Choose from 0.5x to 2x speed (great for audiobooks!)

### Subtitle Synchronization

AuralSync's killer feature! If your subtitles are slightly out of sync:

1. Look for the "Subtitle Sync" controls on the left side of the control bar
2. Click **`-` (minus)** to delay subtitles by 100ms
3. Click **`+` (plus)** to advance subtitles by 100ms
4. The current offset is displayed in the center

💡 **Tip**: Most subtitle timing issues can be fixed with 2-3 clicks!

### Playlist Sidebar (Right Side)

- **Toggle**: Click the chevron button in the top-right corner
- **View Tracks**: See all loaded tracks with cover art and metadata
- **Switch Tracks**: Click any track to play it
- **Load Subtitles**: If a track doesn't have subtitles, click "Load Subtitle" to add one
- **Remove Tracks**: Hover over a track and click the ❌ button
- **Clear All**: Remove all tracks at once with the "Clear All" button

### Subtitle Display (Center)

The karaoke-style subtitle display is the heart of AuralSync:

- **Active Line**: Bright, large, and in focus
- **Inactive Lines**: Dimmed and slightly blurred for immersion
- **Click to Seek**: Click any subtitle line to jump to that timestamp
- **Auto-Scroll**: The active line always stays centered

### Advanced Features

#### Loop Modes (Press `L` to cycle)

- **None**: Play through the playlist once
- **Track**: Repeat the current track
- **All**: Loop the entire playlist

#### Shuffle (Press `S`)

- Enable shuffle to play tracks in random order

#### Volume Control

- Use the slider or press `↑`/`↓` arrows
- Click the speaker icon or press `M` to mute

## ⌨️ Keyboard Shortcuts

Master these shortcuts for the ultimate hands-free experience:

| Key     | Action                                       |
| ------- | -------------------------------------------- |
| `Space` | Play / Pause                                 |
| `←`     | Seek backward 5 seconds                      |
| `→`     | Seek forward 5 seconds                       |
| `↑`     | Increase volume                              |
| `↓`     | Decrease volume                              |
| `M`     | Mute / Unmute                                |
| `L`     | Cycle loop mode (None → Track → All)         |
| `S`     | Toggle shuffle                               |
| `N`     | Next track                                   |
| `P`     | Previous track (or restart if >3 seconds in) |

## 📝 Supported File Formats

### Audio Files

- MP3
- FLAC
- WAV
- M4A / AAC
- OGG
- OPUS

### Subtitle/Lyrics Files

#### SRT (SubRip)

```
1
00:00:20,000 --> 00:00:24,400
This is the first subtitle line

2
00:00:24,600 --> 00:00:28,200
This is the second line
```

#### VTT (WebVTT)

```
WEBVTT

00:00:20.000 --> 00:00:24.400
This is the first subtitle line

00:00:24.600 --> 00:00:28.200
This is the second line
```

#### LRC (Lyrics)

```
[00:12.00]Line one lyrics
[00:17.20]Line two lyrics
[00:21.10]Line three lyrics
```

## 🎨 The Immersive Experience

AuralSync creates a unique immersive environment:

1. **Dynamic Background**: The background adapts to the cover art of the current track, creating a blurred, atmospheric effect

2. **Audio Visualizer**: A real-time waveform visualization at the bottom reacts to your audio

3. **Smooth Animations**: All transitions use Framer Motion for buttery-smooth UI updates

4. **Rotating Album Art**: The album art gently pulses and rotates, adding life to the interface

## 💡 Pro Tips

### For ASMR Content

- Use the subtitle sync feature to perfectly match ASMR trigger descriptions
- Enable "Track" loop mode to repeat your favorite triggers
- Adjust playback speed for different experiences

### For Audiobooks

- Use slower playback speeds (0.75x) to catch every detail
- The subtitle display helps you follow along and review
- Click subtitle lines to quickly re-listen to important passages

### For Audio Dramas

- Perfect subtitle timing ensures dialogue matches the audio
- The immersive UI helps you focus on the story
- Shuffle mode to experience episodes in new ways

### For Music with Lyrics

- LRC files provide precise line-by-line lyrics
- Click lines to repeat your favorite verses
- The karaoke-style display makes sing-alongs easy

## 🔧 Troubleshooting

### Subtitles Not Showing?

1. Make sure the subtitle file has the same name as the audio file
2. Check that the subtitle format is supported (SRT, VTT, or LRC)
3. Try manually loading the subtitle using "Load Subtitle" button

### Subtitles Out of Sync?

- Use the `+` / `-` buttons in the Subtitle Sync controls
- Each click adjusts by 100ms
- Current offset is displayed between the buttons

### Audio Not Playing?

1. Check browser permissions for audio playback
2. Ensure the audio file format is supported
3. Try a different browser (Chrome, Firefox, or Edge recommended)

### No Cover Art?

- Cover art is extracted from embedded metadata in audio files
- Not all audio files have embedded cover art
- MP3 and FLAC usually support cover art best

## 🏗️ Building for Production

To build the app for deployment:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can serve them with any static file server or deploy to:

- GitHub Pages
- Netlify
- Vercel
- Your own web server

## 🤝 Contributing

Ideas for enhancements:

- Add support for more subtitle formats
- Implement advanced audio effects (equalizer, reverb)
- Add playlist save/load functionality
- Support for embedded chapter markers
- Cloud storage integration

## 📄 License

MIT License - Feel free to use and modify!

---

**Enjoy your immersive audio experience! 🎧✨**
