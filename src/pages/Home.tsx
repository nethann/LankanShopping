import { Link } from "react-router-dom";

const categories = [
  {
    name: "Groceries",
    path: "/groceries",
    emoji: "🛒",
    description: "Fresh produce, spices, rice, tea, and everyday essentials.",
    color: "#e8f5e9",
    accent: "#2e7d32",
  },
  {
    name: "Electronics",
    path: "/electronics",
    emoji: "💻",
    description: "Gadgets, accessories, audio gear, and smart devices.",
    color: "#e3f2fd",
    accent: "#1565c0",
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
          <Link
            to={cat.path}
            key={cat.name}
            className="category-card"
            style={{ "--card-bg": cat.color, "--card-accent": cat.accent } as React.CSSProperties}
          >
            <span className="category-emoji">{cat.emoji}</span>
            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.description}</p>
            <span className="category-cta">Browse {cat.name} &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
