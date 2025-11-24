import { ReactNode } from "react";
import { TopHUD } from "./TopHUD";

interface GameLayoutProps {
  canvasElement: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function GameLayout({ canvasElement, leftPanel, rightPanel }: GameLayoutProps) {
  return (
    <div className="flex h-screen flex-col gap-4 bg-canvas-backdrop p-4">
      <header className="flex-shrink-0">
        <TopHUD />
      </header>

      <main className="grid flex-1 grid-cols-[260px_1fr_260px] gap-4 overflow-hidden">
        <aside className="overflow-y-auto">{leftPanel}</aside>
        <section className="relative overflow-hidden">{canvasElement}</section>
        <aside className="overflow-y-auto">{rightPanel}</aside>
      </main>
    </div>
  );
}
