import { create } from 'zustand';
import { GameState, GameConfig, Bird } from '../types/game';

interface GameStore extends GameState {
  config: GameConfig;
  actions: {
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    resetGame: () => void;
    jump: () => void;
    updatePhysics: (deltaTime: number) => void;
    updateConfig: (config: Partial<GameConfig>) => void;
    setCollision: (type: 'pipe' | 'ground' | 'ceiling') => void;
  };
}

const defaultConfig: GameConfig = {
  gravity: 980,
  jumpImpulse: -350,
  pipeSpeed: 150,
  pipeGap: 150,
  pipeWidth: 60,
  pipeInterval: 2000,
  backgroundSpeed: 30,
  groundSpeed: 120,
  birdRadius: 15,
  canvasWidth: 400,
  canvasHeight: 600,
};

const createInitialBird = (config: GameConfig): Bird => ({
  x: config.canvasWidth * 0.2,
  y: config.canvasHeight * 0.5,
  velocity: 0,
  rotation: 0,
  radius: config.birdRadius,
});

const createInitialState = (config: GameConfig): GameState => ({
  status: 'ready',
  score: 0,
  highScore: 0,
  bird: createInitialBird(config),
  pipes: [],
  backgroundOffset: 0,
  groundOffset: 0,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(defaultConfig),
  config: defaultConfig,

  actions: {
    startGame: () => set((state) => ({
      status: 'running',
      bird: createInitialBird(state.config),
      pipes: [],
      score: 0,
      backgroundOffset: 0,
      groundOffset: 0,
    })),

    pauseGame: () => set({ status: 'ready' }),

    resumeGame: () => set({ status: 'running' }),

    resetGame: () => set((state) => ({
      ...createInitialState(state.config),
      highScore: state.highScore,
    })),

    jump: () => set((state) => {
      if (state.status !== 'running') return state;
      
      return {
        bird: {
          ...state.bird,
          velocity: state.config.jumpImpulse,
        },
      };
    }),

    updatePhysics: (deltaTime: number) => {
      const state = get();
      if (state.status !== 'running') return;

      set((currentState) => {
        const { config, bird, pipes } = currentState;
        
        // Update bird physics
        const newVelocity = bird.velocity + config.gravity * deltaTime;
        const newY = bird.y + newVelocity * deltaTime;
        const newRotation = Math.min(Math.max(newVelocity * 0.05, -0.5), 0.5);
        
        const newBird = {
          ...bird,
          y: newY,
          velocity: newVelocity,
          rotation: newRotation,
        };

        // Update pipes
        const newPipes = pipes.map(pipe => ({
          ...pipe,
          x: pipe.x - config.pipeSpeed * deltaTime,
        })).filter(pipe => pipe.x > -config.pipeWidth);

        // Add new pipes
        const lastPipe = newPipes[newPipes.length - 1];
        if (!lastPipe || lastPipe.x < config.canvasWidth - config.pipeInterval) {
          const gapY = Math.random() * (config.canvasHeight - config.pipeGap - 100) + 50;
          newPipes.push({
            x: config.canvasWidth,
            gapY,
            gapHeight: config.pipeGap,
            width: config.pipeWidth,
            passed: false,
          });
        }

        // Update score
        let newScore = currentState.score;
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            newScore++;
          }
        });

        // Update offsets for parallax
        const newBackgroundOffset = (currentState.backgroundOffset + config.backgroundSpeed * deltaTime) % config.canvasWidth;
        const newGroundOffset = (currentState.groundOffset + config.groundSpeed * deltaTime) % config.canvasWidth;

        return {
          bird: newBird,
          pipes: newPipes,
          score: newScore,
          backgroundOffset: newBackgroundOffset,
          groundOffset: newGroundOffset,
          highScore: Math.max(currentState.highScore, newScore),
        };
      });
    },

    updateConfig: (newConfig) => set((state) => ({
      config: { ...state.config, ...newConfig },
    })),

    setCollision: (_type) => set((state) => {
      if (state.status !== 'running') return state;
      
      return {
        status: 'hit',
      };
    }),
  },
}));