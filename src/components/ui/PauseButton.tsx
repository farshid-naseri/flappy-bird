import { useGameStore } from "../../store/gameStore";

export function PauseButton() {
  const { gamePhase, setGamePhase } = useGameStore();

  if (gamePhase !== "playing") {
    return null;
  }

  const handlePause = () => {
    setGamePhase("paused");
  };

  return (
    <button
      type="button"
      onClick={handlePause}
      className="absolute right-4 top-4 z-40 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 border-white/30 bg-slate-900/70 px-4 py-2 font-semibold text-white backdrop-blur-sm transition-all hover:bg-slate-800/80 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow-blue"
      aria-label="Pause game"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </svg>
      <span className="ml-2 hidden sm:inline">Pause</span>
    </button>
  );
}
