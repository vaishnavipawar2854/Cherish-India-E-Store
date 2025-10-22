import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { DarkModeProvider } from "./context/DarkModeContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen gradient-ocean smooth-scroll">
              <Header />
              <main className="container mx-auto px-4 py-8 fade-in stagger-parent">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
              <Toaster 
                position="top-right" 
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 119, 182, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: 'hsl(var(--ocean-blue))',
                      secondary: 'hsl(var(--card))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: 'hsl(var(--destructive))',
                      secondary: 'hsl(var(--card))',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
