import { useGameStore } from "../../store/gameStore";
import { Button } from "../ui/Button";
import { DifficultySelector } from "../ui/DifficultySelector";

export function GameOverMenu() {
  const { score, highScore, setGamePhase, resetGame } = useGameStore();
  const isNewHighScore = score === highScore && score > 0;

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
          <h2 className="mb-2 text-4xl font-bold text-red-400 sm:text-5xl">Game Over</h2>
          {isNewHighScore && (
            <p className="mb-4 text-lg font-semibold text-glow-gold animate-pulse sm:text-xl">
              🎉 New High Score! 🎉
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:gap-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60 sm:text-sm">
                Score
              </p>
              <p className="text-3xl font-bold text-white sm:text-4xl">{score}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60 sm:text-sm">
                Best
              </p>
              <p className="text-3xl font-bold text-glow-gold sm:text-4xl">{highScore}</p>
            </div>
          </div>
        </div>

        <DifficultySelector />

        <div className="space-y-3">
          <Button
            size="lg"
            fullWidth
            onClick={handleRestart}
            className="shadow-xl"
          >
            Play Again
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            onClick={handleMainMenu}
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
