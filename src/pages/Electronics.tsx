import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Electronics() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "electronics")).then((snap) => {
      setProducts(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      );
      setLoading(false);
    });
  }, []);

  return (
    <div className="category-page">
      <h1 className="page-title">💻 Electronics</h1>
      <p className="page-subtitle">Gadgets, accessories, and smart devices</p>
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
