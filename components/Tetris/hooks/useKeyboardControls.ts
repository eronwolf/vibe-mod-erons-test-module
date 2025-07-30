import { useEffect, useCallback } from 'react';
import { KEYS } from '../engine/constants';
import { GameStatus } from '../engine/gameState';

type KeyboardControlsProps = {
  status: GameStatus;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  onStart: () => void;
};

export const useKeyboardControls = ({
  status,
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
  onStart,
}: KeyboardControlsProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default behavior for game controls
      if (
        event.key === KEYS.LEFT ||
        event.key === KEYS.RIGHT ||
        event.key === KEYS.DOWN ||
        event.key === KEYS.UP ||
        event.key === KEYS.SPACE
      ) {
        event.preventDefault();
      }

      // Only process movement keys if the game is playing
      if (status === GameStatus.PLAYING) {
        switch (event.key) {
          case KEYS.LEFT:
            onMoveLeft();
            break;
          case KEYS.RIGHT:
            onMoveRight();
            break;
          case KEYS.DOWN:
            onMoveDown();
            break;
          case KEYS.UP:
            onRotate();
            break;
          case KEYS.SPACE:
            onHardDrop();
            break;
          case KEYS.P:
            onPause();
            break;
        }
      } else if (status === GameStatus.PAUSED && event.key === KEYS.P) {
        // Resume game if paused
        onPause();
      } else if ((status === GameStatus.READY || status === GameStatus.GAME_OVER) && event.key === KEYS.SPACE) {
        // Start new game if ready or game over
        onStart();
      }
    },
    [status, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onPause, onStart]
  );

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardControls;