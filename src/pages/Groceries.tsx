import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Groceries() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "groceries")).then((snap) => {
      setProducts(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      );
      setLoading(false);
    });
  }, []);

  return (
    <div className="category-page">
      <h1 className="page-title">🛒 Groceries</h1>
      <p className="page-subtitle">Fresh produce, spices, and everyday essentials</p>
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
