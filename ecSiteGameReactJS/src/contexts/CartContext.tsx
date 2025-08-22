'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, CartItem, CartTotals, CartContextType } from '@/types/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const { currentUser, showMessage } = useAuth();

  // ローカルストレージからカート情報を読み込み
  const loadCartFromStorage = () => {
    if (typeof window === 'undefined') return;

    if (currentUser) {
      const cartKey = `gamehub_cart_${currentUser.email}`;
      const savedCart = localStorage.getItem(cartKey);
      const userCart = savedCart ? JSON.parse(savedCart) : {};
      
      // 非ログイン時のカートがあれば統合
      const guestCartKey = 'gamehub_cart_guest';
      const guestCart = localStorage.getItem(guestCartKey);
      if (guestCart) {
        const guestCartData = JSON.parse(guestCart);
        const mergedCart = mergeGuestCart(userCart, guestCartData);
        setCart(mergedCart);
        localStorage.removeItem(guestCartKey); // ゲストカートを削除
        saveCartToStorage(mergedCart);
        
        if (Object.keys(guestCartData).length > 0) {
          showMessage('ゲスト時のカート商品を統合しました', 'success');
        }
      } else {
        setCart(userCart);
      }
    } else {
      // 非ログイン時はゲスト用カートを使用
      const guestCartKey = 'gamehub_cart_guest';
      const savedCart = localStorage.getItem(guestCartKey);
      setCart(savedCart ? JSON.parse(savedCart) : {});
    }
  };

  // カート情報をローカルストレージに保存
  const saveCartToStorage = (cartData: Record<string, CartItem>) => {
    if (typeof window === 'undefined') return;

    if (currentUser) {
      const cartKey = `gamehub_cart_${currentUser.email}`;
      localStorage.setItem(cartKey, JSON.stringify(cartData));
    } else {
      // 非ログイン時はゲスト用カートに保存
      const guestCartKey = 'gamehub_cart_guest';
      localStorage.setItem(guestCartKey, JSON.stringify(cartData));
    }
  };

  // ゲストカートとユーザーカートを統合
  const mergeGuestCart = (userCart: Record<string, CartItem>, guestCart: Record<string, CartItem>) => {
    const merged = { ...userCart };
    
    Object.keys(guestCart).forEach(gameId => {
      if (merged[gameId]) {
        // 既存の商品がある場合は数量を追加
        merged[gameId].quantity += guestCart[gameId].quantity;
      } else {
        // 新しい商品の場合は追加
        merged[gameId] = guestCart[gameId];
      }
    });
    
    return merged;
  };

  // ゲーム情報を取得
  const getGameById = (gameId: number): Game | null => {
    // index.htmlの注目ゲームに対応する固定データ
    const featuredGames: Game[] = [
      { id: 1, name: 'アドベンチャークエスト', price: 5980, icon: '🎮', category: 'アクション', platform: 'PC / PlayStation / Xbox' },
      { id: 2, name: 'スピードレーサー', price: 4580, icon: '🏎️', category: 'レーシング', platform: 'PC / Nintendo Switch' },
      { id: 3, name: 'ファンタジーキングダム', price: 7280, icon: '🗡️', category: 'RPG', platform: 'PC / PlayStation' },
      { id: 4, name: 'マジックパズル', price: 1980, icon: '🧩', category: 'パズル', platform: 'PC / Mobile' },
      { id: 5, name: 'スペースバトル', price: 6480, icon: '🚀', category: 'アクション', platform: 'PC / Xbox' },
      { id: 6, name: 'アーチャーヒーロー', price: 3980, icon: '🏹', category: 'アクション', platform: 'PC / Nintendo Switch' }
    ];

    // まず注目ゲームから検索
    let game = featuredGames.find(game => game.id === gameId);
    
    // 見つからない場合は、フォールバック
    if (!game) {
      const fallbackGames = generateFallbackGames();
      game = fallbackGames.find(game => game.id === gameId);
    }
    
    return game || null;
  };

  // フォールバック用のゲームデータ生成
  const generateFallbackGames = (): Game[] => {
    const gameCategories = ['アクション', 'RPG', 'レーシング', 'パズル', 'ストラテジー', 'スポーツ', 'シミュレーション'];
    const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
    const gameIcons = ['🎮', '🏎️', '🗡️', '🧩', '🚀', '🏹', '⚔️', '🎯', '🏆', '🎲', '🔫', '🛡️'];
    const gameNames = [
      'アドベンチャークエスト', 'スピードレーサー', 'ファンタジーキングダム', 'マジックパズル', 'スペースバトル',
      'アーチャーヒーロー', 'ドラゴンソード', 'レーシングマスター', 'パズルワールド', 'スターウォーズ',
      'ナイトクエスト', 'サッカーチャンピオン', 'フライトシミュレーター', 'ゾンビハンター', 'カードバトル',
      'タワーディフェンス', 'フィッシングマスター', 'クッキングシェフ', 'ダンシングスター', 'ミュージックビート'
    ];
    
    // シードベースのランダム関数
    function seededRandom(seed: number): number {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }
    
    const games: Game[] = [];
    for (let i = 1; i <= 100; i++) {
      const categorySeed = i * 7 + 13;
      const platformSeed = i * 11 + 17;
      const iconSeed = i * 13 + 19;
      const nameSeed = i * 17 + 23;
      const priceSeed = i * 19 + 29;
      const ratingSeed = i * 23 + 31;

      const category = gameCategories[Math.floor(seededRandom(categorySeed) * gameCategories.length)];
      const platform = platforms[Math.floor(seededRandom(platformSeed) * platforms.length)];
      const icon = gameIcons[Math.floor(seededRandom(iconSeed) * gameIcons.length)];
      const baseName = gameNames[Math.floor(seededRandom(nameSeed) * gameNames.length)];
      const price = Math.floor(seededRandom(priceSeed) * 8000) + 1000;
      const rating = parseFloat((seededRandom(ratingSeed) * 2 + 3).toFixed(1));
      
      games.push({
        id: i,
        name: `${baseName} ${i}`,
        category: category,
        platform: platform,
        price: price,
        rating: rating,
        icon: icon,
        stars: '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
      });
    }
    return games;
  };

  // カートにアイテムを追加
  const addToCart = (gameId: number, quantity: number = 1): boolean => {
    const game = getGameById(gameId);
    if (!game) {
      showMessage('ゲームが見つかりません', 'error');
      return false;
    }

    const newCart = { ...cart };
    
    if (newCart[gameId]) {
      newCart[gameId].quantity += quantity;
    } else {
      newCart[gameId] = {
        game: game,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
    }

    setCart(newCart);
    saveCartToStorage(newCart);
    
    // VIP割引を適用（ログイン時のみ）
    const discount = currentUser && currentUser.isVIP ? 15 : 0;
    const discountText = discount > 0 ? ` (VIP${discount}%OFF適用)` : '';
    
    // ログイン状態に応じたメッセージ
    let message = `${game.name}をカートに追加しました${discountText}`;
    if (!currentUser) {
      message += ' (ログインすると特典が適用されます)';
    }
    
    showMessage(message, 'success');
    return true;
  };

  // カートからアイテムを削除
  const removeFromCart = (gameId: number) => {
    if (cart[gameId]) {
      const gameName = cart[gameId].game.name;
      const newCart = { ...cart };
      delete newCart[gameId];
      setCart(newCart);
      saveCartToStorage(newCart);
      showMessage(`${gameName}をカートから削除しました`, 'info');
    }
  };

  // カートのアイテム数量を更新
  const updateQuantity = (gameId: number, quantity: number) => {
    if (cart[gameId] && quantity > 0) {
      const newCart = { ...cart };
      newCart[gameId].quantity = quantity;
      setCart(newCart);
      saveCartToStorage(newCart);
    } else if (quantity <= 0) {
      removeFromCart(gameId);
    }
  };

  // カートをクリア
  const clearCart = () => {
    setCart({});
    saveCartToStorage({});
  };

  // カートアイテム数を取得
  const getCartCount = (): number => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  // カート合計金額を計算
  const getCartTotal = (): CartTotals => {
    const vipDiscount = currentUser && currentUser.isVIP ? 0.15 : 0;
    
    let subtotal = 0;
    Object.values(cart).forEach(item => {
      subtotal += item.game.price * item.quantity;
    });
    
    const discount = subtotal * vipDiscount;
    const total = subtotal - discount;
    
    return {
      subtotal: subtotal,
      discount: discount,
      total: total
    };
  };

  // 決済処理
  const checkout = () => {
    if (!currentUser) {
      showMessage('決済にはログインが必要です', 'warning');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }

    if (Object.keys(cart).length === 0) {
      showMessage('カートが空です', 'warning');
      return;
    }

    const totals = getCartTotal();
    const itemCount = getCartCount();
    
    const vipText = currentUser.isVIP ? ' (VIP特典適用)' : '';
    const confirmMessage = `決済を開始しますか？${vipText}\n\n商品数: ${itemCount}点\n合計金額: ¥${totals.total.toLocaleString()}`;
    
    if (confirm(confirmMessage)) {
      showMessage('決済処理中...', 'info');
      
      setTimeout(() => {
        // 購入履歴に追加
        addToOrderHistory();
        
        // カートをクリア
        clearCart();
        
        showMessage('購入が完了しました！ありがとうございます。', 'success');
        
        // 成功ページにリダイレクト
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }, 2000);
    }
  };

  // 注文履歴に追加
  const addToOrderHistory = () => {
    if (!currentUser || typeof window === 'undefined') return;

    const orderKey = `gamehub_orders_${currentUser.email}`;
    const existingOrders = JSON.parse(localStorage.getItem(orderKey) || '[]');
    
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: Object.values(cart),
      totals: getCartTotal(),
      status: 'completed'
    };
    
    existingOrders.unshift(newOrder);
    localStorage.setItem(orderKey, JSON.stringify(existingOrders));
  };

  // カート情報を取得
  const getCartInfo = () => {
    return {
      items: cart,
      count: getCartCount(),
      totals: getCartTotal()
    };
  };

  // ユーザーログイン状態変更時にカートを再読み込み
  useEffect(() => {
    loadCartFromStorage();
  }, [currentUser]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartInfo,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
