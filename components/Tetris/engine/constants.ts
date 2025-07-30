// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const DEFAULT_CELL_SIZE = 30;

// Function to calculate cell size based on viewport dimensions
export const calculateCellSize = (
  containerWidth: number,
  containerHeight: number
): number => {
  // Calculate maximum possible cell size based on width and height
  const maxCellSizeByWidth = Math.floor(containerWidth / BOARD_WIDTH);
  const maxCellSizeByHeight = Math.floor(containerHeight / BOARD_HEIGHT);
  
  // Use the smaller of the two to ensure the board fits
  let cellSize = Math.min(maxCellSizeByWidth, maxCellSizeByHeight);
  
  // Set a minimum cell size to ensure visibility
  const MIN_CELL_SIZE = 10;
  cellSize = Math.max(cellSize, MIN_CELL_SIZE);
  
  // Set a maximum cell size to prevent it from being too large
  const MAX_CELL_SIZE = 40;
  cellSize = Math.min(cellSize, MAX_CELL_SIZE);
  
  return cellSize;
};

// Game speeds in milliseconds (how often the piece moves down)
export const SPEED_LEVELS = [
  800,  // Level 0
  720,  // Level 1
  630,  // Level 2
  550,  // Level 3
  470,  // Level 4
  380,  // Level 5
  300,  // Level 6
  220,  // Level 7
  130,  // Level 8
  100,  // Level 9
  80,   // Level 10
];

// Scoring system
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

// Level up after clearing this many lines
export const LINES_PER_LEVEL = 10;

// Colors for tetrominos
export const COLORS = {
  I: '#00FFFF', // Cyan
  J: '#0000FF', // Blue
  L: '#FF7F00', // Orange
  O: '#FFFF00', // Yellow
  S: '#00FF00', // Green
  T: '#800080', // Purple
  Z: '#FF0000', // Red
  GHOST: 'rgba(255, 255, 255, 0.2)',
  BOARD_BG: '#000000',
  GRID: '#222222',
};

// Key codes for controls
export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',    // Rotate clockwise
  SPACE: ' ',       // Hard drop
  P: 'p',           // Pause
  R: 'r',           // Restart
};