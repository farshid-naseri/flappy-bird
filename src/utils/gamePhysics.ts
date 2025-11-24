import { Bird, Pipe, CollisionResult, GameConfig } from '../types/game';

export function checkBirdPipeCollision(bird: Bird, pipe: Pipe): boolean {
  const birdLeft = bird.x - bird.radius;
  const birdRight = bird.x + bird.radius;
  const birdTop = bird.y - bird.radius;
  const birdBottom = bird.y + bird.radius;

  const pipeLeft = pipe.x;
  const pipeRight = pipe.x + pipe.width;
  const gapTop = pipe.gapY;
  const gapBottom = pipe.gapY + pipe.gapHeight;

  // Check if bird is within pipe's horizontal range
  if (birdRight > pipeLeft && birdLeft < pipeRight) {
    // Check if bird hits the pipe body (above or below the gap)
    if (birdTop < gapTop || birdBottom > gapBottom) {
      return true;
    }
  }

  return false;
}

export function checkBirdBoundaryCollision(
  bird: Bird,
  config: GameConfig
): CollisionResult {
  // Check ground collision
  if (bird.y + bird.radius >= config.canvasHeight) {
    return { collided: true, type: 'ground' };
  }

  // Check ceiling collision
  if (bird.y - bird.radius <= 0) {
    return { collided: true, type: 'ceiling' };
  }

  return { collided: false, type: null };
}

export function checkAllCollisions(
  bird: Bird,
  pipes: Pipe[],
  config: GameConfig
): CollisionResult {
  // Check pipe collisions
  for (const pipe of pipes) {
    if (checkBirdPipeCollision(bird, pipe)) {
      return { collided: true, type: 'pipe' };
    }
  }

  // Check boundary collisions
  return checkBirdBoundaryCollision(bird, config);
}

export function updateBirdPhysics(bird: Bird, deltaTime: number, config: GameConfig): Bird {
  const newVelocity = bird.velocity + config.gravity * deltaTime;
  const newY = bird.y + newVelocity * deltaTime;
  const newRotation = Math.min(Math.max(newVelocity * 0.05, -0.5), 0.5);

  return {
    ...bird,
    y: newY,
    velocity: newVelocity,
    rotation: newRotation,
  };
}

export function generatePipeGap(config: GameConfig): number {
  return Math.random() * (config.canvasHeight - config.pipeGap - 100) + 50;
}

export function calculateDeltaTime(lastTime: number, currentTime: number): number {
  const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
  return Math.min(deltaTime, 0.1); // Cap deltaTime to prevent large jumps
}