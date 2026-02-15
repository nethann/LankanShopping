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
  const [imgIndex, setImgIndex] = useState(0);

  function handleAdd() {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const images = product.images || [];

  return (
    <>
      <div className="product-card">
        {images.length > 0 ? (
          <div className="product-image-wrap">
            <img src={images[imgIndex]} alt={product.name} className="product-image" />
            {images.length > 1 && (
              <div className="product-image-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`product-dot${i === imgIndex ? " active" : ""}`}
                    onClick={() => setImgIndex(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="product-image-placeholder">No image</div>
        )}
        <h3 className="product-name">{product.name}</h3>
        <p className="product-weight">{product.weight}</p>
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
