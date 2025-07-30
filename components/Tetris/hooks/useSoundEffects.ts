import { useEffect, useCallback, useState } from 'react';
import { getSoundManager, SoundEffect } from '../utils/soundManager';

export const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize sound manager
  useEffect(() => {
    const soundManager = getSoundManager();
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  // Play a sound effect
  const playSound = useCallback((effect: SoundEffect) => {
    const soundManager = getSoundManager();
    soundManager.play(effect);
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    const soundManager = getSoundManager();
    const newState = !soundManager.isEnabled();
    soundManager.toggleSound(newState);
    setSoundEnabled(newState);
  }, []);

  return {
    soundEnabled,
    playSound,
    toggleSound,
  };
};

export default useSoundEffects;