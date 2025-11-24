import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { Button } from "../ui/Button";
import { DifficultySelector } from "../ui/DifficultySelector";
import { SettingsPanel } from "../ui/SettingsPanel";

export function MainMenu() {
  const { setGamePhase, highScore } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleStartGame = () => {
    setGamePhase("playing");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-glow-blue drop-shadow-lg sm:text-5xl md:text-6xl">
            Flappy Bird
          </h1>
          <p className="text-base text-white/70 sm:text-lg">Ready to fly?</p>
          {highScore > 0 && (
            <p className="mt-2 text-sm text-glow-gold">
              High Score: {highScore}
            </p>
          )}
        </div>

        {!showSettings ? (
          <div className="space-y-6">
            <DifficultySelector />
            
            <div className="space-y-3">
              <Button
                size="lg"
                fullWidth
                onClick={handleStartGame}
                className="animate-pulse shadow-xl"
              >
                Start Game
              </Button>
              
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowSettings(true)}
              >
                Settings
              </Button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <p className="mb-2 font-semibold text-white">Controls:</p>
              <ul className="space-y-1">
                <li>• <span className="font-medium">Space/Up Arrow</span> - Flap</li>
                <li>• <span className="font-medium">P</span> - Pause</li>
                <li>• <span className="font-medium">Tap/Click</span> - Flap</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SettingsPanel />
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowSettings(false)}
            >
              Back to Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
