import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <h3>Lankan Shopping</h3>
          <p>Sri Lankan products for customers around the world.</p>
        </div>

        <div className="site-footer-links">
          <Link to="/">Home</Link>
          <Link to="/groceries">Groceries</Link>
          <Link to="/electronics">Electronics</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </div>

      <p className="site-footer-copy">© {year} Lankan Shopping. All rights reserved.</p>
    </footer>
  );
}
