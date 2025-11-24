import { useEffect, useRef } from "react";
import { useAnimationFrame, useInput, useGameControls } from "../hooks";
import { MenuOverlay } from "./menus/MenuOverlay";
import { PauseButton } from "./ui/PauseButton";

const MAX_STARS = 60;

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
}

const createStars = (width: number, height: number): Star[] =>
  Array.from({ length: MAX_STARS }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.1 + Math.random() * 0.4,
    size: Math.random() * 2 + 0.3,
  }));

export function CanvasGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const { snapshot } = useInput();
  useGameControls();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const devicePixelRatio = window.devicePixelRatio ?? 1;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
      starsRef.current = createStars(width, height);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gamePhase === "playing") {
        e.preventDefault();
        flap();
      }
    };

    const handleClick = () => {
      if (gamePhase === "playing") {
        flap();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    const canvas = canvasRef.current;
    canvas?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvas?.removeEventListener("click", handleClick);
    };
  }, [gamePhase, flap]);

  useAnimationFrame((delta) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { width, height } = canvas.getBoundingClientRect();
    
    const gameState = update(delta, width, height);
    
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1c2541");
    gradient.addColorStop(0.6, "#0b132b");
    gradient.addColorStop(1, "#050914");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(255, 255, 255, 0.3)";
    starsRef.current.forEach((star) => {
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();

      const modifier = gamePhase === "playing" ? 1.5 : 1;
      star.y += star.speed * delta * 0.05 * modifier;
      if (star.y > height) star.y = -star.size;
      star.x += (snapshot.keys.has("arrowright") ? 1 : 0) * 0.1 * delta;
      star.x -= (snapshot.keys.has("arrowleft") ? 1 : 0) * 0.1 * delta;
      if (star.x > width) star.x = 0;
      if (star.x < 0) star.x = width;
    });

    gameState.pipes.forEach((pipe) => {
      context.fillStyle = "rgba(76, 175, 80, 0.9)";
      context.fillRect(pipe.x, 0, 60, pipe.gapY);
      context.fillRect(pipe.x, pipe.gapY + pipe.gapSize, 60, height - (pipe.gapY + pipe.gapSize));
      
      context.strokeStyle = "rgba(56, 142, 60, 1)";
      context.lineWidth = 3;
      context.strokeRect(pipe.x, 0, 60, pipe.gapY);
      context.strokeRect(pipe.x, pipe.gapY + pipe.gapSize, 60, height - (pipe.gapY + pipe.gapSize));
    });

    context.fillStyle = "rgba(255, 214, 0, 0.95)";
    context.beginPath();
    context.arc(gameState.bird.x, gameState.bird.y, gameState.bird.radius, 0, Math.PI * 2);
    context.fill();
    
    context.strokeStyle = "rgba(255, 152, 0, 1)";
    context.lineWidth = 2;
    context.stroke();
  }, true);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        role="presentation"
        className="h-full w-full rounded-3xl border border-white/10 bg-canvas-backdrop/60 shadow-xl"
      />
      <PauseButton />
      <MenuOverlay />
    </div>
  );
}
