import { Tetromino } from './tetrominos';
import { BOARD_WIDTH, BOARD_HEIGHT } from './constants';

// Define the cell type for the board
export type Cell = {
  filled: boolean;
  color: string;
};

// Define the game board type
export type Board = Cell[][];

// Create an empty game board
export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() =>
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({ filled: false, color: '' }))
    );
};

// Check if a position is valid for a tetromino (no collisions)
export const isValidPosition = (
  board: Board,
  tetromino: Tetromino,
  offsetX: number,
  offsetY: number
): boolean => {
  // Check each cell of the tetromino
  for (let y = 0; y < tetromino.height; y++) {
    for (let x = 0; x < tetromino.width; x++) {
      // Skip empty cells in the tetromino
      if (!tetromino.shape[y][x]) continue;

      // Calculate the position on the board
      const boardX = x + offsetX;
      const boardY = y + offsetY;

      // Check if the position is outside the board boundaries
      if (
        boardX < 0 ||
        boardX >= BOARD_WIDTH ||
        boardY < 0 ||
        boardY >= BOARD_HEIGHT
      ) {
        return false;
      }

      // Check if the position is already filled on the board
      if (boardY >= 0 && board[boardY][boardX].filled) {
        return false;
      }
    }
  }

  // If no collisions were found, the position is valid
  return true;
};

// Place a tetromino on the board (lock it in place)
export const placeTetromino = (
  board: Board,
  tetromino: Tetromino,
  offsetX: number,
  offsetY: number
): Board => {
  // Create a copy of the board to avoid mutating the original
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  // Place each cell of the tetromino on the board
  for (let y = 0; y < tetromino.height; y++) {
    for (let x = 0; x < tetromino.width; x++) {
      // Skip empty cells in the tetromino
      if (!tetromino.shape[y][x]) continue;

      // Calculate the position on the board
      const boardX = x + offsetX;
      const boardY = y + offsetY;

      // Skip if the position is outside the board
      if (
        boardX < 0 ||
        boardX >= BOARD_WIDTH ||
        boardY < 0 ||
        boardY >= BOARD_HEIGHT
      ) {
        continue;
      }

      // Fill the cell on the board
      newBoard[boardY][boardX] = {
        filled: true,
        color: tetromino.type,
      };
    }
  }

  return newBoard;
};

// Check for completed lines and remove them
export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0;
  
  // Check each row from bottom to top
  const newBoard = board.filter((row, index) => {
    // Check if all cells in the row are filled
    const isRowFilled = row.every(cell => cell.filled);
    
    // If the row is filled, increment the counter
    if (isRowFilled) {
      linesCleared++;
      return false;
    }
    
    return true;
  });
  
  // Add new empty rows at the top to replace the cleared lines
  const emptyRows = Array(linesCleared)
    .fill(null)
    .map(() =>
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({ filled: false, color: '' }))
    );
  
  return {
    newBoard: [...emptyRows, ...newBoard],
    linesCleared,
  };
};

// Check if the game is over (no space for new tetromino)
export const isGameOver = (board: Board): boolean => {
  // Check if the top row has any filled cells
  return board[0].some(cell => cell.filled);
};