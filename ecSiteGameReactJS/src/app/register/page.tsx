'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './register.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, showMessage } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name || !confirmPassword) {
      showMessage('すべての項目を入力してください', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('パスワードが一致しません', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('パスワードは6文字以上で入力してください', 'error');
      return;
    }

    const result = register(email, password, name);
    
    if (result.success) {
      showMessage(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.registerContainer}>
          <div className={styles.registerForm}>
            <h1>新規登録</h1>
            <p className={styles.subtitle}>GameHubアカウントを作成</p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">お名前</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <label htmlFor="password">パスワード（6文字以上）</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">パスワード確認</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                アカウント作成
              </button>
            </form>
            
            <div className={styles.links}>
              <p>
                既にアカウントをお持ちの方は{' '}
                <Link href="/login">こちら</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
