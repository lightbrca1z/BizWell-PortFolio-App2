'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>GameHub</h3>
          <ul>
            <li><Link href="/about">会社概要</Link></li>
            <li><Link href="/careers">採用情報</Link></li>
            <li><Link href="/press">プレスリリース</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h3>サービス</h3>
          <ul>
            <li><Link href="/games">ゲーム一覧</Link></li>
            <li><Link href="/sale">セール情報</Link></li>
            <li><Link href="/preorder">プリオーダー</Link></li>
            <li><Link href="/gift">ギフトカード</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h3>サポート</h3>
          <ul>
            <li><Link href="/help">ヘルプセンター</Link></li>
            <li><Link href="/returns">返品・交換</Link></li>
            <li><Link href="/shipping">配送について</Link></li>
            <li><Link href="/faq">よくある質問</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerSection}>
          <h3>フォローする</h3>
          <ul>
            <li><Link href="https://twitter.com" target="_blank">Twitter</Link></li>
            <li><Link href="https://instagram.com" target="_blank">Instagram</Link></li>
            <li><Link href="https://youtube.com" target="_blank">YouTube</Link></li>
            <li><Link href="https://discord.com" target="_blank">Discord</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; 2024 GameHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
