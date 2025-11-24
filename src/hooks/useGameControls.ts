import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";

export function useGameControls() {
  const { gamePhase, setGamePhase } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      if (key === "p" && gamePhase === "playing") {
        event.preventDefault();
        setGamePhase("paused");
      }
      
      if (key === "p" && gamePhase === "paused") {
        event.preventDefault();
        setGamePhase("playing");
      }
      
      if ((key === " " || key === "arrowup") && gamePhase === "playing") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gamePhase, setGamePhase]);
}
