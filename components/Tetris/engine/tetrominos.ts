// Define types for tetrominos
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

// Define the shape of each tetromino in its initial rotation
// 0 = empty space, 1 = filled cell
export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  width: number;
  height: number;
}

// Define all tetrominos with their shapes
export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    width: 4,
    height: 4,
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    width: 3,
    height: 3,
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    width: 3,
    height: 3,
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    width: 2,
    height: 2,
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    width: 3,
    height: 3,
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    width: 3,
    height: 3,
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    width: 3,
    height: 3,
  },
};

// Function to get a random tetromino
export const getRandomTetromino = (): Tetromino => {
  const tetrominoTypes = Object.keys(TETROMINOS) as TetrominoType[];
  const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
  return TETROMINOS[randomType];
};

// Function to rotate a tetromino (clockwise)
export const rotateTetromino = (tetromino: Tetromino): number[][] => {
  // Create a new matrix with swapped dimensions
  const rotated: number[][] = Array(tetromino.width)
    .fill(0)
    .map(() => Array(tetromino.height).fill(0));

  // Perform the rotation (90 degrees clockwise)
  for (let y = 0; y < tetromino.height; y++) {
    for (let x = 0; x < tetromino.width; x++) {
      rotated[x][tetromino.height - 1 - y] = tetromino.shape[y][x];
    }
  }

  return rotated;
};

// Function to create a deep copy of a tetromino
export const cloneTetromino = (tetromino: Tetromino): Tetromino => {
  return {
    type: tetromino.type,
    shape: tetromino.shape.map(row => [...row]),
    width: tetromino.width,
    height: tetromino.height,
  };
};