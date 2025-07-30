import { Board, Cell } from '../engine/board';
import { Tetromino } from '../engine/tetrominos';
import { COLORS } from '../engine/constants';

// Clear the canvas
export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
};

// Draw the grid on the canvas
export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize: number
): void => {
  // Draw vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.strokeStyle = COLORS.GRID;
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.strokeStyle = COLORS.GRID;
    ctx.stroke();
  }
};

// Draw a single cell on the canvas
export const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  cellSize: number,
  isGhost: boolean = false
): void => {
  const actualColor = isGhost ? COLORS.GHOST : color;
  
  // Fill the cell
  ctx.fillStyle = actualColor;
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  
  // Draw the cell border
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
  
  // Add a highlight effect (only for non-ghost pieces)
  if (!isGhost) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(
      x * cellSize + 1,
      y * cellSize + 1,
      cellSize - 2,
      cellSize / 2 - 1
    );
  }
};

// Draw the game board on the canvas
export const drawBoard = (
  ctx: CanvasRenderingContext2D,
  board: Board,
  cellSize: number
): void => {
  // Draw each cell of the board
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.filled) {
        drawCell(ctx, x, y, COLORS[cell.color as keyof typeof COLORS], cellSize);
      }
    });
  });
};

// Draw a tetromino on the canvas
export const drawTetromino = (
  ctx: CanvasRenderingContext2D,
  tetromino: Tetromino,
  offsetX: number,
  offsetY: number,
  cellSize: number,
  isGhost: boolean = false
): void => {
  // Draw each cell of the tetromino
  tetromino.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        drawCell(
          ctx,
          x + offsetX,
          y + offsetY,
          COLORS[tetromino.type],
          cellSize,
          isGhost
        );
      }
    });
  });
};

// Draw the ghost piece (preview of where the piece will land)
export const drawGhostPiece = (
  ctx: CanvasRenderingContext2D,
  tetromino: Tetromino,
  offsetX: number,
  offsetY: number,
  cellSize: number
): void => {
  drawTetromino(ctx, tetromino, offsetX, offsetY, cellSize, true);
};

// Draw the next piece preview
export const drawNextPiece = (
  ctx: CanvasRenderingContext2D,
  tetromino: Tetromino,
  width: number,
  height: number,
  cellSize: number
): void => {
  // Clear the canvas
  clearCanvas(ctx, width, height);
  
  // Calculate the center position
  const offsetX = Math.floor((width / cellSize - tetromino.width) / 2);
  const offsetY = Math.floor((height / cellSize - tetromino.height) / 2);
  
  // Draw the tetromino
  drawTetromino(ctx, tetromino, offsetX, offsetY, cellSize);
};

// Draw game over overlay
export const drawGameOver = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  // Draw semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw game over text
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GAME OVER', width / 2, height / 2 - 30);
  
  // Draw restart instruction
  ctx.font = '16px Arial';
  ctx.fillText('Press SPACE to restart', width / 2, height / 2 + 10);
};

// Draw pause overlay
export const drawPaused = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  // Draw semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw paused text
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAUSED', width / 2, height / 2 - 30);
  
  // Draw resume instruction
  ctx.font = '16px Arial';
  ctx.fillText('Press P to resume', width / 2, height / 2 + 10);
};

// Draw start screen
export const drawStartScreen = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  // Draw semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw title
  ctx.fillStyle = '#ffffff';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TETRIS', width / 2, height / 2 - 50);
  
  // Draw start instruction
  ctx.font = '20px Arial';
  ctx.fillText('Press SPACE to start', width / 2, height / 2 + 20);
  
  // Draw controls
  ctx.font = '16px Arial';
  ctx.fillText('← → : Move', width / 2, height / 2 + 60);
  ctx.fillText('↑ : Rotate', width / 2, height / 2 + 85);
  ctx.fillText('↓ : Soft Drop', width / 2, height / 2 + 110);
  ctx.fillText('SPACE : Hard Drop', width / 2, height / 2 + 135);
  ctx.fillText('P : Pause', width / 2, height / 2 + 160);
};