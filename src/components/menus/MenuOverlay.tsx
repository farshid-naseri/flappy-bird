import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { MainMenu } from "./MainMenu";
import { PauseMenu } from "./PauseMenu";
import { GameOverMenu } from "./GameOverMenu";

export function MenuOverlay() {
  const { gamePhase } = useGameStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gamePhase !== "playing" && overlayRef.current) {
      const firstButton = overlayRef.current.querySelector("button");
      firstButton?.focus();
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === "playing") return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gamePhase === "paused") {
        useGameStore.getState().setGamePhase("playing");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [gamePhase]);

  if (gamePhase === "playing") {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-50 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`${gamePhase} menu`}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
      
      <div className="relative h-full animate-in zoom-in-95 duration-300">
        {gamePhase === "menu" && <MainMenu />}
        {gamePhase === "paused" && <PauseMenu />}
        {gamePhase === "gameOver" && <GameOverMenu />}
      </div>
    </div>
  );
}
