# Game Audio System

A comprehensive Web Audio API-based audio system for browser games with React and Zustand state management.

## Features

- 🎵 **Background Music**: Looping BGM with play/stop controls
- 🔊 **Sound Effects**: Support for flap, collision, and milestone sounds
- 🎚️ **Volume Controls**: Separate sliders for music and effects
- 🔇 **Global Mute**: Toggle to mute all audio
- 🌐 **Browser Compatible**: Gracefully handles browser audio restrictions
- 🎮 **Game Integration**: Easy-to-use hooks for gameplay events
- ✅ **Tested**: Unit tests for core audio functionality

## Installation

```bash
npm install
```

## Usage

### Basic Setup

The audio system initializes automatically when you use the `useGameAudio` hook:

```tsx
import { useGameAudio } from './hooks/useGameAudio';

function Game() {
  const { playFlap, playCollision, playMilestone, handleUserInteraction } = useGameAudio({
    bgmUrl: '/audio/bgm.mp3',
    flapUrl: '/audio/flap.mp3',
    collisionUrl: '/audio/collision.mp3',
    milestoneUrl: '/audio/milestone.mp3',
  });

  // Handle user interaction (required by browsers before audio playback)
  const handleStart = async () => {
    await handleUserInteraction();
    // Start game...
  };

  return (
    <div>
      <button onClick={handleStart}>Start Game</button>
      <button onClick={playFlap}>Flap</button>
    </div>
  );
}
```

### Audio Controls UI

Include the `AudioControls` component to provide users with volume and mute controls:

```tsx
import { AudioControls } from './components/AudioControls';

function App() {
  return (
    <div>
      <AudioControls />
      {/* Your game content */}
    </div>
  );
}
```

### Gameplay Integration

Hook audio cues into your gameplay events:

```tsx
// On flap input
const handleFlap = async () => {
  await playFlap();
  // Update game state...
};

// On scoring
const handleScore = async () => {
  await playMilestone();
  setScore(score + 1);
};

// On collision
const handleCollision = async () => {
  await playCollision();
  setGameOver(true);
};
```

## Architecture

### AudioManager

The core audio engine built on Web Audio API:

- Loads and manages audio buffers
- Handles background music playback
- Plays sound effects on demand
- Manages volume and mute state
- Gracefully handles browser restrictions

### Zustand Store

Global state management for audio settings:

```ts
{
  bgmVolume: number;      // 0-1
  sfxVolume: number;      // 0-1
  isMuted: boolean;
  isBgmPlaying: boolean;
  isInitialized: boolean;
}
```

### React Hook

`useGameAudio` hook provides a clean API for components:

- Automatic initialization
- User interaction handling
- Sound effect playback helpers
- Cleanup on unmount

## Browser Compatibility

The audio system gracefully handles browser autoplay restrictions:

1. Audio context is created but won't play until user interaction
2. Call `handleUserInteraction()` on first user click/tap
3. Audio will work normally after that
4. Falls back silently if audio is unavailable

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- AudioManager initialization and disposal
- Volume control and clamping
- Mute functionality
- Background music playback
- Sound effect playback
- Error handling
- Zustand store state management

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Audio File Requirements

Place your audio files in the `public/audio` directory:

- `bgm.mp3` - Background music (looping)
- `flap.mp3` - Flap/jump sound effect
- `collision.mp3` - Collision/death sound effect
- `milestone.mp3` - Score/achievement sound effect

Supported formats: MP3, WAV, OGG (browser-dependent)

## API Reference

### AudioManager

```ts
class AudioManager {
  initialize(config?: AudioManagerConfig): Promise<void>
  playBackgroundMusic(loop?: boolean): Promise<void>
  stopBackgroundMusic(): void
  toggleBackgroundMusic(): Promise<void>
  playSound(type: SoundType): Promise<void>
  setBgmVolume(volume: number): void
  setSfxVolume(volume: number): void
  setMuted(muted: boolean): void
  handleUserInteraction(): Promise<void>
  dispose(): void
}
```

### useGameAudio Hook

```ts
function useGameAudio(options?: UseGameAudioOptions): {
  handleUserInteraction: () => Promise<void>
  playFlap: () => Promise<void>
  playCollision: () => Promise<void>
  playMilestone: () => Promise<void>
  playSound: (type: SoundType) => Promise<void>
  isInitialized: boolean
}
```

### useAudioStore

```ts
interface AudioState {
  bgmVolume: number
  sfxVolume: number
  isMuted: boolean
  isBgmPlaying: boolean
  isInitialized: boolean
  setBgmVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  toggleBgm: () => Promise<void>
  setInitialized: (initialized: boolean) => void
}
```

## License

MIT
