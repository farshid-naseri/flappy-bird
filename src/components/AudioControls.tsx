import React from 'react';
import { useAudioStore } from '../store/audioStore';

export const AudioControls: React.FC = () => {
  const {
    bgmVolume,
    sfxVolume,
    isMuted,
    isBgmPlaying,
    setBgmVolume,
    setSfxVolume,
    setMuted,
    toggleBgm,
  } = useAudioStore();

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgmVolume(parseFloat(e.target.value));
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSfxVolume(parseFloat(e.target.value));
  };

  const handleMuteToggle = () => {
    setMuted(!isMuted);
  };

  const handleBgmToggle = async () => {
    await toggleBgm();
  };

  return (
    <div className="audio-controls">
      <div className="control-group">
        <label htmlFor="mute-toggle">
          <input
            id="mute-toggle"
            type="checkbox"
            checked={isMuted}
            onChange={handleMuteToggle}
          />
          Mute All
        </label>
      </div>

      <div className="control-group">
        <button
          onClick={handleBgmToggle}
          disabled={isMuted}
          className="bgm-toggle-button"
        >
          {isBgmPlaying ? 'Stop Music' : 'Play Music'}
        </button>
      </div>

      <div className="control-group">
        <label htmlFor="bgm-volume">
          Music Volume: {Math.round(bgmVolume * 100)}%
        </label>
        <input
          id="bgm-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bgmVolume}
          onChange={handleBgmVolumeChange}
          disabled={isMuted}
        />
      </div>

      <div className="control-group">
        <label htmlFor="sfx-volume">
          Effects Volume: {Math.round(sfxVolume * 100)}%
        </label>
        <input
          id="sfx-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
          disabled={isMuted}
        />
      </div>
    </div>
  );
};
