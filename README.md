# Game Project

A modern game built with React 19, TypeScript, Tailwind CSS 4, and Zustand.

## Tech Stack

- **React 19** – Latest version with concurrent features
- **TypeScript** – Strict type checking for better DX
- **Vite** – Fast build tooling and HMR
- **Tailwind CSS 4** – Next-gen utility-first CSS framework
- **Zustand** – Lightweight state management
- **ESLint** – Linting with TypeScript support
- **Vitest** – Fast unit testing

## Project Structure

```
src/
├── assets/           # Sprites, audio, and other assets
│   ├── sprites/
│   └── audio/
├── components/
│   ├── layout/       # Layout components (TopHUD, SidePanel, GameLayout)
│   └── ui/           # UI controls (AudioControls, GamePhaseControls)
├── hooks/            # Custom React hooks (useAnimationFrame, useInput, useKeyboard)
├── store/            # Zustand stores (gameStore)
├── App.tsx           # Main app component
├── main.tsx          # React entry point
└── index.css         # Global styles with Tailwind imports
```

## Features

### Layout
- **Top HUD**: Displays score, high score, difficulty, and game phase
- **Canvas Playfield**: Main game area with responsive canvas rendering
- **Side Panels**: Left and right panels for controls and information

### State Management (Zustand)
- Game phase (menu, playing, paused, gameOver)
- Difficulty levels (easy, medium, hard)
- Audio settings (master, music, SFX volumes + mute toggle)
- Score tracking

### Utility Hooks
- `useAnimationFrame`: Request animation frame with delta time
- `useInput`: Unified keyboard and pointer input tracking
- `useKeyboard`: Simple keyboard event handling

### Tailwind Theme
Custom color tokens and gradients for parallax layers:
- Color palette with OKLCH for better perceptual uniformity
- Background gradients for sky, hills, and foreground parallax
- HUD styling with backdrop blur and shadows

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linter
npm run lint
```

## Development

- Interactive demo in canvas: stars scroll, respond to arrow keys and pointer input
- Modify game state via UI controls in side panels
- All state persists in Zustand store
- Canvas uses `requestAnimationFrame` for smooth rendering

## Next Steps

- Implement actual game logic
- Add sprite rendering system
- Integrate audio playback
- Implement collision detection
- Add parallax background layers
- Create game entities (player, obstacles, collectibles)
