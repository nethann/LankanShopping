import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  totalCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextValue>(null!);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    const cartRef = collection(db, "users", user.uid, "cart");
    getDocs(cartRef).then(async (snap) => {
      const loaded: CartItem[] = snap.docs.map((d) => d.data() as CartItem);

      // Verify each cart item still exists in its product collection
      const verified: CartItem[] = [];
      for (const item of loaded) {
        // Check both collections
        const inGroceries = await getDoc(doc(db, "groceries", item.product.id));
        const inElectronics = await getDoc(doc(db, "electronics", item.product.id));
        if (inGroceries.exists() || inElectronics.exists()) {
          verified.push(item);
        } else {
          // Product was deleted — remove from user's cart in Firestore
          deleteDoc(doc(db, "users", user.uid, "cart", item.product.id));
        }
      }

      setItems(verified);
      setLoading(false);
    });
  }, [user]);

  function saveItemToFirestore(item: CartItem) {
    if (!user) return;
    setDoc(doc(db, "users", user.uid, "cart", item.product.id), {
      product: item.product,
      qty: item.qty,
    });
  }

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updated = [...prev, { product, qty: 1 }];
      }
      const item = updated.find((i) => i.product.id === product.id)!;
      saveItemToFirestore(item);
      return updated;
    });
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (user) {
      deleteDoc(doc(db, "users", user.uid, "cart", productId));
    }
  }

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, totalCount, loading }}>
      {children}
    </CartContext.Provider>
  );
}
