'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import { Game } from '@/types/cart';
import styles from './page.module.css';

// 注目ゲームのデータ
const featuredGames: Game[] = [
  { id: 1, name: 'アドベンチャークエスト', price: 5980, icon: '🎮', category: 'アクション', platform: 'PC / PlayStation / Xbox', rating: 4.2, stars: '★★★★☆' },
  { id: 2, name: 'スピードレーサー', price: 4580, icon: '🏎️', category: 'レーシング', platform: 'PC / Nintendo Switch', rating: 4.8, stars: '★★★★★' },
  { id: 3, name: 'ファンタジーキングダム', price: 7280, icon: '🗡️', category: 'RPG', platform: 'PC / PlayStation', rating: 4.5, stars: '★★★★☆' },
  { id: 4, name: 'マジックパズル', price: 1980, icon: '🧩', category: 'パズル', platform: 'PC / Mobile', rating: 4.0, stars: '★★★★☆' },
  { id: 5, name: 'スペースバトル', price: 6480, icon: '🚀', category: 'アクション', platform: 'PC / Xbox', rating: 4.9, stars: '★★★★★' },
  { id: 6, name: 'アーチャーヒーロー', price: 3980, icon: '🏹', category: 'アクション', platform: 'PC / Nintendo Switch', rating: 4.3, stars: '★★★★☆' },
];

// カテゴリデータ
const categories = [
  { name: 'アクション', icon: '🎯' },
  { name: 'パズル', icon: '🧩' },
  { name: 'レーシング', icon: '🏁' },
  { name: 'RPG', icon: '⚔️' },
  { name: 'ストラテジー', icon: '🎲' },
  { name: 'マルチプレイ', icon: '👥' },
];

export default function HomePage() {
  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/games?category=${encodeURIComponent(categoryName)}`;
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* ヒーローセクション */}
        <section className={styles.hero}>
          <h1>最新ゲームをお得に購入</h1>
          <p>人気ゲームから話題の新作まで、豊富な品揃えでお待ちしています</p>
          <Link href="/games" className={styles.ctaBtn}>
            今すぐ購入する
          </Link>
        </section>

        {/* カテゴリセクション */}
        <section id="categories">
          <h2 className={styles.sectionTitle}>ゲームカテゴリ</h2>
          <div className={styles.categories}>
            {categories.map((category) => (
              <div
                key={category.name}
                className={styles.categoryCard}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className={styles.categoryIcon}>{category.icon}</div>
                <div className={styles.categoryName}>{category.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 注目ゲーム */}
        <section id="featured-games">
          <h2 className={styles.sectionTitle}>注目ゲーム</h2>
          <div className={styles.gameGrid}>
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          
          <div className={styles.viewAllGames}>
            <Link href="/games" className={styles.ctaBtn}>
              すべてのゲームを見る
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
