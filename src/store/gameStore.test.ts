import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore, DIFFICULTY_PRESETS } from "./gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    localStorage.clear();
    const state = useGameStore.getState();
    state.resetGame();
    state.setHighScore(0);
    useGameStore.setState({ isHydrated: false });
  });

  describe("Score Management", () => {
    it("should initialize score to 0", () => {
      const { score } = useGameStore.getState();
      expect(score).toBe(0);
    });

    it("should set score", () => {
      const { setScore } = useGameStore.getState();
      setScore(10);
      expect(useGameStore.getState().score).toBe(10);
    });

    it("should add points to score", () => {
      const { setScore, addScore } = useGameStore.getState();
      setScore(5);
      addScore(3);
      expect(useGameStore.getState().score).toBe(8);
    });

    it("should update high score when current score exceeds it", () => {
      const { setScore, updateHighScoreIfNeeded } = useGameStore.getState();
      setScore(100);
      updateHighScoreIfNeeded(100);
      expect(useGameStore.getState().highScore).toBe(100);
    });

    it("should not update high score when current score is lower", () => {
      const { setHighScore, updateHighScoreIfNeeded } = useGameStore.getState();
      setHighScore(100);
      updateHighScoreIfNeeded(50);
      expect(useGameStore.getState().highScore).toBe(100);
    });
  });

  describe("High Score Persistence", () => {
    it("should persist high score to localStorage", () => {
      const { setHighScore } = useGameStore.getState();
      setHighScore(150);
      expect(localStorage.getItem("flappy_bird_high_score")).toBe("150");
    });

    it("should load high score from localStorage on hydrate", () => {
      localStorage.setItem("flappy_bird_high_score", "200");
      const { hydrate } = useGameStore.getState();
      hydrate();
      expect(useGameStore.getState().highScore).toBe(200);
    });

    it("should handle invalid localStorage data", () => {
      localStorage.setItem("flappy_bird_high_score", "invalid");
      const { hydrate } = useGameStore.getState();
      hydrate();
      expect(useGameStore.getState().highScore).toBe(0);
    });

    it("should handle negative scores in localStorage", () => {
      localStorage.setItem("flappy_bird_high_score", "-10");
      const { hydrate } = useGameStore.getState();
      hydrate();
      expect(useGameStore.getState().highScore).toBe(0);
    });

    it("should handle empty localStorage", () => {
      const { hydrate } = useGameStore.getState();
      hydrate();
      expect(useGameStore.getState().highScore).toBe(0);
    });

    it("should set isHydrated flag after hydration", () => {
      const { hydrate, isHydrated } = useGameStore.getState();
      expect(isHydrated).toBe(false);
      hydrate();
      expect(useGameStore.getState().isHydrated).toBe(true);
    });
  });

  describe("Difficulty Parameter Mapping", () => {
    it("should have correct easy difficulty parameters", () => {
      const params = DIFFICULTY_PRESETS.easy;
      expect(params.gapSize).toBe(150);
      expect(params.pipeSpeed).toBe(3);
      expect(params.gravity).toBe(0.4);
      expect(params.flapForce).toBe(8);
    });

    it("should have correct medium difficulty parameters", () => {
      const params = DIFFICULTY_PRESETS.medium;
      expect(params.gapSize).toBe(120);
      expect(params.pipeSpeed).toBe(4);
      expect(params.gravity).toBe(0.5);
      expect(params.flapForce).toBe(7);
    });

    it("should have correct hard difficulty parameters", () => {
      const params = DIFFICULTY_PRESETS.hard;
      expect(params.gapSize).toBe(100);
      expect(params.pipeSpeed).toBe(5);
      expect(params.gravity).toBe(0.6);
      expect(params.flapForce).toBe(6);
    });

    it("should return correct params for current difficulty", () => {
      const { setDifficulty, getDifficultyParams } = useGameStore.getState();
      
      setDifficulty("easy");
      expect(getDifficultyParams()).toEqual(DIFFICULTY_PRESETS.easy);
      
      setDifficulty("medium");
      expect(getDifficultyParams()).toEqual(DIFFICULTY_PRESETS.medium);
      
      setDifficulty("hard");
      expect(getDifficultyParams()).toEqual(DIFFICULTY_PRESETS.hard);
    });

    it("should maintain difficulty when game phase changes", () => {
      const { setDifficulty, setGamePhase } = useGameStore.getState();
      
      setDifficulty("hard");
      setGamePhase("playing");
      expect(useGameStore.getState().difficulty).toBe("hard");
      
      setGamePhase("paused");
      expect(useGameStore.getState().difficulty).toBe("hard");
    });
  });

  describe("Game Reset", () => {
    it("should reset score to 0", () => {
      const { setScore, resetGame } = useGameStore.getState();
      setScore(50);
      resetGame();
      expect(useGameStore.getState().score).toBe(0);
    });

    it("should set game phase to menu", () => {
      const { setGamePhase, resetGame } = useGameStore.getState();
      setGamePhase("playing");
      resetGame();
      expect(useGameStore.getState().gamePhase).toBe("menu");
    });

    it("should not reset high score", () => {
      const { setHighScore, resetGame } = useGameStore.getState();
      setHighScore(100);
      resetGame();
      expect(useGameStore.getState().highScore).toBe(100);
    });
  });

  describe("Milestones", () => {
    it("should have default milestones", () => {
      const { milestones } = useGameStore.getState();
      expect(milestones).toEqual([10, 25, 50, 100]);
    });
  });

  describe("Game Phase", () => {
    it("should set game phase", () => {
      const { setGamePhase } = useGameStore.getState();
      setGamePhase("playing");
      expect(useGameStore.getState().gamePhase).toBe("playing");
    });

    it("should transition through game phases", () => {
      const { setGamePhase } = useGameStore.getState();
      
      setGamePhase("menu");
      expect(useGameStore.getState().gamePhase).toBe("menu");
      
      setGamePhase("playing");
      expect(useGameStore.getState().gamePhase).toBe("playing");
      
      setGamePhase("paused");
      expect(useGameStore.getState().gamePhase).toBe("paused");
      
      setGamePhase("gameOver");
      expect(useGameStore.getState().gamePhase).toBe("gameOver");
    });
  });
});
