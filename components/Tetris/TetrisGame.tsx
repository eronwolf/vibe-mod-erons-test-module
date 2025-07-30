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
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from './engine/constants';
import { drawNextPiece, clearCanvas } from './utils/canvas';
import styles from './styles/Tetris.module.css';

const TetrisGame: React.FC = () => {
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  
  // Reference for the next piece preview canvas
  const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate dimensions
  const boardWidth = BOARD_WIDTH * CELL_SIZE;
  const boardHeight = BOARD_HEIGHT * CELL_SIZE;
  const nextPieceWidth = 4 * CELL_SIZE;
  const nextPieceHeight = 4 * CELL_SIZE;

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

    // Clear the canvas
    clearCanvas(ctx, nextPieceWidth, nextPieceHeight);
    
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, nextPieceWidth, nextPieceHeight);
    
    // Draw the next piece
    drawNextPiece(ctx, gameState.nextPiece, nextPieceWidth, nextPieceHeight);
  }, [gameState.nextPiece, nextPieceWidth, nextPieceHeight]);

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
        
        <div className={styles.nextPiece}>
          <h3 className={styles.nextPieceTitle}>Next Piece</h3>
          <canvas
            ref={nextPieceCanvasRef}
            width={nextPieceWidth}
            height={nextPieceHeight}
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