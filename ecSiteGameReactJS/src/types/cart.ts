export interface Game {
  id: number;
  name: string;
  price: number;
  icon: string;
  category: string;
  platform: string;
  rating?: number;
  stars?: string;
}

export interface CartItem {
  game: Game;
  quantity: number;
  addedAt: string;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

export interface CartContextType {
  cart: Record<string, CartItem>;
  addToCart: (gameId: number, quantity?: number) => boolean;
  removeFromCart: (gameId: number) => void;
  updateQuantity: (gameId: number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => CartTotals;
  getCartInfo: () => { items: Record<string, CartItem>; count: number; totals: CartTotals };
  checkout: () => void;
}
