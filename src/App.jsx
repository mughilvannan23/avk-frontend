import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Bootstrap CSS & JS bundle
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Custom Styles
import './styles/custom-bootstrap-overrides.css';
import './styles/App.css';

// Context Providers
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import SidebarCart from './components/Layout/SidebarCart';
import Footer from './components/Layout/Footer';

import { FaWhatsapp } from 'react-icons/fa';

// Page Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

// Admin Page Components
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toastMessage } = useCart();

  return (
    <Router>
      {/* Sticky Header */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Slide-out Offcanvas Cart */}
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Global Toast Alert Box */}
      <div className="luxury-toast-container">
        {toastMessage && (
          <div className="luxury-toast">
            <span>✨</span>
            <div>{toastMessage}</div>
          </div>
        )}
      </div>

      {/* Main Pages Container */}
      <main style={{ minHeight: '65vh', paddingBottom: '3rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating WhatsApp Chat Widget */}
      <a 
        href="https://wa.me/917550394939?text=Hello%20AVK%20Pathira%20Maaligai%2C%20I%20have%20an%20inquiry%20about%20your%20products." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-whatsapp-widget"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </a>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
