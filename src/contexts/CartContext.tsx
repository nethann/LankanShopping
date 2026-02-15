import { createContext, useContext, useState } from "react";
import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue>(null!);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}
