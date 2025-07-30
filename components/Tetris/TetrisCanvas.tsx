'use client'

import React, { useRef, useEffect } from 'react';
import { GameState, GameStatus, getGhostPosition } from './engine/gameState';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './engine/constants';
import {
  clearCanvas,
  drawGrid,
  drawBoard,
  drawTetromino,
  drawGhostPiece,
  drawGameOver,
  drawPaused,
  drawStartScreen,
} from './utils/canvas';

interface TetrisCanvasProps {
  gameState: GameState;
}

const TetrisCanvas: React.FC<TetrisCanvasProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate canvas dimensions
  const canvasWidth = BOARD_WIDTH * CELL_SIZE;
  const canvasHeight = BOARD_HEIGHT * CELL_SIZE;

  // Render the game on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    clearCanvas(ctx, canvasWidth, canvasHeight);
    
    // Draw the background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw the grid
    drawGrid(ctx, canvasWidth, canvasHeight);
    
    // Draw the board
    drawBoard(ctx, gameState.board);
    
    // Draw the ghost piece (preview of where the piece will land)
    if (gameState.status === GameStatus.PLAYING) {
      const ghostY = getGhostPosition(gameState);
      drawGhostPiece(
        ctx,
        gameState.currentPiece,
        gameState.currentX,
        ghostY
      );
    }
    
    // Draw the current piece
    if (gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.PAUSED) {
      drawTetromino(
        ctx,
        gameState.currentPiece,
        gameState.currentX,
        gameState.currentY
      );
    }
    
    // Draw overlays based on game status
    switch (gameState.status) {
      case GameStatus.READY:
        drawStartScreen(ctx, canvasWidth, canvasHeight);
        break;
      case GameStatus.PAUSED:
        drawPaused(ctx, canvasWidth, canvasHeight);
        break;
      case GameStatus.GAME_OVER:
        drawGameOver(ctx, canvasWidth, canvasHeight);
        break;
    }
  }, [gameState, canvasWidth, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{
        border: '2px solid #333',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
    />
  );
};

export default TetrisCanvas;