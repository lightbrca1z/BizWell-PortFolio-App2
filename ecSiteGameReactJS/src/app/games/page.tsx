'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './games.module.css';

export default function GamesPage() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <h1>ゲーム一覧</h1>
        <p>現在準備中です。近日公開予定！</p>
        <div className={styles.comingSoon}>
          <div className={styles.icon}>🎮</div>
          <p>豊富なゲームラインナップを準備中です...</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
