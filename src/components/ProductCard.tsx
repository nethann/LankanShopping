import { useState } from "react";
import type { Product } from "../data/products";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import LoginPrompt from "./LoginPrompt";

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [showPrompt, setShowPrompt] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <>
      <div className="product-card">
        <div className="product-emoji">{product.emoji}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">Rs. {product.price.toLocaleString()}</span>
          <button
            className={`add-to-cart-btn${added ? " added" : ""}`}
            onClick={handleAdd}
          >
            {added ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
      {showPrompt && <LoginPrompt onClose={() => setShowPrompt(false)} />}
    </>
  );
}
