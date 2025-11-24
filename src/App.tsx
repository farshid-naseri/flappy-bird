import { useEffect } from "react";
import { CanvasGame } from "./components/CanvasGame";
import { GameLayout } from "./components/layout/GameLayout";
import { SidePanel } from "./components/layout/SidePanel";
import { AudioControls } from "./components/ui/AudioControls";
import { GamePhaseControls } from "./components/ui/GamePhaseControls";
import { ScoreHUD } from "./components/ui/ScoreHUD";
import { useGameStore } from "./store/gameStore";

function MissionBrief() {
  const { difficulty, getDifficultyParams } = useGameStore();
  const params = getDifficultyParams();
  const copy = {
    easy: `Gentle flight conditions with ${params.gapSize}px gaps and relaxed ${params.pipeSpeed}x speed. Perfect for training.`,
    medium: `Balanced challenge with ${params.gapSize}px gaps and ${params.pipeSpeed}x speed. Standard mission parameters.`,
    hard: `Extreme conditions with tight ${params.gapSize}px gaps and rapid ${params.pipeSpeed}x speed. Expert pilots only.`,
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
              <li>Press SPACE or click the canvas to flap and stay airborne.</li>
              <li>Navigate through the green pipe gaps to earn points.</li>
              <li>Reach milestones (10, 25, 50, 100) for special recognition.</li>
              <li>Choose your difficulty before starting - it locks during play.</li>
            </ul>
          </SidePanel>
        </div>
      }
    />
  );
}

export default App;
