import { useGameStore } from "../../store/gameStore";
import { Button } from "../ui/Button";
import { SettingsPanel } from "../ui/SettingsPanel";
import { useState } from "react";

export function PauseMenu() {
  const { setGamePhase, resetGame } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleResume = () => {
    setGamePhase("playing");
  };

  const handleRestart = () => {
    resetGame();
    setGamePhase("playing");
  };

  const handleMainMenu = () => {
    resetGame();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="mb-2 text-4xl font-bold text-white sm:text-5xl">Paused</h2>
          <p className="text-base text-white/70 sm:text-lg">Take a breather</p>
        </div>

        {!showSettings ? (
          <div className="space-y-3">
            <Button
              size="lg"
              fullWidth
              onClick={handleResume}
              className="shadow-xl"
            >
              Resume Game
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={handleRestart}
            >
              Restart
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowSettings(true)}
            >
              Settings
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={handleMainMenu}
            >
              Main Menu
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <SettingsPanel disableDifficulty />
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowSettings(false)}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
