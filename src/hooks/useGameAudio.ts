import { useEffect, useCallback } from 'react';
import { audioManager, type SoundType } from '../audio/AudioManager';
import { useAudioStore } from '../store/audioStore';

export interface UseGameAudioOptions {
  autoInitialize?: boolean;
  bgmUrl?: string;
  flapUrl?: string;
  collisionUrl?: string;
  milestoneUrl?: string;
}

export function useGameAudio(options: UseGameAudioOptions = {}) {
  const {
    autoInitialize = true,
    bgmUrl = '/audio/bgm.wav',
    flapUrl = '/audio/flap.wav',
    collisionUrl = '/audio/collision.wav',
    milestoneUrl = '/audio/milestone.wav',
  } = options;

  const { isInitialized, setInitialized } = useAudioStore();

  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      audioManager.initialize({
        bgmUrl,
        flapUrl,
        collisionUrl,
        milestoneUrl,
      }).then(() => {
        setInitialized(true);
      }).catch((error) => {
        console.error('Failed to initialize audio:', error);
      });
    }

    return () => {
      if (isInitialized) {
        audioManager.dispose();
        setInitialized(false);
      }
    };
  }, [autoInitialize, bgmUrl, flapUrl, collisionUrl, milestoneUrl, isInitialized, setInitialized]);

  const handleUserInteraction = useCallback(async () => {
    await audioManager.handleUserInteraction();
  }, []);

  const playSound = useCallback(async (type: SoundType) => {
    await audioManager.playSound(type);
  }, []);

  const playFlap = useCallback(async () => {
    await playSound('flap');
  }, [playSound]);

  const playCollision = useCallback(async () => {
    await playSound('collision');
  }, [playSound]);

  const playMilestone = useCallback(async () => {
    await playSound('milestone');
  }, [playSound]);

  return {
    handleUserInteraction,
    playFlap,
    playCollision,
    playMilestone,
    playSound,
    isInitialized,
  };
}
