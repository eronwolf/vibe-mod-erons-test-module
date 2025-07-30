import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStatus, getCurrentSpeed, moveDown } from '../engine/gameState';

type GameLoopProps = {
  gameState: GameState;
  onUpdate: (newState: GameState) => void;
};

export const useGameLoop = ({ gameState, onUpdate }: GameLoopProps) => {
  const [lastTime, setLastTime] = useState<number>(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // Calculate the drop interval based on the current level
  const dropInterval = getCurrentSpeed(gameState.level);

  // The main game loop
  const gameLoop = useCallback(
    (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;

      // Only update if the game is playing
      if (gameState.status === GameStatus.PLAYING) {
        // Update last time
        setLastTime((prevTime) => {
          const newTime = prevTime + deltaTime;

          // Move the piece down if enough time has passed
          if (newTime > dropInterval) {
            onUpdate(moveDown(gameState));
            return 0; // Reset the timer
          }

          return newTime;
        });
      }

      // Continue the loop
      requestRef.current = requestAnimationFrame(gameLoop);
    },
    [gameState, dropInterval, onUpdate]
  );

  // Start the game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    
    // Clean up
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop]);

  // Reset the timer when the game status changes
  useEffect(() => {
    setLastTime(0);
    previousTimeRef.current = undefined;
  }, [gameState.status]);
};

export default useGameLoop;