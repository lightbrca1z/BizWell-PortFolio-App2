'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Game } from '@/types/cart';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: Game;
  showRating?: boolean;
}

export default function GameCard({ game, showRating = true }: GameCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game.id);
  };

  return (
    <Link href={`/game/${game.id}`} className={styles.gameCard}>
      <div className={styles.gameImage}>
        {game.icon}
      </div>
      
      <div className={styles.gameInfo}>
        <h3 className={styles.gameTitle}>{game.name}</h3>
        <p className={styles.gamePlatform}>{game.platform}</p>
        
        {showRating && game.rating && (
          <div className={styles.gameRating}>
            <span className={styles.stars}>
              {game.stars || '★★★★☆'}
            </span>
            <span>({game.rating})</span>
          </div>
        )}
        
        <div className={styles.gamePrice}>
          ¥{game.price.toLocaleString()}
        </div>
        
        <button
          className={styles.addToCart}
          onClick={handleAddToCart}
        >
          カートに追加
        </button>
      </div>
    </Link>
  );
}
