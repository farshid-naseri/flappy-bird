import { useEffect, useRef } from "react";
import { useGameStore } from "../store/gameStore";
import { audioManager } from "../audio/AudioManager";

export function useScoring() {
  const { score, milestones, updateHighScoreIfNeeded } = useGameStore();
  const previousScoreRef = useRef(score);

  useEffect(() => {
    if (score > previousScoreRef.current) {
      const justReachedMilestone = milestones.find(
        (m) => score >= m && previousScoreRef.current < m
      );
      
      if (justReachedMilestone) {
        audioManager.playSound("milestone").catch(() => {});
      }
      
      updateHighScoreIfNeeded(score);
    }
    previousScoreRef.current = score;
  }, [score, milestones, updateHighScoreIfNeeded]);
}
