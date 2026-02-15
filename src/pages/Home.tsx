import { Link } from "react-router-dom";

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
      <div className="promo-grid">
        <article className="promo-card promo-card-orange promo-card-small">
          <h2>Save more every day</h2>
          <p>Keells deals and member savings on essentials.</p>
          <Link to="/promo/save-more-every-day" className="promo-cta">
            Shop Now
          </Link>
        </article>

        <article className="promo-card promo-card-purple promo-card-small">
          <h2>Ramadan Specials</h2>
          <p>Up to 25% off on selected imported products.</p>
          <Link to="/promo/ramadan-specials" className="promo-cta">
            Shop Now
          </Link>
        </article>

        <article className="promo-card promo-card-amber promo-card-wide">
          <h2>Exploring Sinhala & Tamil New Year Delicacies</h2>
          <p>Shop now!</p>
          <Link to="/promo/sinhala-tamil-new-year-delicacies" className="promo-cta">
            Shop Now
          </Link>
        </article>

        <article className="promo-card promo-card-forest">
          <h2>Register with rewards</h2>
          <p>Sign in and unlock member pricing and quick checkout.</p>
          <Link to="/promo/register-with-rewards" className="promo-cta">
            Register
          </Link>
        </article>

        <article className="promo-card promo-card-mint">
          <h2>All your household needs</h2>
          <p>Groceries and daily-use items in one place.</p>
          <Link to="/promo/all-your-household-needs" className="promo-cta">
            Shop Now
          </Link>
        </article>

        <article className="promo-card promo-card-green">
          <h2>Weekly export picks</h2>
          <p>Top-selling pantry bundles selected for overseas buyers.</p>
          <Link to="/promo/weekly-export-picks" className="promo-cta">
            Shop Now
          </Link>
        </article>

        <article className="promo-card promo-card-sky">
          <h2>Explore Lankan brands</h2>
          <p>Find trusted local products from across Sri Lanka.</p>
          <Link to="/promo/explore-lankan-brands" className="promo-cta">
            Explore
          </Link>
        </article>
      </div>

      <div className="hero">
        <h1>Shop by Category</h1>
        <p>Find the right products and place your order in minutes</p>
      </div>

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
    </div>
  );
}
