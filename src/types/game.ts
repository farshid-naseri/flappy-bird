export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  radius: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  gapHeight: number;
  width: number;
  passed: boolean;
}

export interface GameState {
  status: 'ready' | 'running' | 'hit' | 'game-over';
  score: number;
  highScore: number;
  bird: Bird;
  pipes: Pipe[];
  backgroundOffset: number;
  groundOffset: number;
}

export interface GameConfig {
  gravity: number;
  jumpImpulse: number;
  pipeSpeed: number;
  pipeGap: number;
  pipeWidth: number;
  pipeInterval: number;
  backgroundSpeed: number;
  groundSpeed: number;
  birdRadius: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface CollisionResult {
  collided: boolean;
  type: 'pipe' | 'ground' | 'ceiling' | null;
}