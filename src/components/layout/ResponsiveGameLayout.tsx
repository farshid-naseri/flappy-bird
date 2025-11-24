import { ReactNode } from "react";
import { TopHUD } from "./TopHUD";

interface ResponsiveGameLayoutProps {
  canvasElement: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function ResponsiveGameLayout({ 
  canvasElement, 
  leftPanel, 
  rightPanel 
}: ResponsiveGameLayoutProps) {
  return (
    <div className="flex h-screen flex-col gap-4 bg-canvas-backdrop p-2 sm:p-4">
      <header className="flex-shrink-0">
        <TopHUD />
      </header>

      <main className="flex flex-1 flex-col gap-4 overflow-hidden lg:grid lg:grid-cols-[260px_1fr_260px]">
        <aside className="hidden overflow-y-auto lg:block">
          {leftPanel}
        </aside>
        
        <section className="relative flex-1 overflow-hidden">
          {canvasElement}
        </section>
        
        <aside className="hidden overflow-y-auto lg:block">
          {rightPanel}
        </aside>
      </main>
    </div>
  );
}
