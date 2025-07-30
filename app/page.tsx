'use client'

import TetrisGame from '../components/Tetris/TetrisGame'
import styles from '../styles/home.module.css'

export default () => {
  return (
    <main className={styles.main}>
      <h1>Tetris Game</h1>
      <TetrisGame />
    </main>
  );
}
