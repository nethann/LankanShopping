import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Lankan Shopping
      </Link>

      <div className="navbar-actions">
        {/* Cart icon — only shown when logged in */}
        {user && (
          <Link to="/cart" className="nav-icon cart-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
        )}

        {/* Profile */}
        {user ? (
          <div className="profile-wrapper" ref={menuRef}>
            <button
              className="profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <img
                src={user.photoURL || undefined}
                alt=""
                className="profile-avatar"
                referrerPolicy="no-referrer"
              />
            </button>
            {menuOpen && (
              <div className="profile-menu">
                <p className="profile-menu-name">{user.displayName}</p>
                <p className="profile-menu-email">{user.email}</p>
                <button className="profile-menu-logout" onClick={logout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-in-btn" onClick={signInWithGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
