'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './cart.module.css';

export default function CartPage() {
  const { currentUser } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, checkout } = useCart();
  
  const cartItems = Object.values(cart);
  const totals = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <Header />
        
        <main className={styles.main}>
          {!currentUser && (
            <div className={styles.loginPrompt}>
              <p>
                💡 <strong>ヒント:</strong> ログインすると、カートの商品が保存され、VIP特典も利用できます！
                <Link href="/login">ログインする</Link>
              </p>
            </div>
          )}
          
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>🛒</div>
            <h2>カートは空です</h2>
            <p>お気に入りのゲームを見つけてカートに追加しましょう！</p>
            <Link href="/games" className={styles.shopButton}>
              ゲームを探す
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {!currentUser && (
          <div className={styles.loginPrompt}>
            <p>
              🔒 <strong>ログインのご案内:</strong> ログインすると商品が保存され、VIP特典（15%OFF）も利用できます！
              <Link href="/login">ログインする</Link>
            </p>
          </div>
        )}
        
        <div className={styles.cartHeader}>
          <h2>🛒 ショッピングカート</h2>
          <button className={styles.clearCartBtn} onClick={clearCart}>
            全て削除
          </button>
        </div>
        
        <div className={styles.cartItems}>
          {cartItems.map((item) => {
            const itemTotal = item.game.price * item.quantity;
            return (
              <div key={item.game.id} className={styles.cartItem}>
                <div className={styles.itemImage}>{item.game.icon}</div>
                
                <div className={styles.itemDetails}>
                  <h3>{item.game.name}</h3>
                  <p className={styles.itemPlatform}>{item.game.platform}</p>
                  <p className={styles.itemCategory}>{item.game.category}</p>
                </div>
                
                <div className={styles.itemQuantity}>
                  <button 
                    onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.game.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                
                <div className={styles.itemPrice}>
                  <span className={styles.unitPrice}>¥{item.game.price.toLocaleString()}</span>
                  <span className={styles.totalPrice}>¥{itemTotal.toLocaleString()}</span>
                </div>
                
                <div className={styles.itemActions}>
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => removeFromCart(item.game.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.cartSummary}>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>小計:</span>
              <span>¥{totals.subtotal.toLocaleString()}</span>
            </div>
            
            {currentUser && currentUser.isVIP && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>VIP割引 (15%):</span>
                <span>-¥{totals.discount.toLocaleString()}</span>
              </div>
            )}
            
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>合計:</span>
              <span>¥{totals.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className={styles.checkoutSection}>
            <button className={styles.checkoutBtn} onClick={checkout}>
              {currentUser ? '決済に進む' : 'ログインして決済'}
            </button>
            <Link href="/games" className={styles.continueShopping}>
              ショッピングを続ける
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
