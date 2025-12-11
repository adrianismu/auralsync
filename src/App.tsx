import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { PlayerLayout } from '@/components/PlayerLayout';
import { DynamicBackground } from '@/components/DynamicBackground';

function App() {
  const { togglePlay, seek } = useAudioPlayer();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts(togglePlay, seek);

  return (
    <div className="relative">
      <DynamicBackground />
      <PlayerLayout />
    </div>
  );
}

export default App;
