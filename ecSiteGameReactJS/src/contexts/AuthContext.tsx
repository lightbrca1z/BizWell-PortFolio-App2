'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});

  // ローカルストレージからユーザー情報を読み込み
  const loadUsers = (): Record<string, User> => {
    if (typeof window === 'undefined') return {};
    
    const savedUsers = localStorage.getItem('gamehub_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    } else {
      // デフォルトユーザーを作成
      const defaultUsers = {
        'admin@gamehub.com': {
          email: 'admin@gamehub.com',
          password: 'admin123',
          name: '管理者',
          joinDate: new Date().toISOString(),
          isVIP: true,
          avatar: '👨‍💼'
        },
        'user@example.com': {
          email: 'user@example.com',
          password: 'user123',
          name: '田中太郎',
          joinDate: new Date().toISOString(),
          isVIP: false,
          avatar: '🎮'
        }
      };
      saveUsers(defaultUsers);
      return defaultUsers;
    }
  };

  // ユーザー情報をローカルストレージに保存
  const saveUsers = (usersData: Record<string, User>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('gamehub_users', JSON.stringify(usersData));
    setUsers(usersData);
  };

  // 現在のユーザーを読み込み
  const loadCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const savedUser = localStorage.getItem('gamehub_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  };

  // 現在のユーザーを保存
  const saveCurrentUser = (user: User | null) => {
    if (typeof window === 'undefined') return;
    
    if (user) {
      localStorage.setItem('gamehub_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gamehub_current_user');
    }
    setCurrentUser(user);
  };

  // ランダムアバターを取得
  const getRandomAvatar = (): string => {
    const avatars = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎺', '🎸', '🎤', '🎧'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  // ログイン
  const login = (email: string, password: string) => {
    const user = users[email];
    if (user && user.password === password) {
      saveCurrentUser(user);
      
      return {
        success: true,
        message: `${user.name}さん、おかえりなさい！`,
        user: user
      };
    } else {
      return {
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      };
    }
  };

  // ユーザー登録
  const register = (email: string, password: string, name: string) => {
    if (users[email]) {
      return {
        success: false,
        message: 'このメールアドレスは既に登録されています'
      };
    }

    const newUser: User = {
      email: email,
      password: password,
      name: name,
      joinDate: new Date().toISOString(),
      isVIP: false,
      avatar: getRandomAvatar()
    };

    const updatedUsers = { ...users, [email]: newUser };
    saveUsers(updatedUsers);
    
    return {
      success: true,
      message: '登録が完了しました！ログインしてください。',
      user: newUser
    };
  };

  // ログアウト
  const logout = () => {
    saveCurrentUser(null);
    showMessage('ログアウトしました', 'success');
    
    // ホームページにリダイレクト
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  // ユーザー情報更新
  const updateUser = (updatedData: Partial<User>): boolean => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      const updatedUsers = { ...users, [currentUser.email]: updatedUser };
      saveUsers(updatedUsers);
      saveCurrentUser(updatedUser);
      return true;
    }
    return false;
  };

  // メッセージ表示
  const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message ${type}`;
    messageDiv.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;

    // メッセージスタイル
    const styles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '10000',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      animation: 'slideIn 0.3s ease',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
      maxWidth: '400px'
    };

    const typeStyles = {
      success: { background: '#28a745' },
      error: { background: '#dc3545' },
      warning: { background: '#ffc107', color: '#333' },
      info: { background: '#007bff' }
    };

    Object.assign(messageDiv.style, styles, typeStyles[type]);

    document.body.appendChild(messageDiv);

    // 3秒後に自動削除
    setTimeout(() => {
      if (messageDiv.parentElement) {
        messageDiv.remove();
      }
    }, 3000);
  };

  // コンポーネント初期化
  useEffect(() => {
    const loadedUsers = loadUsers();
    setUsers(loadedUsers);
    const loadedCurrentUser = loadCurrentUser();
    setCurrentUser(loadedCurrentUser);
  }, []);

  const isLoggedIn = currentUser !== null;

  const value: AuthContextType = {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    updateUser,
    showMessage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
