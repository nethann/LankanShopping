import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Groceries from "./pages/Groceries";
import Electronics from "./pages/Electronics";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/groceries" element={<Groceries />} />
                <Route path="/electronics" element={<Electronics />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
          </BrowserRouter>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
