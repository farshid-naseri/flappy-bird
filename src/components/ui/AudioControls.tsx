import { useGameStore } from "../../store/gameStore";

export function AudioControls() {
  const { audioSettings, updateAudioSettings } = useGameStore();
  const { masterVolume, musicVolume, sfxVolume, muted } = audioSettings;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">Muted</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={muted}
            onChange={(e) => updateAudioSettings({ muted: e.target.checked })}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-glow-blue peer-checked:after:translate-x-full peer-checked:after:border-white" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-sm">
          <span className="font-medium text-white/70">Master</span>
          <span className="text-xs text-white/50">{Math.round(masterVolume * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={masterVolume * 100}
          onChange={(e) =>
            updateAudioSettings({ masterVolume: Number(e.target.value) / 100 })
          }
          disabled={muted}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow-blue disabled:cursor-not-allowed disabled:opacity-40"
          style={{ accentColor: "oklch(0.72 0.11 200)" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-sm">
          <span className="font-medium text-white/70">Music</span>
          <span className="text-xs text-white/50">{Math.round(musicVolume * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={musicVolume * 100}
          onChange={(e) => updateAudioSettings({ musicVolume: Number(e.target.value) / 100 })}
          disabled={muted}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow-blue disabled:cursor-not-allowed disabled:opacity-40"
          style={{ accentColor: "oklch(0.72 0.11 200)" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-sm">
          <span className="font-medium text-white/70">SFX</span>
          <span className="text-xs text-white/50">{Math.round(sfxVolume * 100)}%</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sfxVolume * 100}
          onChange={(e) => updateAudioSettings({ sfxVolume: Number(e.target.value) / 100 })}
          disabled={muted}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-glow-blue disabled:cursor-not-allowed disabled:opacity-40"
          style={{ accentColor: "oklch(0.72 0.11 200)" }}
        />
      </div>
    </div>
  );
}
