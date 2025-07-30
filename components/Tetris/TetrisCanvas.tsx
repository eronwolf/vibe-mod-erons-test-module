'use client'

import React, { useRef, useEffect, useState } from 'react';
import { GameState, GameStatus, getGhostPosition } from './engine/gameState';
import { BOARD_WIDTH, BOARD_HEIGHT, DEFAULT_CELL_SIZE, calculateCellSize } from './engine/constants';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  
  // Calculate canvas dimensions based on cell size
  const canvasWidth = BOARD_WIDTH * cellSize;
  const canvasHeight = BOARD_HEIGHT * cellSize;
  
  // Update cell size when container size changes
  useEffect(() => {
    const updateCellSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const newCellSize = calculateCellSize(containerWidth, containerHeight);
        setCellSize(newCellSize);
      }
    };
    
    // Initial calculation
    updateCellSize();
    
    // Add resize event listener
    window.addEventListener('resize', updateCellSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

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
    drawGrid(ctx, canvasWidth, canvasHeight, cellSize);
    
    // Draw the board
    drawBoard(ctx, gameState.board, cellSize);
    
    // Draw the ghost piece (preview of where the piece will land)
    if (gameState.status === GameStatus.PLAYING) {
      const ghostY = getGhostPosition(gameState);
      drawGhostPiece(
        ctx,
        gameState.currentPiece,
        gameState.currentX,
        ghostY,
        cellSize
      );
    }
    
    // Draw the current piece
    if (gameState.status === GameStatus.PLAYING || gameState.status === GameStatus.PAUSED) {
      drawTetromino(
        ctx,
        gameState.currentPiece,
        gameState.currentX,
        gameState.currentY,
        cellSize
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
  }, [gameState, canvasWidth, canvasHeight, cellSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: '2px solid #333',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </div>
  );
};

export default TetrisCanvas;