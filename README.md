# AuralSync 🎵

<div align="center">

**Immersive Local Audio & Subtitle Player**

A modern, standalone web application for playing local audio files with synchronized subtitles/lyrics. Perfect for podcast, audiobooks, and audio dramas.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎯 Core Functionality

- **Drag & Drop Interface** - No backend required, works entirely in your browser
- **Smart File Pairing** - Automatically matches audio with subtitle files by filename
- **Multiple Format Support** - SRT, VTT, and LRC subtitle formats
- **Playlist Management** - Add, remove, and organize your tracks

### 🎨 Immersive Experience

- **Dynamic Backgrounds** - Blurred cover art with dominant color extraction
- **Audio Visualization** - Real-time waveform display using WaveSurfer.js
- **Karaoke-Style Subtitles** - Auto-scrolling with active line highlighting
- **Smooth Animations** - Powered by Framer Motion for 60fps performance

### 🎛️ Advanced Controls

- **Subtitle Sync** - Fine-tune timing with ±100ms increments
- **Playback Speed** - Adjust from 0.5x to 2x
- **Loop Modes** - None, Track, or All
- **Shuffle Mode** - Random track playback
- **Volume Control** - With mute toggle

### ⌨️ Keyboard Shortcuts

- `Space` - Play/Pause
- `←/→` - Seek backward/forward 5 seconds
- `↑/↓` - Volume up/down
- `M` - Mute/Unmute
- `L` - Cycle loop mode
- `S` - Toggle shuffle
- `N`/`P` - Next/Previous track

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/auralsync.git
cd auralsync

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### First Use

1. **Drop Files**: Drag and drop audio files (MP3, FLAC, WAV) and subtitle files (SRT, VTT, LRC)
2. **Auto-Pair**: Files with matching names will automatically pair (e.g., `song.mp3` + `song.srt`)
3. **Play**: Click any track in the playlist to start
4. **Sync**: Use the +/- buttons if subtitles need adjustment
5. **Enjoy**: Click subtitle lines to seek, use keyboard shortcuts for control

## 🛠️ Tech Stack

| Technology                                      | Purpose                        |
| ----------------------------------------------- | ------------------------------ |
| [React 18](https://react.dev)                   | UI framework with modern hooks |
| [TypeScript](https://www.typescriptlang.org)    | Type-safe development          |
| [Vite](https://vitejs.dev)                      | Lightning-fast build tool      |
| [Tailwind CSS](https://tailwindcss.com)         | Utility-first styling          |
| [Framer Motion](https://www.framer.com/motion/) | Production-ready animations    |
| [WaveSurfer.js](https://wavesurfer-js.org/)     | Audio visualization            |
| [Zustand](https://zustand-demo.pmnd.rs/)        | Lightweight state management   |

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview

# Deploy the dist/ folder to any static host
```
