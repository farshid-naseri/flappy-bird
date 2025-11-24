import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { useGameStore, DIFFICULTY_PRESETS } from "./gameStore";

describe("game store", () => {
  beforeEach(() => {
    useGameStore.setState({
      score: 0,
      highScore: 0,
      difficulty: "medium",
      gamePhase: "menu",
      isHydrated: false,
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("initializes with default values", () => {
    const state = useGameStore.getState();
    expect(state.gamePhase).toBe("menu");
    expect(state.difficulty).toBe("medium");
    expect(state.audioSettings.masterVolume).toBeCloseTo(0.7);
  });

  it("updates audio settings partially", () => {
    useGameStore.getState().updateAudioSettings({ masterVolume: 0.33 });
    expect(useGameStore.getState().audioSettings.masterVolume).toBeCloseTo(0.33);
    expect(useGameStore.getState().audioSettings.musicVolume).toBeCloseTo(0.6);
  });

  it("switches game phase", () => {
    useGameStore.getState().setGamePhase("playing");
    expect(useGameStore.getState().gamePhase).toBe("playing");
  });
});

describe("high score persistence", () => {
  beforeEach(() => {
    useGameStore.setState({
      score: 0,
      highScore: 0,
      gamePhase: "menu",
      isHydrated: false,
    });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("saves high score to localStorage when set", () => {
    useGameStore.getState().setHighScore(42);
    expect(localStorage.getItem("flappy_bird_high_score")).toBe("42");
  });

  it("loads high score from localStorage on hydrate", () => {
    localStorage.setItem("flappy_bird_high_score", "99");
    useGameStore.getState().hydrate();
    expect(useGameStore.getState().highScore).toBe(99);
    expect(useGameStore.getState().isHydrated).toBe(true);
  });

  it("handles invalid localStorage values gracefully", () => {
    localStorage.setItem("flappy_bird_high_score", "invalid");
    useGameStore.getState().hydrate();
    expect(useGameStore.getState().highScore).toBe(0);
  });

  it("returns 0 when localStorage is empty", () => {
    useGameStore.getState().hydrate();
    expect(useGameStore.getState().highScore).toBe(0);
  });

  it("updates high score only if new score is higher", () => {
    useGameStore.setState({ highScore: 50 });
    useGameStore.getState().updateHighScoreIfNeeded(30);
    expect(useGameStore.getState().highScore).toBe(50);

    useGameStore.getState().updateHighScoreIfNeeded(75);
    expect(useGameStore.getState().highScore).toBe(75);
    expect(localStorage.getItem("flappy_bird_high_score")).toBe("75");
  });

  it("handles negative scores by storing 0", () => {
    useGameStore.getState().setHighScore(-10);
    expect(useGameStore.getState().highScore).toBe(0);
    expect(localStorage.getItem("flappy_bird_high_score")).toBe("0");
  });
});

describe("difficulty parameter mapping", () => {
  it("returns correct params for easy difficulty", () => {
    useGameStore.setState({ difficulty: "easy" });
    const params = useGameStore.getState().getDifficultyParams();
    expect(params).toEqual(DIFFICULTY_PRESETS.easy);
    expect(params.gapSize).toBe(120);
    expect(params.pipeSpeed).toBe(3);
    expect(params.gravity).toBe(0.4);
    expect(params.flapForce).toBe(8);
  });

  it("returns correct params for medium difficulty", () => {
    useGameStore.setState({ difficulty: "medium" });
    const params = useGameStore.getState().getDifficultyParams();
    expect(params).toEqual(DIFFICULTY_PRESETS.medium);
    expect(params.gapSize).toBe(100);
    expect(params.pipeSpeed).toBe(4.5);
    expect(params.gravity).toBe(0.5);
    expect(params.flapForce).toBe(7);
  });

  it("returns correct params for hard difficulty", () => {
    useGameStore.setState({ difficulty: "hard" });
    const params = useGameStore.getState().getDifficultyParams();
    expect(params).toEqual(DIFFICULTY_PRESETS.hard);
    expect(params.gapSize).toBe(80);
    expect(params.pipeSpeed).toBe(6);
    expect(params.gravity).toBe(0.6);
    expect(params.flapForce).toBe(6);
  });

  it("presets define consistent challenge progression", () => {
    const easy = DIFFICULTY_PRESETS.easy;
    const medium = DIFFICULTY_PRESETS.medium;
    const hard = DIFFICULTY_PRESETS.hard;

    expect(easy.gapSize).toBeGreaterThan(medium.gapSize);
    expect(medium.gapSize).toBeGreaterThan(hard.gapSize);

    expect(easy.pipeSpeed).toBeLessThan(medium.pipeSpeed);
    expect(medium.pipeSpeed).toBeLessThan(hard.pipeSpeed);

    expect(easy.gravity).toBeLessThan(medium.gravity);
    expect(medium.gravity).toBeLessThan(hard.gravity);

    expect(easy.flapForce).toBeGreaterThan(medium.flapForce);
    expect(medium.flapForce).toBeGreaterThan(hard.flapForce);
  });
});

describe("score management", () => {
  beforeEach(() => {
    useGameStore.setState({ score: 0, highScore: 0 });
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("increments score with addScore", () => {
    useGameStore.getState().addScore(10);
    expect(useGameStore.getState().score).toBe(10);
    useGameStore.getState().addScore(5);
    expect(useGameStore.getState().score).toBe(15);
  });

  it("resets game state", () => {
    useGameStore.setState({ score: 50, gamePhase: "playing" });
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().score).toBe(0);
    expect(useGameStore.getState().gamePhase).toBe("menu");
  });
});
