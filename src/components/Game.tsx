import React, { useEffect, useCallback, useState } from 'react';
import { useGameAudio } from '../hooks/useGameAudio';
import { AudioControls } from './AudioControls';

export const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const {
    handleUserInteraction,
    playFlap,
    playCollision,
    playMilestone,
    isInitialized,
  } = useGameAudio();

  const handleStart = useCallback(async () => {
    if (!userInteracted) {
      await handleUserInteraction();
      setUserInteracted(true);
    }
    setIsPlaying(true);
    setScore(0);
  }, [handleUserInteraction, userInteracted]);

  const handleFlap = useCallback(async () => {
    if (!isPlaying) return;
    await playFlap();
  }, [isPlaying, playFlap]);

  const handleScoreMilestone = useCallback(async () => {
    if (!isPlaying) return;
    const newScore = score + 1;
    setScore(newScore);
    await playMilestone();
  }, [isPlaying, score, playMilestone]);

  const handleCollision = useCallback(async () => {
    if (!isPlaying) return;
    await playCollision();
    setIsPlaying(false);
  }, [isPlaying, playCollision]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlap();
      }
    };

    if (isPlaying) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleFlap]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Game Audio Demo</h1>
        <div className="score">Score: {score}</div>
      </div>

      <AudioControls />

      <div className="game-area">
        {!isPlaying ? (
          <button
            onClick={handleStart}
            className="start-button"
            disabled={!isInitialized}
          >
            {isInitialized ? 'Start Game' : 'Loading...'}
          </button>
        ) : (
          <div className="game-controls">
            <p>Press SPACE or click to flap</p>
            <button onClick={handleFlap} className="action-button">
              Flap (plays flap sound)
            </button>
            <button onClick={handleScoreMilestone} className="action-button">
              Score Point (plays milestone sound)
            </button>
            <button onClick={handleCollision} className="action-button danger">
              Collision (plays collision sound & ends game)
            </button>
          </div>
        )}
      </div>

      <div className="instructions">
        <h3>Audio System Features:</h3>
        <ul>
          <li>Background music with toggle control</li>
          <li>Separate volume controls for music and effects</li>
          <li>Flap, collision, and milestone sound effects</li>
          <li>Global mute functionality</li>
          <li>Graceful handling of browser audio restrictions</li>
        </ul>
      </div>
    </div>
  );
};
