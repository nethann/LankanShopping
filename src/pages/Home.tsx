import { Link } from "react-router-dom";
import SeedButton from "../components/SeedButton";

const categories = [
  {
    name: "Groceries",
    path: "/groceries",
    emoji: "🛒",
    description: "Fresh produce, spices, rice & essentials",
  },
  {
    name: "Electronics",
    path: "/electronics",
    emoji: "💻",
    description: "Gadgets, accessories & smart devices",
  },
];

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Lankan Shopping</h1>
        <p>Your one-stop shop for quality products at great prices</p>
      </div>
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link to={cat.path} key={cat.name} className="category-card">
            <span className="category-emoji">{cat.emoji}</span>
            <div className="category-text">
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.description}</p>
            </div>
            <span className="category-arrow">&rarr;</span>
          </Link>
        ))}
      </div>
      <div className="seed-section">
        <SeedButton />
      </div>
    </div>
  );
}
