import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, totalCount } = useCart();

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  if (totalCount === 0) {
    return (
      <div className="cart-empty">
        <p className="cart-empty-icon">🛒</p>
        <h2>Your cart is empty</h2>
        <p>Browse our categories and add some items!</p>
        <Link to="/" className="cart-shop-link">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="category-page">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-subtitle">{totalCount} item{totalCount !== 1 && "s"}</p>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.product.id} className="cart-item">
            <span className="cart-item-emoji">{item.product.emoji}</span>
            <div className="cart-item-info">
              <p className="cart-item-name">{item.product.name}</p>
              <p className="cart-item-qty">Qty: {item.qty}</p>
            </div>
            <span className="cart-item-price">
              Rs. {(item.product.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total</span>
        <span>Rs. {total.toLocaleString()}</span>
      </div>
    </div>
  );
}
