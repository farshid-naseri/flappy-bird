import { useMemo } from "react";
import { GamePhase, useGameStore } from "../../store/gameStore";

const PHASES: GamePhase[] = ["menu", "playing", "paused", "gameOver"];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export function GamePhaseControls() {
  const { gamePhase, difficulty, setGamePhase, setDifficulty } = useGameStore();
  const activeDifficultyIndex = useMemo(() => DIFFICULTIES.indexOf(difficulty), [difficulty]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Phase</p>
        <div className="flex flex-wrap gap-2">
          {PHASES.map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setGamePhase(phase)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                phase === gamePhase
                  ? "bg-glow-blue text-slate-900"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {phase.replace(/([A-Z])/g, " $1").toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Difficulty</p>
        <div className="flex flex-col gap-2">
          {DIFFICULTIES.map((level) => (
            <label
              key={level}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm capitalize transition ${
                level === difficulty
                  ? "border-glow-teal bg-glow-teal/20 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
              }`}
            >
              <span>{level}</span>
              <input
                type="radio"
                checked={level === difficulty}
                onChange={() => setDifficulty(level)}
                style={{ accentColor: "oklch(0.72 0.11 200)" }}
              />
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
          <span>Assist</span>
          <span>Challenge</span>
        </div>
        <div className="h-1 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-glow-teal"
            style={{ width: `${((activeDifficultyIndex + 1) / DIFFICULTIES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
