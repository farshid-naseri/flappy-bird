import { useRef, useCallback } from "react";
import { useGameStore } from "../store/gameStore";
import { audioManager } from "../audio/AudioManager";

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  gapSize: number;
  passed: boolean;
}

export interface GameEngineState {
  bird: Bird;
  pipes: Pipe[];
  lastPipeX: number;
}

const PIPE_WIDTH = 60;
const PIPE_SPACING = 200;
const BIRD_X = 100;

export function useGameEngine() {
  const { gamePhase, getDifficultyParams, addScore, setGamePhase } = useGameStore();
  const stateRef = useRef<GameEngineState>({
    bird: { x: BIRD_X, y: 300, velocity: 0, radius: 15 },
    pipes: [],
    lastPipeX: 400,
  });

  const resetGame = useCallback(() => {
    stateRef.current = {
      bird: { x: BIRD_X, y: 300, velocity: 0, radius: 15 },
      pipes: [],
      lastPipeX: 400,
    };
  }, []);

  const flap = useCallback(() => {
    const { flapForce } = getDifficultyParams();
    stateRef.current.bird.velocity = -flapForce;
    audioManager.playSound("flap").catch(() => {});
  }, [getDifficultyParams]);

  const update = useCallback(
    (delta: number, canvasWidth: number, canvasHeight: number) => {
      if (gamePhase !== "playing") return stateRef.current;

      const state = stateRef.current;
      const params = getDifficultyParams();
      const timeScale = delta * 0.06;

      state.bird.velocity += params.gravity * timeScale;
      state.bird.y += state.bird.velocity * timeScale;

      if (state.bird.y < state.bird.radius) {
        state.bird.y = state.bird.radius;
        state.bird.velocity = 0;
      }

      if (state.bird.y > canvasHeight - state.bird.radius) {
        audioManager.playSound("collision").catch(() => {});
        setGamePhase("gameOver");
        return state;
      }

      state.pipes = state.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -50);

      if (state.lastPipeX < canvasWidth || state.pipes.length === 0) {
        const newPipe: Pipe = {
          x: state.lastPipeX,
          gapY: 100 + Math.random() * (canvasHeight - 300),
          gapSize: params.gapSize,
          passed: false,
        };
        state.pipes.push(newPipe);
        state.lastPipeX += PIPE_SPACING;
      }

      state.pipes.forEach((pipe) => {
        pipe.x -= params.pipeSpeed * timeScale;

        if (!pipe.passed && pipe.x + PIPE_WIDTH < state.bird.x - state.bird.radius) {
          pipe.passed = true;
          addScore(1);
        }

        const birdLeft = state.bird.x - state.bird.radius;
        const birdRight = state.bird.x + state.bird.radius;
        const birdTop = state.bird.y - state.bird.radius;
        const birdBottom = state.bird.y + state.bird.radius;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;

        const isInPipeX = birdRight > pipeLeft && birdLeft < pipeRight;

        if (isInPipeX) {
          const gapTop = pipe.gapY;
          const gapBottom = pipe.gapY + pipe.gapSize;

          if (birdTop < gapTop || birdBottom > gapBottom) {
            audioManager.playSound("collision").catch(() => {});
            setGamePhase("gameOver");
          }
        }
      });

      return state;
    },
    [gamePhase, getDifficultyParams, addScore, setGamePhase]
  );

  return {
    state: stateRef.current,
    update,
    flap,
    resetGame,
  };
}
