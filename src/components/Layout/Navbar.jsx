import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaRegHeart, FaShoppingCart, FaBars } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { NAV_CATEGORIES } from '../../data/categories';
import logo from '../../assets/logo.jpg';

export default function Navbar({ onOpenCart }) {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  const isLinkActive = (path, category = null) => {
    if (category) {
      return location.pathname === '/shop' && activeCategory === category;
    }
    if (path === '/shop') {
      return location.pathname === '/shop' && !activeCategory;
    }
    return location.pathname === path;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Announcement Bar with Moving Marquee Text */}
      <div className="top-announcement-bar overflow-hidden py-2 position-relative">
        <div className="marquee-track d-flex align-items-center">
          <div className="marquee-content d-flex align-items-center gap-5 fw-bold" style={{ fontSize: '0.8rem' }}>
            <span>✨ பாரம்பரியத்தின் பெருமை... தரத்தின் அடையாளம்!</span>
            <span>🏆 Kumbakonam's Premium 100% Pure Brass & Copperware</span>
            <span>🚚 Free Shipping on Orders above ₹2,000</span>
            <span>🎁 Use Coupon Code: <span className="bg-white text-dark px-2 py-0.5 rounded fw-bold shadow-sm ms-1">AVK10</span> for 10% OFF</span>
            <span>⭐ Trusted Quality Since Decades</span>
          </div>
          {/* Duplicate content for seamless infinite loop */}
          <div className="marquee-content d-flex align-items-center gap-5 fw-bold ms-5" style={{ fontSize: '0.8rem' }} aria-hidden="true">
            <span>✨ பாரம்பரியத்தின் பெருமை... தரத்தின் அடையாளம்!</span>
            <span>🏆 Kumbakonam's Premium 100% Pure Brass & Copperware</span>
            <span>🚚 Free Shipping on Orders above ₹2,000</span>
            <span>🎁 Use Coupon Code: <span className="bg-white text-dark px-2 py-0.5 rounded fw-bold shadow-sm ms-1">AVK10</span> for 10% OFF</span>
            <span>⭐ Trusted Quality Since Decades</span>
          </div>
        </div>
      </div>

      {/* Main Header (Non-sticky) */}
      <header className="main-header shadow-sm py-2">
        <div className="container">
          <div className="row align-items-center gy-2">
            {/* Brand Logo (Left on Mobile, Center on Desktop) */}
            <div className="col-6 col-md-4 order-1 order-md-2 d-flex align-items-center justify-content-start justify-content-md-center">
              <Link to="/" className="d-inline-flex align-items-center text-decoration-none">
                <img
                  src={logo}
                  alt="AVK Pathira Maaligai"
                  style={{ height: '60px', width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
              </Link>
            </div>

            {/* Cart Icon (Right on Mobile, Right on Desktop) */}
            <div className="col-6 col-md-4 order-2 order-md-3 text-end">
              <div className="d-flex justify-content-end align-items-center gap-3">
                <button
                  onClick={onOpenCart}
                  className="nav-icon-btn position-relative"
                  title="Shopping Cart"
                >
                  <FaShoppingCart />
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar (Full Width on Mobile, Left on Desktop) */}
            <div className="col-12 col-md-4 order-3 order-md-1 mt-2 mt-md-0">
              <form onSubmit={handleSearchSubmit} className="position-relative">
                <input
                  type="text"
                  placeholder="Search brass utensils, copper bottles..."
                  className="form-control form-control-luxury w-100 pe-5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 pe-3 text-secondary"
                  style={{ zIndex: 5 }}
                >
                  <FaSearch />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation Menu (Sticky on Scroll) */}
      <nav className="navbar navbar-expand-lg category-navbar sticky-top py-2">
        <div className="container d-flex align-items-center justify-content-start justify-content-lg-between">
          {/* CATEGORIES button aligned to left on mobile */}
          <button
            className="navbar-toggler border-0 me-auto p-0 text-start"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#categoryNavbarCollapse"
            aria-controls="categoryNavbarCollapse"
            aria-expanded="false"
            aria-label="Toggle categories"
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            <span className="text-dark d-flex align-items-center gap-2">
              <FaBars /> <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>CATEGORIES</span>
            </span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="categoryNavbarCollapse">
            <ul className="navbar-nav text-start text-lg-center flex-wrap justify-content-center">
              <li className="nav-item">
                <Link className={`nav-link ${isLinkActive('/shop') ? 'active' : ''}`} to="/shop">All Products</Link>
              </li>
              {NAV_CATEGORIES.map((cat) => (
                <li className="nav-item" key={cat}>
                  <Link
                    className={`nav-link ${isLinkActive('/shop', cat) ? 'active' : ''}`}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky Cart Icon Button: Only visible when scrolled down */}
          <div 
            className="d-flex align-items-center ms-auto me-2 me-lg-0"
            style={{
              opacity: isScrolled ? 1 : 0,
              visibility: isScrolled ? 'visible' : 'hidden',
              pointerEvents: isScrolled ? 'auto' : 'none',
              transition: 'opacity 0.25s ease, visibility 0.25s ease'
            }}
          >
            <button 
              onClick={onOpenCart} 
              className="nav-icon-btn position-relative" 
              title="Shopping Cart"
            >
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
