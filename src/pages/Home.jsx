import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAward, FaBoxOpen, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { mockApi } from '../services/mockApi';
import ProductCard from '../components/Product/ProductCard';

import hero from "../assets/hero-img.png"

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await mockApi.getProducts({ sortBy: 'rating' });
        // Take top 4 best sellers
        setBestSellers(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  // Collections details for the grid display
  const collections = [
    { name: "Aradhya", subtitle: "Gods & Idols", category: "Gods & Idols", image: "https://images.unsplash.com/photo-1608976478546-d5bbca0464f6?auto=format&fit=crop&w=600&q=80" },
    { name: "Pabitra", subtitle: "Pooja Decor & Diyas", category: "Pooja Decor", image: "https://images.unsplash.com/photo-1602693680091-bf31362e6840?auto=format&fit=crop&w=600&q=80" },
    { name: "Rasoi", subtitle: "Kitchen Utensils", category: "Kitchen Utensils", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80" },
    { name: "Patra", subtitle: "Steel Vessels", category: "Steel Vessels", image: "https://images.unsplash.com/photo-1610223512967-33a759600a06?auto=format&fit=crop&w=600&q=80" },
    { name: "Puratana", subtitle: "Brass Antiques", category: "Brass Antiques", image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80" },
    { name: "Tamra", subtitle: "Copperware & Bottles", category: "Copper Bottles", image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80" }
  ];

  // FAQ items listing matching reference screenshots
  const faqs = [
    {
      q: "What is AVK Pathira Maaligai?",
      a: "AVK Pathira Maaligai is a premier destination for traditional Kumbakonam brassware, copperware, bronze idols, pooja utensils, and luxury home decor. Rooted in traditional craftsmanship, we provide premium quality brassware and copperware for homes, gifts, and temple needs."
    },
    {
      q: "What products does AVK Pathira Maaligai sell?",
      a: "We specialize in high-quality brass vessels, copper bottles, water carafes, traditional ghee pots with tin lining (Kalai), peacock diya stands, Ganesha idols, vintage clock structures, and custom Pooja decor items."
    },
    {
      q: "What makes AVK Pathira Maaligai different from other online stores?",
      a: "All items at AVK Pathira Maaligai are handcrafted in Kumbakonam, a city world-renowned for its heritage brass casting. Our products feature 100% pure brass and copper, traditional heavy weights, and unmatched structural durability."
    },
    {
      q: "Are the brass products genuine and handcrafted?",
      a: "Yes, 100%. Our products are completely hand-cast and hand-finished. Minor variations in luster, markings, and engraving are natural characteristics of handcrafted artisanal metalware, making each piece uniquely beautiful."
    },
    {
      q: "What materials are used to make the products?",
      a: "We use premium structural brass, high-grade copper (for water bottles and utensils), and traditional tin lining (Kalai) inside ghee pots and cookware to ensure safety and chemical neutrality."
    },
    {
      q: "Is it auspicious to gift brassware?",
      a: "Absolutely! Gifting traditional brassware, ghee pots, or deity idols stands for wealth, prosperity, and goodwill. It is a highly respected gift choice in Indian tradition for housewarmings, weddings, and festivals."
    },
    {
      q: "Does AVK Pathira Maaligai offer customization or bulk orders?",
      a: "Yes! We support bulk orders for corporate gifting, family functions, and customized sizes. Reach out directly to our customer care team via WhatsApp at +91 75503 94939 or visit us at No.74, T.S.R Big Street, Kumbakonam."
    }
  ];

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-12 col-md-6 order-1 order-md-1">
              <span
                style={{
                  color: "#AA771C",
                  // WebkitBackgroundClip: "text",
                  // WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                உயர்தர பித்தளை மற்றும் செம்பு பொருட்கள்
              </span>
              <h1 className="hero-title text-uppercase" style={{ fontSize: '2.8rem' }}>AVK Pathira Maaligai</h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                Kumbakonam's Pride of Tradition, Mark of Quality. Explore our wide collection of premium quality, hand-crafted brass and copper items made for daily domestic use, pooja spaces, and gifting.
              </p>
              <Link to="/shop" className="btn btn-luxury px-5 py-3 fw-bold">
                EXPLORE COLLECTIONS
              </Link>
            </div>
            <div className="col-12 col-md-6 order-2 order-md-2">
              <div className="hero-image-wrapper" >
                <img
                  src={hero}
                  alt="AVK Brassware Kumbakonam"
                  style={{ maxWidth: "100%" }}
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Ribbon representing user Instagram key points */}
      <section className="features-ribbon">
        <div className="container">
          <div className="row text-center gy-3 gy-md-0">
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <FaAward className="feature-icon" />
                <div className="feature-text">
                  <div className="fw-bold lh-sm mb-1" style={{ fontSize: '0.9rem' }}>Premium Quality</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>உயர்தரமான தயாரிப்புகள்</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <FaBoxOpen className="feature-icon" />
                <div className="feature-text">
                  <div className="fw-bold lh-sm mb-1" style={{ fontSize: '0.9rem' }}>Perfect Gift Choice</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>பரிசளிக்க சிறந்தவை</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <div className="fw-bold lh-sm mb-1" style={{ fontSize: '0.9rem' }}>Long Lasting</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>நீண்ட நாள் நீடிக்கும் தரம்</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <div className="feature-text">
                  <div className="fw-bold lh-sm mb-1" style={{ fontSize: '0.9rem' }}>Trusted Brand</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>நம்பிக்கைக்குரிய தரம்</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Premium Collections Grid (Indian Art Villa layout) */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="section-divider-title">
            Our Premium Collections
            <div className="divider-diamonds">
              <span>◆</span><span>◆</span><span>◆</span>
            </div>
          </h2>

          <div className="collections-grid">
            {collections.map((col, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${encodeURIComponent(col.category)}`}
                className="collection-card text-decoration-none"
              >
                <img
                  src={col.image}
                  alt={col.subtitle}
                  className="collection-card-img"
                  loading="lazy"
                />
                <div className="collection-card-overlay">
                  <div className="collection-title-cursive">{col.name}</div>
                  <div className="collection-subtitle">{col.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-divider-title">
            Our Best Sellers
            <div className="divider-diamonds">
              <span>◆</span><span>◆</span><span>◆</span>
            </div>
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {bestSellers.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/shop" className="btn btn-luxury-outline px-5 py-3 fw-bold">
              VIEW ALL PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-5" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2dfd7' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-divider-title">
            Frequently Asked Questions
            <div className="divider-diamonds">
              <span>◆</span><span>◆</span><span>◆</span>
            </div>
          </h2>

          <div className="accordion accordion-luxury mt-4" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                  >
                    {faq.q}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-secondary small" style={{ lineHeight: '1.8' }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
