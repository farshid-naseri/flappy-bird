import { useEffect, useMemo, useState } from "react";

export interface PointerState {
  x: number;
  y: number;
  isDown: boolean;
}

export interface InputSnapshot {
  keys: Set<string>;
  pointer: PointerState;
}

const normalizeKey = (key: string) => key.toLowerCase();

export function useInput(): { snapshot: InputSnapshot; isKeyPressed: (key: string) => boolean } {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0, isDown: false });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys((prev) => {
        if (prev.has(normalizeKey(event.key))) return prev;
        const next = new Set(prev);
        next.add(normalizeKey(event.key));
        return next;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys((prev) => {
        if (!prev.has(normalizeKey(event.key))) return prev;
        const next = new Set(prev);
        next.delete(normalizeKey(event.key));
        return next;
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      setPointer({ x: event.clientX, y: event.clientY, isDown: true });
    };

    const handlePointerMove = (event: PointerEvent) => {
      setPointer((current) => ({ ...current, x: event.clientX, y: event.clientY }));
    };

    const handlePointerUp = () => {
      setPointer((current) => ({ ...current, isDown: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  const snapshot = useMemo<InputSnapshot>(() => ({ keys, pointer }), [keys, pointer]);
  const isKeyPressed = (key: string) => snapshot.keys.has(normalizeKey(key));

  return { snapshot, isKeyPressed };
}
