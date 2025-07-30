import { Tetromino, getRandomTetromino, rotateTetromino } from './tetrominos';
import { Board, createEmptyBoard, isValidPosition, placeTetromino, clearLines, isGameOver } from './board';
import { POINTS, LINES_PER_LEVEL, SPEED_LEVELS } from './constants';

// Game status enum
export enum GameStatus {
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver',
}

// Game state interface
export interface GameState {
  board: Board;
  currentPiece: Tetromino;
  currentX: number;
  currentY: number;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  status: GameStatus;
}

// Create initial game state
export const createInitialGameState = (): GameState => {
  return {
    board: createEmptyBoard(),
    currentPiece: getRandomTetromino(),
    currentX: 3, // Start in the middle of the board
    currentY: 0, // Start at the top
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 0,
    lines: 0,
    status: GameStatus.READY,
  };
};

// Get the current game speed based on level
export const getCurrentSpeed = (level: number): number => {
  const maxLevel = SPEED_LEVELS.length - 1;
  const clampedLevel = Math.min(level, maxLevel);
  return SPEED_LEVELS[clampedLevel];
};

// Move the current piece left
export const moveLeft = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  const newX = state.currentX - 1;
  if (isValidPosition(state.board, state.currentPiece, newX, state.currentY)) {
    return { ...state, currentX: newX };
  }
  return state;
};

// Move the current piece right
export const moveRight = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  const newX = state.currentX + 1;
  if (isValidPosition(state.board, state.currentPiece, newX, state.currentY)) {
    return { ...state, currentX: newX };
  }
  return state;
};

// Move the current piece down (soft drop)
export const moveDown = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  const newY = state.currentY + 1;
  
  // Check if the piece can move down
  if (isValidPosition(state.board, state.currentPiece, state.currentX, newY)) {
    // Move the piece down and add points for soft drop
    return { 
      ...state, 
      currentY: newY,
      score: state.score + POINTS.SOFT_DROP
    };
  } else {
    // The piece can't move down, so lock it in place
    return lockPiece(state);
  }
};

// Rotate the current piece
export const rotatePiece = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  // Create a new rotated shape
  const rotatedShape = rotateTetromino(state.currentPiece);
  const rotatedPiece = { ...state.currentPiece, shape: rotatedShape };

  // Check if the rotated piece is in a valid position
  if (isValidPosition(state.board, rotatedPiece, state.currentX, state.currentY)) {
    return { ...state, currentPiece: rotatedPiece };
  }

  // Try wall kicks (move the piece left or right if it can't rotate in place)
  for (let offset of [-1, 1, -2, 2]) {
    if (isValidPosition(state.board, rotatedPiece, state.currentX + offset, state.currentY)) {
      return { 
        ...state, 
        currentPiece: rotatedPiece,
        currentX: state.currentX + offset
      };
    }
  }

  // If no valid rotation is found, return the original state
  return state;
};

// Hard drop the current piece
export const hardDrop = (state: GameState): GameState => {
  if (state.status !== GameStatus.PLAYING) return state;

  let dropDistance = 0;
  let newY = state.currentY;

  // Find the lowest valid position
  while (isValidPosition(state.board, state.currentPiece, state.currentX, newY + 1)) {
    newY++;
    dropDistance++;
  }

  // Update the state with the new position and add points for hard drop
  const updatedState = { 
    ...state, 
    currentY: newY,
    score: state.score + (dropDistance * POINTS.HARD_DROP)
  };

  // Lock the piece in place
  return lockPiece(updatedState);
};

// Lock the current piece in place and spawn a new piece
export const lockPiece = (state: GameState): GameState => {
  // Place the current piece on the board
  const newBoard = placeTetromino(
    state.board,
    state.currentPiece,
    state.currentX,
    state.currentY
  );

  // Clear completed lines
  const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

  // Calculate score based on lines cleared
  let additionalScore = 0;
  switch (linesCleared) {
    case 1:
      additionalScore = POINTS.SINGLE * (state.level + 1);
      break;
    case 2:
      additionalScore = POINTS.DOUBLE * (state.level + 1);
      break;
    case 3:
      additionalScore = POINTS.TRIPLE * (state.level + 1);
      break;
    case 4:
      additionalScore = POINTS.TETRIS * (state.level + 1);
      break;
  }

  // Update lines cleared and calculate new level
  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / LINES_PER_LEVEL);

  // Spawn a new piece
  const newPiece = state.nextPiece;
  const newNextPiece = getRandomTetromino();
  const newX = Math.floor((10 - newPiece.width) / 2); // Center the piece
  const newY = 0;

  // Check if game is over
  if (!isValidPosition(clearedBoard, newPiece, newX, newY)) {
    return {
      ...state,
      board: clearedBoard,
      score: state.score + additionalScore,
      lines: newLines,
      level: newLevel,
      status: GameStatus.GAME_OVER,
    };
  }

  // Return the updated state
  return {
    ...state,
    board: clearedBoard,
    currentPiece: newPiece,
    currentX: newX,
    currentY: newY,
    nextPiece: newNextPiece,
    score: state.score + additionalScore,
    lines: newLines,
    level: newLevel,
  };
};

// Start a new game
export const startGame = (state: GameState): GameState => {
  return {
    ...createInitialGameState(),
    status: GameStatus.PLAYING,
  };
};

// Pause or resume the game
export const togglePause = (state: GameState): GameState => {
  if (state.status === GameStatus.PLAYING) {
    return { ...state, status: GameStatus.PAUSED };
  } else if (state.status === GameStatus.PAUSED) {
    return { ...state, status: GameStatus.PLAYING };
  }
  return state;
};

// Calculate the position for the ghost piece (preview of where the piece will land)
export const getGhostPosition = (state: GameState): number => {
  let ghostY = state.currentY;
  
  // Find the lowest valid position
  while (isValidPosition(state.board, state.currentPiece, state.currentX, ghostY + 1)) {
    ghostY++;
  }
  
  return ghostY;
};