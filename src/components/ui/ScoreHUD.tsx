import { useEffect, useState, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { useScoring } from "../../hooks";

export function ScoreHUD() {
  const { score, highScore, milestones } = useGameStore();
  const [celebratingMilestone, setCelebratingMilestone] = useState<number | null>(null);
  const previousScoreRef = useRef(score);
  
  useScoring();

  useEffect(() => {
    if (score > previousScoreRef.current) {
      const justReachedMilestone = milestones.find(
        (m) => score >= m && previousScoreRef.current < m
      );
      if (justReachedMilestone) {
        setCelebratingMilestone(justReachedMilestone);
        setTimeout(() => setCelebratingMilestone(null), 2000);
      }
    }
    previousScoreRef.current = score;
  }, [score, milestones]);

  const getMilestoneStatus = (milestone: number): "reached" | "next" | "future" => {
    if (score >= milestone) return "reached";
    const nextMilestone = milestones.find((m) => m > score);
    return milestone === nextMilestone ? "next" : "future";
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-hud-border bg-hud-bg/90 p-4 shadow-hud backdrop-blur-sm">
      {celebratingMilestone && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-glow-teal/20 backdrop-blur-sm animate-pulse">
          <div className="text-4xl font-bold text-glow-teal drop-shadow-lg">
            🎉 {celebratingMilestone} Points! 🎉
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Current Score
          </span>
          <span className="text-3xl font-bold text-white">{score}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Best
          </span>
          <span className="text-3xl font-bold text-glow-gold">{highScore}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Milestones</p>
        <div className="flex gap-2">
          {milestones.map((milestone) => {
            const status = getMilestoneStatus(milestone);
            return (
              <div
                key={milestone}
                className={`flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  status === "reached"
                    ? "bg-glow-teal text-slate-900"
                    : status === "next"
                      ? "border border-glow-teal bg-glow-teal/10 text-glow-teal"
                      : "border border-white/10 bg-white/5 text-white/40"
                }`}
              >
                {milestone}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
