import { create } from 'zustand';
import { audioManager } from '../audio/AudioManager';

export interface AudioState {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  isBgmPlaying: boolean;
  isInitialized: boolean;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleBgm: () => Promise<void>;
  setInitialized: (initialized: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  bgmVolume: 0.5,
  sfxVolume: 0.7,
  isMuted: false,
  isBgmPlaying: false,
  isInitialized: false,

  setBgmVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioManager.setBgmVolume(clampedVolume);
    set({ bgmVolume: clampedVolume });
  },

  setSfxVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioManager.setSfxVolume(clampedVolume);
    set({ sfxVolume: clampedVolume });
  },

  setMuted: (muted: boolean) => {
    audioManager.setMuted(muted);
    set({ isMuted: muted, isBgmPlaying: muted ? false : audioManager.isBgmCurrentlyPlaying() });
  },

  toggleBgm: async () => {
    const { isMuted } = get();
    if (isMuted) return;

    await audioManager.toggleBackgroundMusic();
    set({ isBgmPlaying: audioManager.isBgmCurrentlyPlaying() });
  },

  setInitialized: (initialized: boolean) => {
    set({ isInitialized: initialized });
  },
}));
