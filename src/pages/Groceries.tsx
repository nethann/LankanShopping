import { groceryProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Groceries() {
  return (
    <div className="category-page">
      <h1 className="page-title">🛒 Groceries</h1>
      <p className="page-subtitle">Fresh produce, spices, and everyday essentials</p>
      <div className="product-grid">
        {groceryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
