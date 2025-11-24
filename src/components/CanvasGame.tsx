import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { checkAllCollisions } from '../utils/gamePhysics';
import { GameConfig, Bird, Pipe } from '../types/game';

interface CanvasGameProps {
  width?: number;
  height?: number;
}

export const CanvasGame: React.FC<CanvasGameProps> = ({ 
  width = 400, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const collisionFlashRef = useRef<number>(0);

  const { 
    status, 
    bird, 
    pipes, 
    score, 
    highScore, 
    backgroundOffset, 
    groundOffset,
    config,
    actions 
  } = useGameStore();

  const handleJump = useCallback(() => {
    if (status === 'ready') {
      actions.startGame();
    } else if (status === 'running') {
      actions.jump();
    } else if (status === 'game-over') {
      actions.resetGame();
    }
  }, [status, actions]);

  // Draw functions
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, config: GameConfig) => {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, config.canvasHeight);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8E8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Simple clouds (parallax background)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 150 - backgroundOffset * 0.3) % (config.canvasWidth + 100);
      const y = 50 + i * 60;
      
      // Draw cloud circles
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
      ctx.arc(x + 50, y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [backgroundOffset]);

  const drawGround = useCallback((ctx: CanvasRenderingContext2D, config: GameConfig) => {
    // Ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, config.canvasHeight - 20, config.canvasWidth, 20);
    
    // Ground lines for movement effect
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let i = 0; i < config.canvasWidth + 40; i += 40) {
      const x = (i - groundOffset) % (config.canvasWidth + 40);
      ctx.beginPath();
      ctx.moveTo(x, config.canvasHeight - 20);
      ctx.lineTo(x + 20, config.canvasHeight);
      ctx.stroke();
    }
  }, [groundOffset]);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird, flash: boolean = false) => {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    // Flash effect on collision
    if (flash) {
      ctx.fillStyle = '#FF6B6B';
    } else {
      ctx.fillStyle = '#FFD700';
    }

    // Bird body (circle)
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bird beak
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(bird.radius, 0);
    ctx.lineTo(bird.radius + 8, 0);
    ctx.lineTo(bird.radius, 5);
    ctx.closePath();
    ctx.fill();

    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(6, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(-5, 2, 8, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }, []);

  const drawPipes = useCallback((ctx: CanvasRenderingContext2D, pipes: Pipe[]) => {
    pipes.forEach(pipe => {
      // Pipe gradient
      const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
      gradient.addColorStop(0, '#228B22');
      gradient.addColorStop(0.5, '#32CD32');
      gradient.addColorStop(1, '#228B22');
      ctx.fillStyle = gradient;

      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
      // Top pipe cap
      ctx.fillRect(pipe.x - 5, pipe.gapY - 30, pipe.width + 10, 30);

      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, 
                   ctx.canvas.height - pipe.gapY - pipe.gapHeight);
      // Bottom pipe cap
      ctx.fillRect(pipe.x - 5, pipe.gapY + pipe.gapHeight, pipe.width + 10, 30);

      // Pipe highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x + 5, 0, 5, pipe.gapY);
      ctx.strokeRect(pipe.x + 5, pipe.gapY + pipe.gapHeight, 5, 
                     ctx.canvas.height - pipe.gapY - pipe.gapHeight);
    });
  }, []);

  const drawUI = useCallback((ctx: CanvasRenderingContext2D, score: number, highScore: number, status: string) => {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 24px Arial';

    // Score
    ctx.strokeText(`${score}`, 20, 40);
    ctx.fillText(`${score}`, 20, 40);

    // High score
    if (highScore > 0) {
      ctx.font = '16px Arial';
      ctx.strokeText(`Best: ${highScore}`, 20, 65);
      ctx.fillText(`Best: ${highScore}`, 20, 65);
    }

    // Status messages
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    if (status === 'ready') {
      ctx.strokeText('Click to Start', ctx.canvas.width / 2, ctx.canvas.height / 2);
      ctx.fillText('Click to Start', ctx.canvas.width / 2, ctx.canvas.height / 2);
    } else if (status === 'game-over') {
      ctx.strokeText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
      ctx.fillText('Game Over', ctx.canvas.width / 2, ctx.canvas.height / 2 - 40);
      
      ctx.font = 'bold 24px Arial';
      ctx.strokeText('Click to Restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
      ctx.fillText('Click to Restart', ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
    }
    
    ctx.textAlign = 'left';
  }, []);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    // Update physics if game is running
    if (status === 'running') {
      actions.updatePhysics(deltaTime);

      // Check collisions
      const collision = checkAllCollisions(bird, pipes, config);
      if (collision.collided) {
        actions.setCollision(collision.type!);
        collisionFlashRef.current = 0.3; // Flash duration
      }
    }

    // Update collision flash
    if (collisionFlashRef.current > 0) {
      collisionFlashRef.current -= deltaTime;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw everything
    drawBackground(ctx, config);
    drawPipes(ctx, pipes);
    drawGround(ctx, config);
    drawBird(ctx, bird, collisionFlashRef.current > 0);
    drawUI(ctx, score, highScore, status);

    // Handle game over transition
    if (status === 'hit') {
      setTimeout(() => {
        actions.resetGame();
      }, 1000);
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [status, bird, pipes, score, highScore, config, actions, width, height, drawBackground, drawPipes, drawGround, drawBird, drawUI]);

  // Initialize and start game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  // Handle input
  useEffect(() => {
    const canvas = canvasRef.current;
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    const handleClick = () => {
      handleJump();
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas?.removeEventListener('click', handleClick);
    };
  }, [handleJump]);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'block',
        }}
      />
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <p>Press SPACE or Click to flap!</p>
      </div>
    </div>
  );
};