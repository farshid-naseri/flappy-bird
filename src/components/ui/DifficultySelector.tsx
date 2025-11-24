import { Difficulty, useGameStore } from "../../store/gameStore";

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "easy", label: "Easy", description: "Larger gaps, slower pace" },
  { value: "medium", label: "Medium", description: "Balanced gameplay" },
  { value: "hard", label: "Hard", description: "Tight gaps, fast pace" },
];

interface DifficultySelectorProps {
  disabled?: boolean;
}

export function DifficultySelector({ disabled = false }: DifficultySelectorProps) {
  const { difficulty, setDifficulty } = useGameStore();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold uppercase tracking-wider text-white/70">
        Difficulty
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {DIFFICULTIES.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => setDifficulty(level.value)}
            disabled={disabled}
            className={`flex min-h-[44px] flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow-blue sm:min-h-[60px] sm:px-4 sm:py-3 ${
              level.value === difficulty
                ? "border-glow-teal bg-glow-teal/20 text-white shadow-lg"
                : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10"
            } ${disabled ? "cursor-not-allowed opacity-50" : "active:scale-95"}`}
          >
            <span className="text-sm font-bold sm:text-base">{level.label}</span>
            <span className="hidden text-xs text-white/60 sm:inline">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
