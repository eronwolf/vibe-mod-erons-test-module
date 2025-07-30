'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import TetrisCanvas from './TetrisCanvas';
import useKeyboardControls from './hooks/useKeyboardControls';
import useGameLoop from './hooks/useGameLoop';
import useSoundEffects from './hooks/useSoundEffects';
import { SoundEffect } from './utils/soundManager';
import {
  GameState,
  GameStatus,
  createInitialGameState,
  moveLeft,
  moveRight,
  moveDown,
  rotatePiece,
  hardDrop,
  togglePause,
  startGame
} from './engine/gameState';
import { BOARD_WIDTH, BOARD_HEIGHT, DEFAULT_CELL_SIZE, calculateCellSize } from './engine/constants';
import { drawNextPiece, clearCanvas } from './utils/canvas';
import styles from './styles/Tetris.module.css';

const TetrisGame: React.FC = () => {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  
  // Reference for the next piece preview canvas and its container
  const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null);
  const nextPieceContainerRef = useRef<HTMLDivElement>(null);
  
  // State for cell size
  const [cellSize, setCellSize] = useState(DEFAULT_CELL_SIZE);
  
  // Calculate dimensions based on cell size
  const boardWidth = BOARD_WIDTH * cellSize;
  const boardHeight = BOARD_HEIGHT * cellSize;
  const nextPieceWidth = 4 * cellSize;
  const nextPieceHeight = 4 * cellSize;
  
  // Update cell size when window resizes
  useEffect(() => {
    const updateCellSize = () => {
      if (nextPieceContainerRef.current) {
        // For the next piece preview, we want a smaller cell size
        const containerWidth = nextPieceContainerRef.current.clientWidth;
        const newCellSize = Math.floor(containerWidth / 5); // Divide by 5 to leave some margin
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

  // Initialize sound effects
  const { soundEnabled, playSound, toggleSound } = useSoundEffects();

  // Game action handlers
  const handleMoveLeft = useCallback(() => {
    const newState = moveLeft(gameState);
    if (newState !== gameState) {
      setGameState(newState);
      playSound(SoundEffect.MOVE);
    }
  }, [gameState, playSound]);

  const handleMoveRight = useCallback(() => {
    const newState = moveRight(gameState);
    if (newState !== gameState) {
      setGameState(newState);
      playSound(SoundEffect.MOVE);
    }
  }, [gameState, playSound]);

  const handleMoveDown = useCallback(() => {
    const newState = moveDown(gameState);
    if (newState !== gameState) {
      setGameState(newState);
      playSound(SoundEffect.MOVE);
    }
  }, [gameState, playSound]);

  const handleRotate = useCallback(() => {
    const newState = rotatePiece(gameState);
    if (newState !== gameState) {
      setGameState(newState);
      playSound(SoundEffect.ROTATE);
    }
  }, [gameState, playSound]);

  const handleHardDrop = useCallback(() => {
    const newState = hardDrop(gameState);
    setGameState(newState);
    playSound(SoundEffect.DROP);
  }, [gameState, playSound]);

  const handlePause = useCallback(() => {
    const newState = togglePause(gameState);
    setGameState(newState);
  }, [gameState]);

  const handleStart = useCallback(() => {
    const newState = startGame(gameState);
    setGameState(newState);
    playSound(SoundEffect.LEVEL_UP); // Play a sound when starting the game
  }, [gameState, playSound]);

  // Update game state from game loop
  const handleGameUpdate = useCallback((newState: GameState) => {
    // Check if lines were cleared
    if (newState.lines > gameState.lines) {
      playSound(SoundEffect.CLEAR_LINE);
    }
    
    // Check if level increased
    if (newState.level > gameState.level) {
      playSound(SoundEffect.LEVEL_UP);
    }
    
    // Check if game over
    if (newState.status === GameStatus.GAME_OVER && gameState.status === GameStatus.PLAYING) {
      playSound(SoundEffect.GAME_OVER);
    }
    
    setGameState(newState);
  }, [gameState, playSound]);

  // Set up keyboard controls
  useKeyboardControls({
    status: gameState.status,
    onMoveLeft: handleMoveLeft,
    onMoveRight: handleMoveRight,
    onMoveDown: handleMoveDown,
    onRotate: handleRotate,
    onHardDrop: handleHardDrop,
    onPause: handlePause,
    onStart: handleStart,
  });

  // Set up game loop
  useGameLoop({
    gameState,
    onUpdate: handleGameUpdate,
  });

  // Draw the next piece preview
  useEffect(() => {
    const canvas = nextPieceCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update canvas dimensions
    canvas.width = nextPieceWidth;
    canvas.height = nextPieceHeight;

    // Clear the canvas
    clearCanvas(ctx, nextPieceWidth, nextPieceHeight);
    
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, nextPieceWidth, nextPieceHeight);
    
    // Draw the next piece
    drawNextPiece(ctx, gameState.nextPiece, nextPieceWidth, nextPieceHeight, cellSize);
  }, [gameState.nextPiece, nextPieceWidth, nextPieceHeight, cellSize]);

  return (
    <div className={styles.tetrisContainer}>
      <div className={styles.gameInfo}>
        <h1 className={styles.title}>TETRIS</h1>
        
        <div className={styles.scoreBoard}>
          <div className={styles.scoreItem}>
            <span className={styles.label}>Score:</span>
            <span className={styles.value}>{gameState.score}</span>
          </div>
          
          <div className={styles.scoreItem}>
            <span className={styles.label}>Level:</span>
            <span className={styles.value}>{gameState.level}</span>
          </div>
          
          <div className={styles.scoreItem}>
            <span className={styles.label}>Lines:</span>
            <span className={styles.value}>{gameState.lines}</span>
          </div>
        </div>
        
        <div className={styles.nextPiece} ref={nextPieceContainerRef}>
          <h3 className={styles.nextPieceTitle}>Next Piece</h3>
          <canvas
            ref={nextPieceCanvasRef}
            className={styles.nextPieceCanvas}
          />
        </div>
        
        <div className={styles.controls}>
          <h3 className={styles.controlsTitle}>Controls</h3>
          <ul className={styles.controlsList}>
            <li>← → : Move</li>
            <li>↑ : Rotate</li>
            <li>↓ : Soft Drop</li>
            <li>SPACE : Hard Drop</li>
            <li>P : Pause</li>
          </ul>
          
          <div className={styles.soundToggle}>
            <button
              className={styles.soundButton}
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
            </button>
          </div>
        </div>
        
        {gameState.status === GameStatus.READY && (
          <button className={styles.startButton} onClick={handleStart}>
            Start Game
          </button>
        )}
        
        {gameState.status === GameStatus.GAME_OVER && (
          <button className={styles.startButton} onClick={handleStart}>
            Play Again
          </button>
        )}
        
        {gameState.status === GameStatus.PLAYING && (
          <button className={styles.pauseButton} onClick={handlePause}>
            Pause
          </button>
        )}
        
        {gameState.status === GameStatus.PAUSED && (
          <button className={styles.pauseButton} onClick={handlePause}>
            Resume
          </button>
        )}
      </div>
      
      <div className={styles.gameBoard}>
        <TetrisCanvas gameState={gameState} />
      </div>
    </div>
  );
};

export default TetrisGame;