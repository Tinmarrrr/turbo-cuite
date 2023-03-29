import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/home/home.module.scss'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.diagonalLine}>
        <div className={styles.body}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>TURBOCUITE</h1>
          </ div>  {/* titleContainer */}
          <div className={styles.interactions}>
            <a className={styles.btn} href="#">CONTRIBUER</a>
            <a className={styles.btn} href="http://localhost:3000/players">JOUER</a>
          </div> {/* interactions */}
        </div> {/* body */}
      </div> {/* diagonalLine */}
    </div> /* wrapper */
  )
}
