import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Groceries() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  useEffect(() => {
    getDocs(collection(db, "groceries")).then((snap) => {
      setProducts(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      );
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((product) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return (
      product.name.toLowerCase().includes(needle) ||
      product.weight.toLowerCase().includes(needle)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="category-page">
      <section className="catalog-hero catalog-hero-groceries">
        <p className="catalog-badge">Groceries</p>
        <h1 className="page-title">Fresh pantry and produce</h1>
        <p className="page-subtitle">Find spices, grains, snacks, and daily essentials from Sri Lanka.</p>
      </section>

      <section className="catalog-controls">
        <input
          className="catalog-search"
          type="search"
          placeholder="Search groceries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="catalog-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <div className="catalog-chip">{products.length} total</div>
        <div className="catalog-chip">{filteredProducts.length} showing</div>
      </section>

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : sortedProducts.length === 0 ? (
        <div className="catalog-empty">
          <h3>No groceries found</h3>
          <p>Try another search term or clear filters.</p>
        </div>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
