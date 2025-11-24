import { useEffect } from "react";
import { CanvasGame } from "./components/CanvasGame";
import { GameLayout } from "./components/layout/GameLayout";
import { SidePanel } from "./components/layout/SidePanel";
import { AudioControls } from "./components/ui/AudioControls";
import { GamePhaseControls } from "./components/ui/GamePhaseControls";
import { ScoreHUD } from "./components/ui/ScoreHUD";
import { useGameStore } from "./store/gameStore";

function MissionBrief() {
  const { difficulty } = useGameStore();
  const copy = {
    easy: "Ease into the journey with slower parallax layers and forgiving hit boxes.",
    medium: "Balanced pacing with standard obstacle spacing and star speed.",
    hard: "Full intensity with aggressive parallax velocity and precision flying.",
  } as const;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 shadow-lg backdrop-blur">
      <p>{copy[difficulty]}</p>
    </div>
  );
}

export function App() {
  useEffect(() => {
    useGameStore.getState().hydrate();
  }, []);

  return (
    <GameLayout
      canvasElement={<CanvasGame />}
      leftPanel={
        <div className="flex flex-col gap-4">
          <SidePanel title="Score">
            <ScoreHUD />
          </SidePanel>
          <SidePanel title="Mission Control">
            <GamePhaseControls />
          </SidePanel>
          <SidePanel title="Briefing">
            <MissionBrief />
          </SidePanel>
        </div>
      }
      rightPanel={
        <div className="flex flex-col gap-4">
          <SidePanel title="Audio">
            <AudioControls />
          </SidePanel>
          <SidePanel title="Tips">
            <ul className="list-disc space-y-1 pl-4 text-sm text-white/65">
              <li>Use arrow keys or tap/click to influence the parallax drift.</li>
              <li>Mastery requires watching how depth layers respond to input.</li>
              <li>Boosts and enemies will be layered in these panels later.</li>
            </ul>
          </SidePanel>
        </div>
      }
    />
  );
}

export default App;
