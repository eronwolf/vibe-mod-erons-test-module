// Define the types of sounds in the game
export enum SoundEffect {
  MOVE = 'move',
  ROTATE = 'rotate',
  DROP = 'drop',
  CLEAR_LINE = 'clearLine',
  LEVEL_UP = 'levelUp',
  GAME_OVER = 'gameOver',
}

// Class to manage sound effects
export class SoundManager {
  private sounds: Map<SoundEffect, HTMLAudioElement>;
  private enabled: boolean;

  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.initSounds();
  }

  // Initialize sound effects
  private initSounds(): void {
    // Create audio elements for each sound effect
    // In a real implementation, you would use actual sound files
    this.createSound(SoundEffect.MOVE, 'move.mp3');
    this.createSound(SoundEffect.ROTATE, 'rotate.mp3');
    this.createSound(SoundEffect.DROP, 'drop.mp3');
    this.createSound(SoundEffect.CLEAR_LINE, 'clear.mp3');
    this.createSound(SoundEffect.LEVEL_UP, 'levelup.mp3');
    this.createSound(SoundEffect.GAME_OVER, 'gameover.mp3');
  }

  // Create an audio element for a sound effect
  private createSound(type: SoundEffect, filename: string): void {
    if (typeof window !== 'undefined') {
      const audio = new Audio(`/sounds/${filename}`);
      audio.volume = 0.5;
      this.sounds.set(type, audio);
    }
  }

  // Play a sound effect
  play(type: SoundEffect): void {
    if (!this.enabled || typeof window === 'undefined') return;

    const sound = this.sounds.get(type);
    if (sound) {
      // Reset the sound to the beginning if it's already playing
      sound.currentTime = 0;
      sound.play().catch(error => {
        // Handle any errors (e.g., if the browser blocks autoplay)
        console.error(`Error playing sound: ${error}`);
      });
    }
  }

  // Enable or disable sound effects
  toggleSound(enabled: boolean): void {
    this.enabled = enabled;
  }

  // Check if sound is enabled
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create a singleton instance
let instance: SoundManager | null = null;

// Get the sound manager instance
export const getSoundManager = (): SoundManager => {
  if (!instance && typeof window !== 'undefined') {
    instance = new SoundManager();
  }
  return instance as SoundManager;
};

export default getSoundManager;