import { useGameStore } from "../../store/gameStore";

export function TopHUD() {
  const { gamePhase, difficulty, score, highScore } = useGameStore();

  return (
    <div className="flex items-center justify-between rounded-xl border border-hud-border bg-hud-bg/90 p-4 shadow-hud backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">
            {difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
          <div
            className={`h-2 w-2 rounded-full ${
              gamePhase === "playing" ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">
            {gamePhase}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">Score</span>
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">Best</span>
          <span className="text-2xl font-bold text-glow-gold">{highScore}</span>
        </div>
      </div>
    </div>
  );
}
