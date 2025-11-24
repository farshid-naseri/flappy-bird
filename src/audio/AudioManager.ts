export type SoundType = 'flap' | 'collision' | 'milestone';

export interface AudioManagerConfig {
  bgmUrl?: string;
  flapUrl?: string;
  collisionUrl?: string;
  milestoneUrl?: string;
}

export class AudioManager {
  private context: AudioContext | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private soundBuffers: Map<SoundType, AudioBuffer> = new Map();
  private isInitialized = false;
  private isBgmPlaying = false;
  private bgmVolume = 0.5;
  private sfxVolume = 0.7;
  private isMuted = false;
  private userInteractionReceived = false;

  async initialize(config: AudioManagerConfig = {}): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.context = new AudioContextConstructor();
      
      this.bgmGainNode = this.context.createGain();
      this.bgmGainNode.connect(this.context.destination);
      this.bgmGainNode.gain.value = this.bgmVolume;

      this.sfxGainNode = this.context.createGain();
      this.sfxGainNode.connect(this.context.destination);
      this.sfxGainNode.gain.value = this.sfxVolume;

      await this.loadAudioAssets(config);
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize AudioManager:', error);
    }
  }

  private async loadAudioAssets(config: AudioManagerConfig): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    if (config.bgmUrl) {
      loadPromises.push(this.loadBackgroundMusic(config.bgmUrl));
    }

    if (config.flapUrl) {
      loadPromises.push(this.loadSound('flap', config.flapUrl));
    }

    if (config.collisionUrl) {
      loadPromises.push(this.loadSound('collision', config.collisionUrl));
    }

    if (config.milestoneUrl) {
      loadPromises.push(this.loadSound('milestone', config.milestoneUrl));
    }

    await Promise.allSettled(loadPromises);
  }

  private async loadBackgroundMusic(url: string): Promise<void> {
    if (!this.context) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.bgmBuffer = await this.context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to load background music from ${url}:`, error);
    }
  }

  private async loadSound(type: SoundType, url: string): Promise<void> {
    if (!this.context) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await this.context.decodeAudioData(arrayBuffer);
      this.soundBuffers.set(type, buffer);
    } catch (error) {
      console.warn(`Failed to load sound ${type} from ${url}:`, error);
    }
  }

  private async resumeContextIfNeeded(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  async handleUserInteraction(): Promise<void> {
    if (this.userInteractionReceived) return;
    
    this.userInteractionReceived = true;
    await this.resumeContextIfNeeded();
  }

  async playBackgroundMusic(loop = true): Promise<void> {
    if (!this.isInitialized || !this.context || !this.bgmBuffer || this.isMuted) {
      return;
    }

    await this.resumeContextIfNeeded();

    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
    }

    try {
      this.bgmSource = this.context.createBufferSource();
      this.bgmSource.buffer = this.bgmBuffer;
      this.bgmSource.loop = loop;
      
      if (this.bgmGainNode) {
        this.bgmSource.connect(this.bgmGainNode);
      }
      
      this.bgmSource.start(0);
      this.isBgmPlaying = true;

      this.bgmSource.onended = () => {
        if (!this.bgmSource?.loop) {
          this.isBgmPlaying = false;
        }
      };
    } catch (error) {
      console.warn('Failed to play background music:', error);
      this.isBgmPlaying = false;
    }
  }

  stopBackgroundMusic(): void {
    if (this.bgmSource && this.isBgmPlaying) {
      try {
        this.bgmSource.stop();
      } catch (error) {
        console.warn('Failed to stop background music:', error);
      }
      this.bgmSource = null;
      this.isBgmPlaying = false;
    }
  }

  async toggleBackgroundMusic(): Promise<void> {
    if (this.isBgmPlaying) {
      this.stopBackgroundMusic();
    } else {
      await this.playBackgroundMusic();
    }
  }

  async playSound(type: SoundType): Promise<void> {
    if (!this.isInitialized || !this.context || !this.sfxGainNode || this.isMuted) {
      return;
    }

    await this.resumeContextIfNeeded();

    const buffer = this.soundBuffers.get(type);
    if (!buffer) {
      return;
    }

    try {
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.sfxGainNode);
      source.start(0);
    } catch (error) {
      console.warn(`Failed to play sound ${type}:`, error);
    }
  }

  setBgmVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = this.bgmVolume;
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBackgroundMusic();
    }
  }

  getBgmVolume(): number {
    return this.bgmVolume;
  }

  getSfxVolume(): number {
    return this.sfxVolume;
  }

  isBgmCurrentlyPlaying(): boolean {
    return this.isBgmPlaying;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  dispose(): void {
    this.stopBackgroundMusic();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.soundBuffers.clear();
    this.isInitialized = false;
  }
}

export const audioManager = new AudioManager();
