'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const { getCartCount } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim();
      if (term) {
        window.location.href = `/games?search=${encodeURIComponent(term)}`;
      }
    }
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const cartCount = getCartCount();

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          GameHub
        </Link>
        
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <Link href="/">ホーム</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/games">ゲーム</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/categories">カテゴリ</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/sale">セール</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/support">サポート</Link>
          </li>
        </ul>
        
        <div className={styles.navActions}>
          <input
            type="text"
            className={styles.searchBox}
            placeholder="ゲームを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
          
          <div className={styles.authSection}>
            {isLoggedIn && currentUser ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userBtn}
                  onClick={handleUserMenuToggle}
                >
                  <span className={styles.userAvatar}>{currentUser.avatar}</span>
                  <span className={styles.userName}>{currentUser.name}</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>
                
                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)}>
                      👤 プロフィール
                    </Link>
                    <Link href="/cart" onClick={() => setUserMenuOpen(false)}>
                      🛒 カート
                    </Link>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)}>
                      📦 注文履歴
                    </Link>
                    {currentUser.isVIP && (
                      <Link href="/vip" onClick={() => setUserMenuOpen(false)}>
                        💎 VIP特典
                      </Link>
                    )}
                    <hr />
                    <button onClick={handleLogout}>
                      🚪 ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  ログイン
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                  新規登録
                </Link>
              </>
            )}
          </div>
          
          <Link href="/cart" className={styles.cartBtn}>
            🛒 カート ({cartCount})
          </Link>
        </div>
      </nav>
    </header>
  );
}
