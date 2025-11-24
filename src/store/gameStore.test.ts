import { describe, expect, it } from "vitest";
import { useGameStore } from "./gameStore";

describe("game store", () => {
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
