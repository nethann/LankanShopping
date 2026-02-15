import { electronicProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Electronics() {
  return (
    <div className="category-page">
      <h1 className="page-title">💻 Electronics</h1>
      <p className="page-subtitle">Gadgets, accessories, and smart devices</p>
      <div className="product-grid">
        {electronicProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
