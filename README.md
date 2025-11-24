# Flappy Bird Game

A Flappy Bird game implementation built with React, TypeScript, and Canvas API.

## Features

### Core Gameplay
- **Canvas-based rendering** with smooth 60fps animations
- **Bird physics** with gravity, flap impulse, and rotation based on velocity
- **Pipe generation** with randomized gaps and consistent spacing
- **Parallax scrolling** background layers (clouds and ground)
- **Delta-time animations** for frame-independent gameplay

### Collision Detection
- **Precise AABB/circle collision** between bird and pipes
- **Boundary collision** with ground and ceiling
- **Visual feedback** with flash effect on collision
- **State transitions**: ready → running → hit → game over

### Game State Management
- **Zustand store** for centralized state management
- **Configurable physics parameters** (gravity, jump impulse, pipe speed, etc.)
- **Score tracking** with high score persistence
- **Game control actions** (start, pause, resume, reset)

### Controls
- **Space bar** or **click** to flap/jump
- **Click to start** and **click to restart** functionality

## Technical Implementation

### Architecture
- **Component-based** React architecture
- **TypeScript** for type safety
- **Canvas API** for game rendering
- **Zustand** for state management
- **Vite** for build tooling

### Key Files
- `src/components/CanvasGame.tsx` - Main game component with render loop
- `src/stores/gameStore.ts` - Zustand store for game state
- `src/utils/gamePhysics.ts` - Physics calculations and collision detection
- `src/types/game.ts` - TypeScript type definitions

### Physics
- **Gravity**: 980 pixels/second²
- **Jump impulse**: -350 pixels/second  
- **Pipe speed**: 150 pixels/second
- **Bird rotation**: Based on velocity (-0.5 to 0.5 radians)

## Testing

Unit tests are included for key utility functions:

```bash
npm test
```

Tests cover:
- Collision detection algorithms
- Physics calculations
- Pipe gap generation
- Boundary checks

## Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm start
```

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Game Configuration

The game supports configurable parameters that can be adjusted per difficulty:

```typescript
interface GameConfig {
  gravity: number;        // Gravity strength
  jumpImpulse: number;    // Jump/flap strength
  pipeSpeed: number;      // Speed of pipes
  pipeGap: number;        // Size of gap between pipes
  pipeWidth: number;      // Width of pipes
  pipeInterval: number;   // Distance between pipes
  backgroundSpeed: number; // Parallax background speed
  groundSpeed: number;    // Ground scrolling speed
  birdRadius: number;     // Bird size
  canvasWidth: number;    // Game canvas width
  canvasHeight: number;   // Game canvas height
}
```

## Performance

- **Frame-independent** animations using delta time
- **Efficient collision detection** with early exit optimization
- **Optimized rendering** with minimal canvas operations
- **Smooth 60fps** gameplay on modern browsers

## Browser Support

- Modern browsers with Canvas API support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+