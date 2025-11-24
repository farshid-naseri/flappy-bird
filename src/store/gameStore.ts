import { create } from "zustand";

export type GamePhase = "menu" | "playing" | "paused" | "gameOver";
export type Difficulty = "easy" | "medium" | "hard";

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export interface DifficultyParams {
  gapSize: number;
  pipeSpeed: number;
  gravity: number;
  flapForce: number;
}

export interface GameState {
  gamePhase: GamePhase;
  difficulty: Difficulty;
  audioSettings: AudioSettings;
  score: number;
  highScore: number;
  milestones: number[];
  isHydrated: boolean;
  
  setGamePhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setHighScore: (score: number) => void;
  updateHighScoreIfNeeded: (score: number) => void;
  resetGame: () => void;
  hydrate: () => void;
  getDifficultyParams: () => DifficultyParams;
}

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  muted: false,
};

const HIGH_SCORE_STORAGE_KEY = "flappy_bird_high_score";

export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyParams> = {
  easy: {
    gapSize: 120,
    pipeSpeed: 3,
    gravity: 0.4,
    flapForce: 8,
  },
  medium: {
    gapSize: 100,
    pipeSpeed: 4.5,
    gravity: 0.5,
    flapForce: 7,
  },
  hard: {
    gapSize: 80,
    pipeSpeed: 6,
    gravity: 0.6,
    flapForce: 6,
  },
};

const loadHighScoreFromStorage = (): number => {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    if (!stored) return 0;
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  } catch {
    return 0;
  }
};

const saveHighScoreToStorage = (score: number): void => {
  try {
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(Math.max(0, score)));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  gamePhase: "menu",
  difficulty: "medium",
  audioSettings: DEFAULT_AUDIO_SETTINGS,
  score: 0,
  highScore: 0,
  milestones: [10, 25, 50, 100],
  isHydrated: false,

  setGamePhase: (phase) => set({ gamePhase: phase }),
  setDifficulty: (difficulty) => set({ difficulty }),
  updateAudioSettings: (settings) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings },
    })),
  setScore: (score) => set({ score }),
  addScore: (points) => {
    set((state) => ({ score: state.score + points }));
  },
  setHighScore: (score) => {
    const validScore = Math.max(0, score);
    saveHighScoreToStorage(validScore);
    set({ highScore: validScore });
  },
  updateHighScoreIfNeeded: (score) => {
    const state = get();
    if (score > state.highScore) {
      get().setHighScore(score);
    }
  },
  resetGame: () => set({ score: 0, gamePhase: "menu" }),
  hydrate: () => {
    const highScore = loadHighScoreFromStorage();
    set({ highScore, isHydrated: true });
  },
  getDifficultyParams: () => {
    const state = get();
    return DIFFICULTY_PRESETS[state.difficulty];
  },
}));
