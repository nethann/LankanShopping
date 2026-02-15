import type { Product } from "../data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <div className="product-emoji">{product.emoji}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-footer">
        <span className="product-price">Rs. {product.price.toLocaleString()}</span>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}
