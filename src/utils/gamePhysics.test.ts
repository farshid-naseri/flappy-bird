import { describe, it, expect } from 'vitest';
import { checkBirdPipeCollision, checkBirdBoundaryCollision, updateBirdPhysics, generatePipeGap } from '../utils/gamePhysics';
import { Bird, Pipe, GameConfig } from '../types/game';

describe('Game Physics Utils', () => {
  const mockConfig: GameConfig = {
    gravity: 980,
    jumpImpulse: -350,
    pipeSpeed: 150,
    pipeGap: 150,
    pipeWidth: 60,
    pipeInterval: 2000,
    backgroundSpeed: 30,
    groundSpeed: 120,
    birdRadius: 15,
    canvasWidth: 400,
    canvasHeight: 600,
  };

  const mockBird: Bird = {
    x: 100,
    y: 300,
    velocity: 0,
    rotation: 0,
    radius: 15,
  };

  describe('checkBirdPipeCollision', () => {
    it('should detect collision when bird hits pipe body', () => {
      const pipe: Pipe = {
        x: 90,
        gapY: 200,
        gapHeight: 150,
        width: 60,
        passed: false,
      };

      // Bird is above the gap
      const birdAboveGap = { ...mockBird, y: 180 };
      expect(checkBirdPipeCollision(birdAboveGap, pipe)).toBe(true);

      // Bird is below the gap
      const birdBelowGap = { ...mockBird, y: 370 };
      expect(checkBirdPipeCollision(birdBelowGap, pipe)).toBe(true);
    });

    it('should not detect collision when bird passes through gap', () => {
      const pipe: Pipe = {
        x: 90,
        gapY: 200,
        gapHeight: 150,
        width: 60,
        passed: false,
      };

      // Bird is in the gap
      const birdInGap = { ...mockBird, y: 275 };
      expect(checkBirdPipeCollision(birdInGap, pipe)).toBe(false);
    });

    it('should not detect collision when bird is outside pipe horizontal range', () => {
      const pipe: Pipe = {
        x: 150,
        gapY: 200,
        gapHeight: 150,
        width: 60,
        passed: false,
      };

      expect(checkBirdPipeCollision(mockBird, pipe)).toBe(false);
    });
  });

  describe('checkBirdBoundaryCollision', () => {
    it('should detect ground collision', () => {
      const birdOnGround = { ...mockBird, y: 585 };
      const result = checkBirdBoundaryCollision(birdOnGround, mockConfig);
      expect(result.collided).toBe(true);
      expect(result.type).toBe('ground');
    });

    it('should detect ceiling collision', () => {
      const birdOnCeiling = { ...mockBird, y: 10 };
      const result = checkBirdBoundaryCollision(birdOnCeiling, mockConfig);
      expect(result.collided).toBe(true);
      expect(result.type).toBe('ceiling');
    });

    it('should not detect collision when bird is in bounds', () => {
      const result = checkBirdBoundaryCollision(mockBird, mockConfig);
      expect(result.collided).toBe(false);
      expect(result.type).toBe(null);
    });
  });

  describe('updateBirdPhysics', () => {
    it('should apply gravity to bird velocity', () => {
      const deltaTime = 0.016; // ~60fps
      const updatedBird = updateBirdPhysics(mockBird, deltaTime, mockConfig);
      
      expect(updatedBird.velocity).toBeGreaterThan(mockBird.velocity);
      expect(updatedBird.y).toBeGreaterThan(mockBird.y);
    });

    it('should update bird rotation based on velocity', () => {
      const fallingBird = { ...mockBird, velocity: 300 };
      const deltaTime = 0.016;
      const updatedBird = updateBirdPhysics(fallingBird, deltaTime, mockConfig);
      
      expect(updatedBird.rotation).toBeGreaterThan(0);
    });

    it('should cap rotation to prevent excessive tilting', () => {
      const fastFallingBird = { ...mockBird, velocity: 1000 };
      const deltaTime = 0.016;
      const updatedBird = updateBirdPhysics(fastFallingBird, deltaTime, mockConfig);
      
      expect(updatedBird.rotation).toBeLessThanOrEqual(0.5);
    });
  });

  describe('generatePipeGap', () => {
    it('should generate gap within valid range', () => {
      const gapY = generatePipeGap(mockConfig);
      
      expect(gapY).toBeGreaterThanOrEqual(50);
      expect(gapY).toBeLessThanOrEqual(
        mockConfig.canvasHeight - mockConfig.pipeGap - 100
      );
    });

    it('should generate different gaps on multiple calls', () => {
      const gaps = Array.from({ length: 10 }, () => generatePipeGap(mockConfig));
      const uniqueGaps = new Set(gaps);
      
      // Should have some variation (not all the same)
      expect(uniqueGaps.size).toBeGreaterThan(1);
    });
  });
});