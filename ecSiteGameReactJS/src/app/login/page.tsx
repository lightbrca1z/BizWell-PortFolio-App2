'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, showMessage } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showMessage('メールアドレスとパスワードを入力してください', 'warning');
      return;
    }

    const result = login(email, password);
    
    if (result.success) {
      showMessage(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <h1>ログイン</h1>
            <p className={styles.subtitle}>GameHubへようこそ</p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">メールアドレス</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password">パスワード</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                ログイン
              </button>
            </form>
            
            <div className={styles.links}>
              <p>
                アカウントをお持ちでない方は{' '}
                <Link href="/register">こちら</Link>
              </p>
            </div>
            
            <div className={styles.demoAccounts}>
              <h3>デモアカウント</h3>
              <div className={styles.demoAccount}>
                <strong>管理者:</strong> admin@gamehub.com / admin123
              </div>
              <div className={styles.demoAccount}>
                <strong>一般ユーザー:</strong> user@example.com / user123
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
