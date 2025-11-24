import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioManager } from './AudioManager';

class MockAudioContext {
  state = 'running';
  destination = {};
  sampleRate = 44100;

  createGain() {
    return {
      connect: vi.fn(),
      gain: { value: 1 },
    };
  }

  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null,
    };
  }

  createBuffer(channels: number, length: number, sampleRate: number) {
    return { channels, length, sampleRate };
  }

  async decodeAudioData() {
    return this.createBuffer(1, 1000, 44100);
  }

  async resume() {
    this.state = 'running';
  }

  async close() {
    this.state = 'closed';
  }
}

global.AudioContext = MockAudioContext as any;
(global as any).webkitAudioContext = MockAudioContext;

global.fetch = vi.fn((url: string) => {
  return Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  } as Response);
});

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    audioManager = new AudioManager();
    vi.clearAllMocks();
  });

  afterEach(() => {
    audioManager.dispose();
  });

  it('should initialize successfully', async () => {
    await audioManager.initialize();
    expect(audioManager.getBgmVolume()).toBe(0.5);
    expect(audioManager.getSfxVolume()).toBe(0.7);
  });

  it('should load audio assets', async () => {
    await audioManager.initialize({
      bgmUrl: '/test-bgm.mp3',
      flapUrl: '/test-flap.mp3',
      collisionUrl: '/test-collision.mp3',
      milestoneUrl: '/test-milestone.mp3',
    });

    expect(global.fetch).toHaveBeenCalledWith('/test-bgm.mp3');
    expect(global.fetch).toHaveBeenCalledWith('/test-flap.mp3');
    expect(global.fetch).toHaveBeenCalledWith('/test-collision.mp3');
    expect(global.fetch).toHaveBeenCalledWith('/test-milestone.mp3');
  });

  it('should set BGM volume', async () => {
    await audioManager.initialize();
    audioManager.setBgmVolume(0.8);
    expect(audioManager.getBgmVolume()).toBe(0.8);
  });

  it('should clamp BGM volume between 0 and 1', async () => {
    await audioManager.initialize();
    audioManager.setBgmVolume(1.5);
    expect(audioManager.getBgmVolume()).toBe(1);
    audioManager.setBgmVolume(-0.5);
    expect(audioManager.getBgmVolume()).toBe(0);
  });

  it('should set SFX volume', async () => {
    await audioManager.initialize();
    audioManager.setSfxVolume(0.3);
    expect(audioManager.getSfxVolume()).toBe(0.3);
  });

  it('should clamp SFX volume between 0 and 1', async () => {
    await audioManager.initialize();
    audioManager.setSfxVolume(2.0);
    expect(audioManager.getSfxVolume()).toBe(1);
    audioManager.setSfxVolume(-1.0);
    expect(audioManager.getSfxVolume()).toBe(0);
  });

  it('should set muted state', async () => {
    await audioManager.initialize();
    expect(audioManager.getMuted()).toBe(false);
    audioManager.setMuted(true);
    expect(audioManager.getMuted()).toBe(true);
  });

  it('should stop BGM when muted', async () => {
    await audioManager.initialize({ bgmUrl: '/test-bgm.mp3' });
    await audioManager.playBackgroundMusic();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(true);
    audioManager.setMuted(true);
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(false);
  });

  it('should not play BGM when muted', async () => {
    await audioManager.initialize({ bgmUrl: '/test-bgm.mp3' });
    audioManager.setMuted(true);
    await audioManager.playBackgroundMusic();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(false);
  });

  it('should not play sound effects when muted', async () => {
    await audioManager.initialize({ flapUrl: '/test-flap.mp3' });
    audioManager.setMuted(true);
    await expect(audioManager.playSound('flap')).resolves.toBeUndefined();
  });

  it('should toggle background music', async () => {
    await audioManager.initialize({ bgmUrl: '/test-bgm.mp3' });
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(false);
    await audioManager.toggleBackgroundMusic();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(true);
    await audioManager.toggleBackgroundMusic();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(false);
  });

  it('should handle user interaction', async () => {
    await audioManager.initialize();
    await expect(audioManager.handleUserInteraction()).resolves.toBeUndefined();
  });

  it('should handle initialization errors gracefully', async () => {
    const originalAudioContext = global.AudioContext;
    global.AudioContext = undefined as any;
    (global as any).webkitAudioContext = undefined;

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    await audioManager.initialize();
    
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
    global.AudioContext = originalAudioContext;
  });

  it('should handle fetch errors gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    await audioManager.initialize({ bgmUrl: '/nonexistent.mp3' });
    
    expect(consoleWarnSpy).toHaveBeenCalled();
    
    consoleWarnSpy.mockRestore();
  });

  it('should dispose resources properly', async () => {
    await audioManager.initialize({ bgmUrl: '/test-bgm.mp3' });
    await audioManager.playBackgroundMusic();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(true);
    audioManager.dispose();
    expect(audioManager.isBgmCurrentlyPlaying()).toBe(false);
  });
});
