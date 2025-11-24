import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioStore } from './audioStore';
import { audioManager } from '../audio/AudioManager';

vi.mock('../audio/AudioManager', () => ({
  audioManager: {
    setBgmVolume: vi.fn(),
    setSfxVolume: vi.fn(),
    setMuted: vi.fn(),
    toggleBackgroundMusic: vi.fn(),
    isBgmCurrentlyPlaying: vi.fn(() => false),
  },
}));

describe('audioStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAudioStore.setState({
      bgmVolume: 0.5,
      sfxVolume: 0.7,
      isMuted: false,
      isBgmPlaying: false,
      isInitialized: false,
    });
  });

  it('should have initial state', () => {
    const state = useAudioStore.getState();
    expect(state.bgmVolume).toBe(0.5);
    expect(state.sfxVolume).toBe(0.7);
    expect(state.isMuted).toBe(false);
    expect(state.isBgmPlaying).toBe(false);
    expect(state.isInitialized).toBe(false);
  });

  it('should set BGM volume', () => {
    const { setBgmVolume } = useAudioStore.getState();
    setBgmVolume(0.8);
    
    expect(audioManager.setBgmVolume).toHaveBeenCalledWith(0.8);
    expect(useAudioStore.getState().bgmVolume).toBe(0.8);
  });

  it('should clamp BGM volume', () => {
    const { setBgmVolume } = useAudioStore.getState();
    
    setBgmVolume(1.5);
    expect(useAudioStore.getState().bgmVolume).toBe(1);
    
    setBgmVolume(-0.5);
    expect(useAudioStore.getState().bgmVolume).toBe(0);
  });

  it('should set SFX volume', () => {
    const { setSfxVolume } = useAudioStore.getState();
    setSfxVolume(0.3);
    
    expect(audioManager.setSfxVolume).toHaveBeenCalledWith(0.3);
    expect(useAudioStore.getState().sfxVolume).toBe(0.3);
  });

  it('should clamp SFX volume', () => {
    const { setSfxVolume } = useAudioStore.getState();
    
    setSfxVolume(2.0);
    expect(useAudioStore.getState().sfxVolume).toBe(1);
    
    setSfxVolume(-1.0);
    expect(useAudioStore.getState().sfxVolume).toBe(0);
  });

  it('should set muted state', () => {
    const { setMuted } = useAudioStore.getState();
    setMuted(true);
    
    expect(audioManager.setMuted).toHaveBeenCalledWith(true);
    expect(useAudioStore.getState().isMuted).toBe(true);
  });

  it('should toggle BGM', async () => {
    const { toggleBgm } = useAudioStore.getState();
    await toggleBgm();
    
    expect(audioManager.toggleBackgroundMusic).toHaveBeenCalled();
  });

  it('should not toggle BGM when muted', async () => {
    useAudioStore.setState({ isMuted: true });
    const { toggleBgm } = useAudioStore.getState();
    await toggleBgm();
    
    expect(audioManager.toggleBackgroundMusic).not.toHaveBeenCalled();
  });

  it('should set initialized state', () => {
    const { setInitialized } = useAudioStore.getState();
    setInitialized(true);
    
    expect(useAudioStore.getState().isInitialized).toBe(true);
  });
});
