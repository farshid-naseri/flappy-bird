import { create } from "zustand";

export type GamePhase = "menu" | "playing" | "paused" | "gameOver";
export type Difficulty = "easy" | "medium" | "hard";

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
}

export interface GameState {
  gamePhase: GamePhase;
  difficulty: Difficulty;
  audioSettings: AudioSettings;
  score: number;
  highScore: number;
  
  setGamePhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  resetGame: () => void;
}

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  muted: false,
};

export const useGameStore = create<GameState>((set) => ({
  gamePhase: "menu",
  difficulty: "medium",
  audioSettings: DEFAULT_AUDIO_SETTINGS,
  score: 0,
  highScore: 0,

  setGamePhase: (phase) => set({ gamePhase: phase }),
  setDifficulty: (difficulty) => set({ difficulty }),
  updateAudioSettings: (settings) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings },
    })),
  setScore: (score) => set({ score }),
  setHighScore: (score) => set({ highScore: score }),
  resetGame: () => set({ score: 0, gamePhase: "menu" }),
}));
