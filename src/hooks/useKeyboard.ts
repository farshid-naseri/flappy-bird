import { useEffect, useRef } from "react";

export type KeyHandler = (event: KeyboardEvent) => void;

export interface UseKeyboardOptions {
  onKeyDown?: KeyHandler;
  onKeyUp?: KeyHandler;
  keys?: string[];
  enabled?: boolean;
}

export function useKeyboard(options: UseKeyboardOptions = {}) {
  const { onKeyDown, onKeyUp, keys, enabled = true } = options;
  const handlersRef = useRef({ onKeyDown, onKeyUp });

  useEffect(() => {
    handlersRef.current = { onKeyDown, onKeyUp };
  }, [onKeyDown, onKeyUp]);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (keys && !keys.includes(event.key)) return;
      handlersRef.current.onKeyDown?.(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (keys && !keys.includes(event.key)) return;
      handlersRef.current.onKeyUp?.(event);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, enabled]);
}
