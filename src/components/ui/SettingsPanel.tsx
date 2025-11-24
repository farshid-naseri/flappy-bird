import { AudioControls } from "./AudioControls";
import { DifficultySelector } from "./DifficultySelector";

interface SettingsPanelProps {
  disableDifficulty?: boolean;
}

export function SettingsPanel({ disableDifficulty = false }: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-white">Audio Settings</h3>
        <AudioControls />
      </div>
      
      <div>
        <DifficultySelector disabled={disableDifficulty} />
      </div>
    </div>
  );
}
