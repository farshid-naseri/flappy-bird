import { ReactNode } from "react";

interface SidePanelProps {
  title: string;
  children: ReactNode;
}

export function SidePanel({ title, children }: SidePanelProps) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80 shadow-lg backdrop-blur">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
        {title}
      </h2>
      {children}
    </section>
  );
}
